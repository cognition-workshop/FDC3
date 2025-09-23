---
id: getting-started
title: Getting Started with FDC3
sidebar_label: Getting Started
---

# Getting Started with FDC3

Welcome to FDC3! This guide will help you quickly understand and start using the Financial Desktop Connectivity and Collaboration Consortium (FDC3) standard for building interoperable financial desktop applications.

## What is FDC3?

FDC3 is an open standard that enables financial desktop applications to interoperate seamlessly without requiring bilateral integrations. It provides:

- **Standardized APIs** for desktop application communication
- **Context sharing** between applications using typed data structures
- **Intent-based workflows** for coordinated user actions
- **App Directory** for discovering and launching applications
- **Desktop Agent** runtime for managing application interactions

## Quick Setup

### 1. Install the FDC3 Package

Add FDC3 to your application using npm:

```bash
npm install @finos/fdc3
```

### 2. Connect to a Desktop Agent

Before using FDC3 APIs, your application needs to connect to a Desktop Agent:

```typescript
import { getAgent } from '@finos/fdc3';

// Connect to the Desktop Agent
const agent = await getAgent();
console.log('Connected to FDC3 Desktop Agent');
```

## Basic Examples

### Sharing Context Data

Share typed context data with other applications:

```typescript
import { getAgent, Instrument } from '@finos/fdc3';

const agent = await getAgent();

// Create an instrument context
const instrument: Instrument = {
  type: 'fdc3.instrument',
  id: {
    ticker: 'AAPL'
  },
  name: 'Apple Inc.'
};

// Broadcast the context to other applications
await agent.broadcast(instrument);
```

### Listening for Context

Listen for context data from other applications:

```typescript
import { getAgent, Context } from '@finos/fdc3';

const agent = await getAgent();

// Listen for any context type
const listener = await agent.addContextListener(null, (context: Context) => {
  console.log('Received context:', context);
  
  if (context.type === 'fdc3.instrument') {
    // Handle instrument context
    displayInstrument(context);
  }
});
```

### Raising Intents

Request specific actions from other applications:

```typescript
import { getAgent, Instrument } from '@finos/fdc3';

const agent = await getAgent();

const instrument: Instrument = {
  type: 'fdc3.instrument',
  id: { ticker: 'MSFT' },
  name: 'Microsoft Corporation'
};

// Ask another app to show a chart for this instrument
const resolution = await agent.raiseIntent('ViewChart', instrument);
console.log('Chart displayed by:', resolution.source);
```

### Handling Intents

Register your application to handle specific intents:

```typescript
import { getAgent, IntentResult } from '@finos/fdc3';

const agent = await getAgent();

// Register to handle ViewChart intents
const listener = await agent.addIntentListener('ViewChart', (context) => {
  console.log('Received ViewChart intent with context:', context);
  
  // Display the chart in your application
  showChart(context);
  
  // Optionally return a result
  return { type: 'fdc3.nothing' } as IntentResult;
});
```

## Working with Channels

Channels provide organized context sharing between applications:

```typescript
import { getAgent } from '@finos/fdc3';

const agent = await getAgent();

// Join a specific channel
await agent.joinUserChannel('red');

// Get current channel
const currentChannel = await agent.getCurrentChannel();
console.log('Current channel:', currentChannel?.id);

// Listen for context on current channel
const listener = await agent.addContextListener(null, (context) => {
  console.log('Context received on channel:', context);
});
```

## Testing Your Integration

### Using FDC3 Workbench

The FDC3 Workbench is an interactive tool for testing FDC3 integrations:

1. Visit [FDC3 Workbench](https://fdc3.finos.org/toolbox/fdc3-workbench/)
2. Test context broadcasting and intent raising
3. Verify your application responds correctly to FDC3 events

### Desktop Agent Implementations

To run FDC3 applications, you need a Desktop Agent. Popular implementations include:

- [Finsemble](https://www.chartiq.com/finsemble/) by ChartIQ
- [OpenFin](https://www.openfin.co/) Platform
- [Glue42](https://glue42.com/) Desktop
- [FDC3 Desktop Agent](https://github.com/finos/fdc3-desktop-agent) (reference implementation)

## Next Steps

### Explore the Documentation

- **[API Reference](../api/ref/DesktopAgent)** - Complete FDC3 API documentation
- **[Context Data Types](../context/spec)** - Available context data structures
- **[Standard Intents](../intents/spec)** - Predefined intent types
- **[Use Cases](../use-cases/overview)** - Real-world FDC3 scenarios

### Join the Community

- **[GitHub Repository](https://github.com/finos/FDC3)** - Source code and issues
- **[FINOS Slack](https://finos-lf.slack.com/messages/fdc3/)** - Community discussions
- **[Mailing List](mailto:fdc3+subscribe@finos.org)** - Stay updated with announcements

### Advanced Topics

- **[App Directory](../app-directory/spec)** - Application discovery and metadata
- **[Agent Bridging](../agent-bridging/spec)** - Connecting multiple Desktop Agents
- **[Supported Platforms](../api/supported-platforms)** - Platform-specific considerations

## Common Patterns

### Error Handling

Always handle FDC3 errors gracefully:

```typescript
import { getAgent, ResolveError } from '@finos/fdc3';

try {
  const agent = await getAgent();
  const resolution = await agent.raiseIntent('ViewChart', context);
} catch (error) {
  if (error === ResolveError.NoAppsFound) {
    console.log('No applications available to handle this intent');
  } else {
    console.error('FDC3 error:', error);
  }
}
```

### Type Safety

Use TypeScript for better development experience:

```typescript
import { getAgent, Contact, ContactList } from '@finos/fdc3';

const agent = await getAgent();

// Type-safe context creation
const contact: Contact = {
  type: 'fdc3.contact',
  name: 'John Doe',
  id: {
    email: 'john.doe@example.com'
  }
};

await agent.broadcast(contact);
```

Ready to build interoperable financial applications with FDC3? Start with the examples above and explore the comprehensive API documentation for advanced features.
