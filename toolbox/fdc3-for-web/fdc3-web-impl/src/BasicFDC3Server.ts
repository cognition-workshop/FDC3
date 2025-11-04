import { FDC3Server } from './FDC3Server';
import { AppRegistration, InstanceID, ServerContext, State } from './ServerContext';
import { BroadcastHandler, ChannelState } from './handlers/BroadcastHandler';
import { IntentHandler } from './handlers/IntentHandler';
import { Directory } from './directory/DirectoryInterface';
import { OpenHandler } from './handlers/OpenHandler';
import { HeartbeatHandler } from './handlers/HeartbeatHandler';
import {
  AppRequestMessage,
  WebConnectionProtocol4ValidateAppIdentity,
  WebConnectionProtocol6Goodbye,
} from '@finos/fdc3-schema/dist/generated/api/BrowserTypes';

export interface HeartbeatConfig {
  pingInterval?: number;
  disconnectedAfter?: number;
  deadAfter?: number;
}

export interface MessageHandler {
  /**
   * Handles an AgentRequestMessage from the messaging source. This function
   * is called by BasicFDC3Server on every message received and should only
   * process those it supports.
   */
  accept(
    msg: AppRequestMessage | WebConnectionProtocol4ValidateAppIdentity | WebConnectionProtocol6Goodbye,
    sc: ServerContext<AppRegistration>,
    from: InstanceID
  ): Promise<void>;

  /**
   * Clean-up any state relating to a instance that has disconnected.
   */
  cleanup(instanceId: InstanceID, sc: ServerContext<AppRegistration>): void;

  shutdown(): void;
}

/**
 * This defers all functionality to either MessageHandler's or the ServerContext objects.
 */
export class BasicFDC3Server implements FDC3Server {
  readonly handlers: MessageHandler[];
  private sc: ServerContext<AppRegistration>;

  constructor(handlers: MessageHandler[], sc: ServerContext<AppRegistration>) {
    this.handlers = handlers;
    this.sc = sc;
  }

  cleanup(instanceId: InstanceID): void {
    this.handlers.forEach(handler => handler.cleanup(instanceId, this.sc));
    this.sc.setAppState(instanceId, State.Terminated);
  }

  async receive(
    message: AppRequestMessage | WebConnectionProtocol4ValidateAppIdentity | WebConnectionProtocol6Goodbye,
    from: InstanceID
  ): Promise<void> {
    const promises = this.handlers.map(h => h.accept(message, this.sc, from));
    await Promise.allSettled(promises);
  }

  shutdown(): void {
    this.handlers.forEach(h => h.shutdown());
  }
}

export class DefaultFDC3Server extends BasicFDC3Server {
  constructor(
    sc: ServerContext<AppRegistration>,
    directory: Directory,
    userChannels: ChannelState[],
    heartbeats: boolean | HeartbeatConfig,
    intentTimeoutMs: number = 20000,
    openHandlerTimeoutMs: number = 10000
  ) {
    const handlers: MessageHandler[] = [
      new BroadcastHandler(userChannels),
      new IntentHandler(directory, intentTimeoutMs),
      new OpenHandler(directory, openHandlerTimeoutMs),
    ];

    if (heartbeats) {
      let heartbeatConfig: HeartbeatConfig;
      
      if (typeof heartbeats === 'boolean') {
        heartbeatConfig = {
          pingInterval: openHandlerTimeoutMs / 10,
          disconnectedAfter: openHandlerTimeoutMs / 2,
          deadAfter: openHandlerTimeoutMs,
        };
      } else {
        heartbeatConfig = {
          pingInterval: heartbeats.pingInterval ?? 1000,
          disconnectedAfter: heartbeats.disconnectedAfter ?? 5000,
          deadAfter: heartbeats.deadAfter ?? 20000,
        };
      }

      handlers.push(
        new HeartbeatHandler(
          heartbeatConfig.pingInterval,
          heartbeatConfig.disconnectedAfter,
          heartbeatConfig.deadAfter
        )
      );
    }

    super(handlers, sc);
  }
}
