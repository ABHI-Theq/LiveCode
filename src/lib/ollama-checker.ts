/**
 * Ollama Availability Checker
 * Checks if Ollama is running locally on port 11434
 */

export interface OllamaStatus {
  available: boolean;
  error?: string;
  version?: string;
}

/**
 * Check if Ollama is available and running
 */
export async function checkOllamaAvailability(): Promise<OllamaStatus> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

    const response = await fetch('http://127.0.0.1:11434/api/tags', {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return {
        available: true,
        version: data.version || 'unknown',
      };
    }

    return {
      available: false,
      error: `Ollama responded with status ${response.status}`,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          available: false,
          error: 'Ollama connection timeout - is it running?',
        };
      }
      return {
        available: false,
        error: error.message,
      };
    }
    return {
      available: false,
      error: 'Failed to connect to Ollama',
    };
  }
}

/**
 * Check if a specific model is available in Ollama
 */
export async function checkOllamaModel(modelName: string = 'codellama:latest'): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch('http://127.0.0.1:11434/api/tags', {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const models = data.models || [];
      return models.some((model: any) => model.name === modelName);
    }

    return false;
  } catch (error) {
    return false;
  }
}
