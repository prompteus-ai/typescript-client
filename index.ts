import { CallNeuronOptions, NeuronSuccessResponse, NeuronErrorResponse, PrompteusOptions } from './types';

/**
 * Main class for interacting with the Prompteus API
 * 
 * Authentication can be handled in multiple ways:
 * - Set during client creation via constructor options
 * - Set later using setJwtOrApiKey()
 * - Provided per request in callNeuron options
 * - Not required if the neuron has public access enabled
 * @see https://docs.prompteus.com/neurons/settings/access-control
 */
export class Prompteus {
  /** The base URL for the Prompteus API */
  private baseURL: string;
  /** The JWT token or API key for authentication. Can be set during construction, later via setJwtOrApiKey(), or per request */
  private jwtOrApiKey: string | null = null;

  /**
   * Creates a new Prompteus client instance
   * @param options - Configuration options for the client. Note that jwtOrApiKey is optional and can be set later or provided per request
   */
  constructor(options: PrompteusOptions = {}) {
    this.baseURL = options.baseURL || "https://run.prompteus.com";
    if (options.jwtOrApiKey) {
      this.jwtOrApiKey = options.jwtOrApiKey;
    }
  }

  /**
   * Sets the JWT token or API key for authentication. This will be used for all subsequent requests unless overridden in callNeuron options
   * @param jwtOrApiKey - The JWT token or API key to set
   */
  setJwtOrApiKey(jwtOrApiKey: string): void {
    this.jwtOrApiKey = jwtOrApiKey;
  }

  /**
   * Calls a neuron with the specified options
   * @param organizationSlug - The slug of the organization
   * @param neuronSlug - The slug of the neuron to execute
   * @param options - Additional options for the neuron execution. If jwtOrApiKey or Authorization header is provided here, it will override any previously set JWT/API key
   * @returns A promise that resolves to either a string (if rawOutput is true) or a NeuronSuccessResponse
   * @throws {NeuronErrorResponse} If the neuron execution fails or if required parameters are missing
   */
  async callNeuron(
    organizationSlug: string,
    neuronSlug: string,
    options: CallNeuronOptions & { rawOutput: true }
  ): Promise<string>;
  async callNeuron(
    organizationSlug: string,
    neuronSlug: string,
    options?: CallNeuronOptions
  ): Promise<NeuronSuccessResponse>;
  async callNeuron(
    organizationSlug: string,
    neuronSlug: string,
    options: CallNeuronOptions & { rawOutput: true } | CallNeuronOptions = {}
  ): Promise<string | NeuronSuccessResponse> {
    const {
      bypassCache = false,
      input = "",
      rawOutput = false,
      headers = {},
      jwtOrApiKey = null,
    } = options;

    if (!organizationSlug) {
      throw { error: "Organization slug is required, not calling neuron.", statusCode: 400 } as NeuronErrorResponse;
    }

    if (!neuronSlug) {
      throw { error: "Neuron slug is required, not calling neuron.", statusCode: 400 } as NeuronErrorResponse;
    }

    const queryParams = new URLSearchParams();
    if (bypassCache) queryParams.append('bypassCache', 'true');
    if (rawOutput) queryParams.append('rawOutput', 'true');

    const url = `${this.baseURL}/${organizationSlug}/${neuronSlug}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    // Use the most specific JWT/API key (options override class-level setting)
    const authToken = jwtOrApiKey || this.jwtOrApiKey;
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify({ input }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw { ...errorData, statusCode: response.status } as NeuronErrorResponse;
    }

    if (rawOutput) {
      return await response.text();
    }

    const data = await response.json();
    return data as NeuronSuccessResponse;
  }
}
