import { systemPrompt } from './data';

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
const MODEL_NAME = 'qwen2.5:0.5b';

export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

export async function sendMessageToOllama(userMessage: string, portfolioData?: any): Promise<string> {
  try {
    // Generate dynamic system prompt if portfolio data is provided
    let contextPrompt = systemPrompt;

    if (portfolioData) {
      contextPrompt = `You are an AI assistant representing ${portfolioData.personal?.name || 'the portfolio owner'}.
Here is information about them:
- Name: ${portfolioData.personal?.name}
- Title: ${portfolioData.personal?.title}
- Location: ${portfolioData.personal?.location}
- Bio: ${portfolioData.personal?.bio}

Answer questions about their experience, skills, and projects based on this information. Be helpful, professional, and concise.`;
    }

    const prompt = `${contextPrompt}\n\nUser: ${userMessage}\n\nAssistant:`;

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

const BACKEND_API_URL = 'http://localhost:3000/api';

export async function fetchPortfolioByUsername(username: string): Promise<any | null> {
  try {
    const response = await fetch(`${BACKEND_API_URL}/portfolio/${username}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch portfolio: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching portfolio from backend:', error);
    return null;
  }
}
