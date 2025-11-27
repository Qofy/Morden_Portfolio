import { systemPrompt } from './data';

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
const MODEL_NAME = 'qwen2.5:0.5b'; // Lightweight model for fast responses

export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

export async function sendMessageToOllama(userMessage: string): Promise<string> {
  try {
    const prompt = `${systemPrompt}\n\n${userMessage}`;

    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data: OllamaResponse = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error communicating with Ollama:', error);

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Cannot connect to Ollama. Make sure Ollama is running on localhost:11434');
    }

    throw error;
  }
}

export async function testOllamaConnection(): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:11434/api/tags');
    return response.ok;
  } catch {
    return false;
  }
}
