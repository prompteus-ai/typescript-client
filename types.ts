/**
 * Options for creating a Prompteus client
 */
export interface PrompteusOptions {
  /** JWT token or API key for authentication. This is optional and can be:
   * - Set later using setJwtOrApiKey()
   * - Provided per request in callNeuron options
   * - Not required if the neuron has public access enabled
   * @see https://docs.prompteus.com/neurons/settings/access-control
   */
  jwtOrApiKey?: string;
  /** The base URL for the Prompteus API (defaults to "https://run.prompteus.com") */
  baseURL?: string;
}

/**
 * Options for calling a neuron
 */
export interface CallNeuronOptions {
  /** Whether to bypass the cache and force a new execution. By default, Prompteus caches responses to:
   * - Reduce costs by avoiding unnecessary AI provider API calls
   * - Improve response times by returning cached results instantly
   * - Maintain consistency for identical or similar queries
   * 
   * When set to true, this will force a new execution and bypass both exact and semantic caching.
   * @see https://docs.prompteus.com/neurons/settings/caching
   */
  bypassCache?: boolean;
  /** The input string to send to the neuron */
  input?: string;
  /** Whether to return the raw output without any processing */
  rawOutput?: boolean;
  /** Additional headers to include in the request. If Authorization is included here, it will override any previously set JWT/API key */
  headers?: Record<string, string>;
  /** JWT token or API key for authentication. If provided, it will override any previously set JWT/API key */
  jwtOrApiKey?: string;
}

/**
 * Successful response from a neuron execution
 */
export interface NeuronSuccessResponse {
  /** The output generated by the neuron */
  output?: string;
  /** Whether the response was served from cache */
  fromCache?: boolean;
  /** Whether the execution was stopped prematurely */
  executionStopped?: boolean;
}

/**
 * Error response from a neuron execution
 */
export interface NeuronErrorResponse {
  /** The error message describing what went wrong */
  error: string;
  /** The HTTP status code of the error response */
  statusCode: number;
} 