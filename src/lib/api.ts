import { systemPrompt } from './data';

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
const OLLAMA_TAGS_URL = 'http://localhost:11434/api/tags';

// Recommended models (in order of preference):
// - llama3.2:3b (best balance of speed and accuracy)
// - mistral:7b (very accurate, slower)
// - phi3:3.8b (good balance)
// - qwen2.5:0.5b (fast but unreliable - NOT recommended for accuracy)
const PREFERRED_MODELS = ['llama3.2:3b', 'llama3.2', 'mistral:7b', 'mistral', 'phi3:3.8b', 'phi3', 'qwen2.5:0.5b'];

export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

/**
 * Auto-detect the best available Ollama model
 */
async function getAvailableModel(): Promise<string> {
  try {
    const response = await fetch(OLLAMA_TAGS_URL);
    if (!response.ok) {
      throw new Error('Could not fetch available models');
    }

    const data = await response.json();
    const availableModels: string[] = data.models?.map((m: any) => m.name) || [];

    // Find first preferred model that's available
    for (const preferred of PREFERRED_MODELS) {
      const found = availableModels.find(m => m.includes(preferred.split(':')[0]));
      if (found) {
        console.log(`Selected Ollama model: ${found}`);
        return found;
      }
    }

    // Fallback to first available model
    if (availableModels.length > 0) {
      console.warn(`No preferred model found. Using: ${availableModels[0]}`);
      return availableModels[0];
    }

    // No models available
    throw new Error('No Ollama models installed. Please run: ollama pull llama3.2:3b');
  } catch (error) {
    console.error('Error detecting Ollama model:', error);
    // Fallback to qwen2.5:0.5b and hope it's installed
    return 'qwen2.5:0.5b';
  }
}

export async function sendMessageToOllama(userMessage: string, portfolioData?: any): Promise<string> {
  try {
    // Auto-detect best available Ollama model
    const MODEL_NAME = await getAvailableModel();

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
  • ${exp.position || exp.title} at ${exp.company} (${exp.period || `${exp.startDate} - ${exp.endDate || 'Present'}`})
    ${Array.isArray(exp.description) ? exp.description.join('; ') : (exp.description || '')}
`).join('\n') || '- No work experience listed'}

Education:
${portfolioData.education?.map((edu: any) => `
  • ${edu.degree} - ${edu.institution || edu.school} (${edu.period || edu.year})
    ${Array.isArray(edu.description) ? edu.description.join('; ') : (edu.description || '')}
`).join('\n') || '- No education listed'}

Projects:
${portfolioData.projects?.map((proj: any) => `
  • ${proj.title}
    ${proj.description || ''}
    Technologies: ${Array.isArray(proj.technologies) ? proj.technologies.join(', ') : 'Not specified'}
    ${proj.liveUrl || proj.link ? `Link: ${proj.liveUrl || proj.link}` : ''}
    ${proj.githubUrl ? `GitHub: ${proj.githubUrl}` : ''}
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

        contextPrompt = `You are ${portfolioData.personal?.name || 'the portfolio owner'} answering questions about your professional background in a virtual interview.

⚠️ CRITICAL - FOLLOW THESE RULES EXACTLY OR YOUR RESPONSE IS WRONG:

1. ANSWER IN FIRST PERSON: Say "I", "my", "me" (not "they/their")

2. COPY-PASTE ONLY FROM PORTFOLIO DATA BELOW:
   ❌ WRONG: "In 2019, I joined Intuivo as a Backend Developer building an e-commerce platform using React, Next.js, Django, Python, and Docker."
   ✅ RIGHT: "In 2019, I worked at [EXACT COMPANY NAME] as [EXACT JOB TITLE]. [COPY EXACT DESCRIPTION FROM PORTFOLIO - NOTHING MORE]"

   If the portfolio says: "Backend Developer at XYZ Corp (2019 - 2020): Built web apps"
   You must say: "I worked as a Backend Developer at XYZ Corp during 2019 - 2020. I built web apps."

   DO NOT ADD: technologies, frameworks, details, or anything not explicitly written

3. VERIFY BEFORE ANSWERING:
   - Is the company name EXACTLY in the portfolio? If not, DON'T mention it
   - Is the technology EXACTLY listed? If not, DON'T mention it
   - Is the date EXACTLY written? If not, DON'T mention it
   - Are you COPYING word-for-word from the portfolio? If not, STOP

4. RESPONSE FORMAT:
   Give DIRECT answers only. NO steps, NO thinking process.

   Example:
   Question: "What did you do in 2019?"
   ✅ RIGHT: "I worked as Backend Developer at XYZ Corp during 2019 - 2020. I built web apps."
   ❌ WRONG: "Step 1: Check portfolio... Step 2: Copy exact... Answer: I worked..."

5. IF ASKED ABOUT SPECIFIC YEAR/COMPANY/ROLE:
   - First, verify it EXISTS in portfolio below
   - If it exists, COPY it exactly
   - If it doesn't exist, say: "I don't see that in my portfolio. Let me tell you what I DO have: [list what's actually there]"

6. FORBIDDEN WORDS/PHRASES (Never use unless in portfolio):
   ❌ "building an e-commerce platform"
   ❌ "using React, Next.js, Django, Python, Docker"
   ❌ "allowed users to"
   ❌ Any technology not explicitly listed
   ❌ Any company name not explicitly listed
   ❌ Any detail not explicitly written

${portfolioContext}

⚠️ FINAL CHECK BEFORE ANSWERING:
- Did I copy company name EXACTLY? (YES/NO)
- Did I copy job title EXACTLY? (YES/NO)
- Did I copy dates EXACTLY? (YES/NO)
- Did I copy description EXACTLY? (YES/NO)
- Did I add ANY extra details? (MUST BE NO)

If ANY answer is NO, your response is WRONG. Fix it.

NOW ANSWER AS ${portfolioData.personal?.name || 'yourself'} using ONLY exact information above:`;
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
        system: "You are a fact-checking assistant. You must only state information that is explicitly written in the provided context. Never add details, never elaborate, never infer. Copy exact wording from the context only.",
        options: {
          temperature: 0.0, // Zero creativity - only facts
          top_p: 0.3,       // Very restrictive to prevent elaboration
          top_k: 5,         // Extremely limited token choices
          repeat_penalty: 1.1, // Slight penalty
          num_predict: 200, // Limit response length to prevent elaboration
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
