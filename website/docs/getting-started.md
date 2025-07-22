# Getting Started with FDC3

Welcome to FDC3 (Financial Desktop Connectivity and Collaboration Consortium)! This guide will help you understand the core concepts and get started with implementing FDC3 in your financial applications.

## What is FDC3?

FDC3 is an open standard for desktop application interoperability in financial workflows. It enables applications to:

- **Share context data** between applications (instruments, contacts, portfolios, etc.)
- **Raise intents** to trigger actions in other applications
- **Communicate via channels** for real-time data synchronization

## Core Concepts

### Context Data
Context represents shared data objects that applications can exchange. Common context types include:

- `fdc3.instrument` - Financial instruments (stocks, bonds, etc.)
- `fdc3.contact` - Contact information
- `fdc3.portfolio` - Investment portfolios
- `fdc3.nothing` - Empty context for clearing or default states

### Intents
Intents represent actions that applications can perform with context data:

- `ViewChart` - Display a chart for an instrument
- `StartCall` - Initiate a call with a contact
- `ViewProfile` - Show detailed information

### Channels
Channels enable applications to broadcast and listen for context updates:

- **User Channels** - Shared channels that users can join
- **App Channels** - Private channels between specific applications
- **Private Channels** - Secure channels for sensitive data

## Quick Start

### 1. Install FDC3

```bash
npm install @finos/fdc3
```

### 2. Basic Context Sharing

```javascript
import { fdc3 } from '@finos/fdc3';

// Broadcast an instrument context
const instrument = {
  type: 'fdc3.instrument',
  id: {
    ticker: 'AAPL'
  },
  name: 'Apple Inc.'
};

await fdc3.broadcast(instrument);
```

### 3. Listen for Context

```javascript
// Listen for any context type
const listener = await fdc3.addContextListener(null, (context) => {
  console.log('Received context:', context);
});

// Listen for specific context type
const instrumentListener = await fdc3.addContextListener('fdc3.instrument', (context) => {
  console.log('Received instrument:', context.name);
});
```

### 4. Raise an Intent

```javascript
// Raise an intent with context
const resolution = await fdc3.raiseIntent('ViewChart', instrument);

// Raise an intent without context (uses fdc3.nothing)
const resolution = await fdc3.raiseIntent('ViewNews');
```

### 5. Work with Channels

```javascript
// Get available user channels
const channels = await fdc3.getUserChannels();

// Join a channel
await fdc3.joinUserChannel(channels[0].id);

// Get current channel
const currentChannel = await fdc3.getCurrentChannel();

// Leave current channel
await fdc3.leaveCurrentChannel();
```

## Development Tools

### FDC3 Workbench
The [FDC3 Workbench](https://fdc3.finos.org/toolbox/fdc3-workbench/) is a web-based testing tool that allows you to:

- Test context broadcasting and listening
- Experiment with intent raising
- Explore different context types
- Debug FDC3 implementations

### FDC3 Conformance Framework
Use the conformance tests to validate your FDC3 implementation against the standard.

## Best Practices

### Context Design
- Use standard context types when possible
- Include all relevant identifiers in context objects
- Follow the context data specification for custom types

### Error Handling
```javascript
try {
  await fdc3.raiseIntent('ViewChart', instrument);
} catch (error) {
  if (error.message === 'NoAppsFound') {
    console.log('No applications can handle this intent');
  }
}
```

### Channel Management
- Always check if you're joined to a channel before broadcasting
- Use app channels for private communication between specific applications
- Clean up listeners when components unmount

## Next Steps

- Explore the [API Reference](./api/ref/DesktopAgent) for detailed method documentation
- Check out [Context Data Types](./context/spec) for available context schemas
- Review [Intent Reference](./intents/spec) for standard intents
- Try the [FDC3 Workbench](https://fdc3.finos.org/toolbox/fdc3-workbench/) for hands-on experimentation

## Common Use Cases

### Portfolio Management
```javascript
// Share a portfolio between applications
const portfolio = {
  type: 'fdc3.portfolio',
  id: {
    name: 'Tech Growth Portfolio'
  },
  positions: [
    { instrument: { ticker: 'AAPL' }, holding: 100 },
    { instrument: { ticker: 'GOOGL' }, holding: 50 }
  ]
};

await fdc3.broadcast(portfolio);
```

### Cross-Application Workflows
```javascript
// Workflow: Research → Analysis → Trading
// 1. Research app broadcasts instrument
await fdc3.broadcast(instrument);

// 2. Analysis app receives and processes
const listener = await fdc3.addContextListener('fdc3.instrument', async (context) => {
  // Perform analysis
  const analysis = await analyzeInstrument(context);
  
  // Raise intent to trading app
  await fdc3.raiseIntent('PlaceOrder', {
    type: 'fdc3.order',
    instrument: context,
    quantity: analysis.recommendedQuantity
  });
});
```

## Support and Resources

- [FDC3 Standard Documentation](https://fdc3.finos.org/)
- [GitHub Repository](https://github.com/finos/FDC3)
- [FINOS Community](https://www.finos.org/fdc3)
- [Slack Channel](https://finos-lf.slack.com/messages/fdc3/)

Ready to build interoperable financial applications with FDC3!
