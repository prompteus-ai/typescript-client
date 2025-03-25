# Prompteus TypeScript Client

A TypeScript client library for interacting with the Prompteus Neuron Runner API (aka. calling Neurons)

## Installation

```bash
npm i @prompteus-ai/neuron-runner
```

## Documentation

For detailed documentation, visit:
- [Prompteus Documentation](https://docs.prompteus.com)
- [Neuron API Reference](https://docs.prompteus.com/neurons/api)

## Usage

```typescript
import { Prompteus } from 'prompteus';

// Create a client instance
const client = new Prompteus({
  jwtOrApiKey: 'your-jwt-token', // Optional
  baseURL: 'https://run.prompteus.com' // Optional, defaults to this value
});

// Call a neuron
try {
  const response = await client.callNeuron('your-org', 'your-neuron', {
    input: 'Hello, world!',
    rawOutput: false, // Optional, defaults to false
    bypassCache: false, // Optional, defaults to false
    headers: {} // Optional, additional headers
  });
  console.log(response);
} catch (error) {
  console.error(error);
}
```

## Authentication

The JWT token or API key can be provided in multiple ways:

1. During client creation:
```typescript
const client = new Prompteus({ jwtOrApiKey: 'your-token' });
```

2. Using the setter method:
```typescript
client.setJwtOrApiKey('your-token');
```

3. Per request in the options:
```typescript
await client.callNeuron('org', 'neuron', {
  jwtOrApiKey: 'your-token'
});
```

Note: Authentication is not required if the neuron has public access enabled. See [Access Control Documentation](https://docs.prompteus.com/neurons/settings/access-control) for more details.

## API Reference

### Prompteus Class

#### Constructor

```typescript
constructor(options?: PrompteusOptions)
```

Options:
- `jwtOrApiKey?: string` - JWT token or API key for authentication
- `baseURL?: string` - Base URL for the Prompteus API (defaults to "https://run.prompteus.com")

#### Methods

##### setJwtOrApiKey

```typescript
setJwtOrApiKey(jwtOrApiKey: string): void
```

Sets the JWT token or API key for all subsequent requests.

##### callNeuron

```typescript
callNeuron(
  organizationSlug: string,
  neuronSlug: string,
  options?: CallNeuronOptions
): Promise<NeuronSuccessResponse | string>
```

Options:
- `input?: string` - Input text for the neuron (defaults to empty string)
- `rawOutput?: boolean` - Whether to return raw text output (defaults to false)
- `bypassCache?: boolean` - Whether to bypass caching (defaults to false)
- `headers?: Record<string, string>` - Additional headers to include, usually not required if using the default Prompteus API
- `jwtOrApiKey?: string` - JWT token or API key for this specific request

## Development

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Format code
npm run format
```

## License

MIT