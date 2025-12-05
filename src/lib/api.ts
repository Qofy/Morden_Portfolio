import { systemPrompt } from './data';

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
const OLLAMA_TAGS_URL = 'http://localhost:11434/api/tags';

// For faster reposonse and actions
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

/**
 * Generate Q&A preparation based on portfolio data
 */
function generateQAPreparation(portfolioData: any): string {
  const qaList: string[] = [];

  // Generate Q&A for work experience
  portfolioData.workExperience?.forEach((exp: any) => {
    const period = exp.period || `${exp.startDate} - ${exp.endDate || 'Present'}`;
    const position = exp.position || exp.title;
    const company = exp.company;

    qaList.push(`Q: What did you do at ${company}?`);
    qaList.push(`A: I worked as ${position} at ${company} from ${period}.`);

    qaList.push(`Q: Tell me about your experience at ${company}`);
    qaList.push(`A: I was ${position} at ${company} during ${period}. ${Array.isArray(exp.description) ? exp.description.join(' ') : exp.description || ''}`);
  });

  // Generate Q&A for skills
  Object.entries(portfolioData.skills || {}).forEach(([category, skills]: [string, any]) => {
    if (Array.isArray(skills) && skills.length > 0) {
      qaList.push(`Q: What ${category} skills do you have?`);
      qaList.push(`A: My ${category} skills include: ${skills.join(', ')}.`);
    }
  });

  // Generate Q&A for education
  portfolioData.education?.forEach((edu: any) => {
    qaList.push(`Q: What is your educational background?`);
    qaList.push(`A: I have ${edu.degree} from ${edu.institution || edu.school}, completed in ${edu.period || edu.year}.`);
  });

  return qaList.join('\n');
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
        // Parse work experience with better labels
        const workExpFormatted = portfolioData.workExperience?.map((exp: any, index: number) => {
          const periodParts = (exp.period || '').split('-').map((p: string) => p.trim());
          const yearStart = periodParts[0] || 'Not specified';
          const yearEnd = periodParts[1] || 'Present';

          return `
[WORK EXPERIENCE #${index + 1}]
  POSITION: ${exp.position || exp.title || 'Not specified'}
  COMPANY: ${exp.company || 'Not specified'}
  LOCATION: ${exp.location || 'Not specified'}
  YEAR_STARTS: ${yearStart}
  YEAR_ENDS: ${yearEnd}
  PERIOD: ${exp.period || 'Not specified'}
  RESPONSIBILITIES: ${Array.isArray(exp.description) ? exp.description.map((d: string, i: number) => `\n    ${i + 1}. ${d}`).join('') : (exp.description || 'Not specified')}
  TECHNOLOGIES: ${Array.isArray(exp.tags) ? exp.tags.join(', ') : 'Not specified'}`;
        }).join('\n') || 'No work experience listed';

        // Parse education with better labels
        const educationFormatted = portfolioData.education?.map((edu: any, index: number) => {
          const periodParts = (edu.period || '').split('-').map((p: string) => p.trim());
          const yearStart = periodParts[0] || 'Not specified';
          const yearEnd = periodParts[1] || 'Present';

          return `
[EDUCATION #${index + 1}]
  DEGREE: ${edu.degree || 'Not specified'}
  INSTITUTION: ${edu.institution || edu.school || 'Not specified'}
  LOCATION: ${edu.location || 'Not specified'}
  YEAR_STARTS: ${yearStart}
  YEAR_ENDS: ${yearEnd}
  PERIOD: ${edu.period || edu.year || 'Not specified'}
  DETAILS: ${Array.isArray(edu.description) ? edu.description.map((d: string, i: number) => `\n    ${i + 1}. ${d}`).join('') : (edu.description || 'Not specified')}`;
        }).join('\n') || 'No education listed';

        // Parse projects with better labels
        const projectsFormatted = portfolioData.projects?.map((proj: any, index: number) => {
          return `
[PROJECT #${index + 1}]
  PROJECT_NAME: ${proj.title || 'Not specified'}
  DESCRIPTION: ${proj.description || 'Not specified'}
  TECHNOLOGIES_USED: ${Array.isArray(proj.technologies) ? proj.technologies.join(', ') : 'Not specified'}
  LIVE_URL: ${proj.liveUrl || proj.link || 'Not available'}
  GITHUB_URL: ${proj.githubUrl || 'Not available'}`;
        }).join('\n') || 'No projects listed';

        // Parse skills with better labels
        const skillsFormatted = Object.entries(portfolioData.skills || {}).map(([category, skills]: [string, any]) => {
          return `[SKILL_CATEGORY: ${category}]\n  SKILLS: ${Array.isArray(skills) ? skills.join(', ') : 'None'}`;
        }).join('\n') || 'No skills listed';

        // Generate Q&A preparation
        const qaPreparation = generateQAPreparation(portfolioData);

        // Interview-Style Guard: Strict portfolio-only assistant
        const portfolioContext = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PORTFOLIO DATABASE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[PERSONAL_INFORMATION]
  FULL_NAME: ${portfolioData.personal?.name || 'Not specified'}
  PROFESSIONAL_TITLE: ${portfolioData.personal?.title || 'Not specified'}
  LOCATION: ${portfolioData.personal?.location || 'Not specified'}
  EMAIL: ${portfolioData.personal?.email || 'Not specified'}
  BIO: ${portfolioData.personal?.bio || 'Not specified'}

[WORK_EXPERIENCE_SECTION]
${workExpFormatted}

[EDUCATION_SECTION]
${educationFormatted}

[PROJECTS_SECTION]
${projectsFormatted}

[SKILLS_SECTION]
${skillsFormatted}

[SOCIAL_LINKS]
${portfolioData.socialLinks?.map((link: any) => `  ${link.name}: ${link.url}`).join('\n') || 'No social links'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUESTION & ANSWER PREPARATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${qaPreparation}
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

    // 🔍 DEBUG: Log the full prompt being sent to Ollama
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🤖 OLLAMA PROMPT DEBUG');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('USER QUESTION:', userMessage);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('FULL PROMPT SENT TO OLLAMA:');
    console.log(prompt);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

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

    // 🔍 DEBUG: Log the response from Ollama
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ OLLAMA RESPONSE:');
    console.log(data.response);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

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
