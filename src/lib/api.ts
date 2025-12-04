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
    // Use custom system prompt if provided, otherwise generate default
    let contextPrompt = systemPrompt;

    if (portfolioData) {
      // Check if custom system prompt is provided (for interviews)
      if (portfolioData.systemPrompt) {
        contextPrompt = portfolioData.systemPrompt;
      } else {
        // Interview-Style Guard: Strict portfolio-only assistant
        const portfolioContext = `
PORTFOLIO INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Personal Information:
- Name: ${portfolioData.personal?.name || 'Not specified'}
- Title: ${portfolioData.personal?.title || 'Not specified'}
- Location: ${portfolioData.personal?.location || 'Not specified'}
- Email: ${portfolioData.personal?.email || 'Not specified'}
- Bio: ${portfolioData.personal?.bio || 'Not specified'}

Work Experience:
${portfolioData.workExperience?.map((exp: any) => `
  • ${exp.title} at ${exp.company} (${exp.startDate} - ${exp.endDate || 'Present'})
    ${exp.description || ''}
`).join('\n') || '- No work experience listed'}

Education:
${portfolioData.education?.map((edu: any) => `
  • ${edu.degree} - ${edu.school} (${edu.year})
    ${edu.description || ''}
`).join('\n') || '- No education listed'}

Projects:
${portfolioData.projects?.map((proj: any) => `
  • ${proj.title}
    ${proj.description || ''}
    Technologies: ${proj.technologies?.join(', ') || 'Not specified'}
    ${proj.link ? `Link: ${proj.link}` : ''}
`).join('\n') || '- No projects listed'}

Skills:
${Object.entries(portfolioData.skills || {}).map(([category, skills]: [string, any]) => `
  ${category}: ${Array.isArray(skills) ? skills.join(', ') : 'None'}
`).join('\n') || '- No skills listed'}

Blog Posts:
${portfolioData.blogPosts?.map((post: any) => `
  • ${post.title}
    ${post.excerpt || ''}
    Tags: ${post.tags?.join(', ') || 'None'}
`).join('\n') || '- No blog posts available'}

Social Links:
${portfolioData.socialLinks?.map((link: any) => `
  • ${link.name}: ${link.url}
`).join('\n') || '- No social links listed'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

        contextPrompt = `You are conducting a virtual portfolio interview. You can only discuss what's documented in this candidate's portfolio.

SCOPE: Answer questions about the portfolio owner's:
- Professional experience
- Technical skills
- Completed projects
- Educational credentials
- Published work
- Contact information

OUT OF SCOPE: Everything else including general questions, coding help, opinions, or information not in the portfolio.

IMPORTANT RULES:
1. ONLY use information from the portfolio data provided below
2. DO NOT answer general knowledge questions
3. DO NOT provide coding tutorials or help
4. DO NOT give personal opinions or advice
5. DO NOT discuss topics outside this portfolio
6. If information is not in the portfolio, say "I don't have that information in this portfolio"
7. Be professional, concise, and helpful

For off-topic questions, respond:
"Let's keep our discussion focused on the portfolio. I'd be happy to discuss their work experience, projects, skills, or education. What would you like to explore?"

${portfolioContext}

Now answer the user's question based ONLY on the portfolio information above.`;
      }
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

const BACKEND_API_URL = 'http://localhost:3500/api';

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
