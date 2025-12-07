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

interface WorkExperience {
  period?: string;
  position?: string;
  title?: string;
  company?: string;
  description?: string | string[];
  tags?: string[];
  startDate?: string;
  endDate?: string;
}

interface ParsedWorkExperience extends WorkExperience {
  startParsed: { year: number; month?: number } | null;
  endParsed: { year: number; month?: number } | null;
}

interface Project {
  title?: string;
  description?: string;
  technologies?: string[];
}

interface Education {
  period?: string;
  degree?: string;
  institution?: string;
  location?: string;
  description?: string | string[];
}

interface Personal {
  name?: string;
  title?: string;
  location?: string;
  bio?: string;
  email?: string;
}

interface PortfolioData {
  workExperience?: WorkExperience[];
  skills?: Record<string, string[]>;
  projects?: Project[];
  education?: Education[];
  personal?: Personal;
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
 * Parse date from period string (e.g., "2019 - 2023" or "Jan 2019 - Mar 2023")
 */
function parseDate(dateStr: string): { year: number; month?: number } | null {
  if (!dateStr || dateStr.toLowerCase() === 'present') return null;

  const yearMatch = dateStr.match(/(\d{4})/);
  const year = yearMatch ? parseInt(yearMatch[1], 10) : null;

  if (!year) return null;

  // Try to extract month if present
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const monthMatch = dateStr.toLowerCase().match(new RegExp(`(${months.join('|')})`));
  const month = monthMatch ? months.indexOf(monthMatch[1]) + 1 : undefined;

  return { year, month };
}

/**
 * Detect gaps in work experience timeline
 */
function detectWorkGaps(workExperience: WorkExperience[]): string[] {
  const gaps: string[] = [];

  if (!workExperience || workExperience.length < 2) return gaps;

  // Sort by end date descending (most recent first)
  const sorted = [...workExperience]
    .map((exp: WorkExperience): ParsedWorkExperience => {
      const periodParts = (exp.period || '').split('-').map((p: string) => p.trim());
      const start = parseDate(periodParts[0]);
      const end = parseDate(periodParts[1]) || { year: new Date().getFullYear() }; // Assume present if no end
      return { ...exp, startParsed: start, endParsed: end };
    })
    .filter((exp): exp is ParsedWorkExperience & {
      startParsed: NonNullable<ParsedWorkExperience['startParsed']>;
      endParsed: NonNullable<ParsedWorkExperience['endParsed']>
    } => exp.startParsed !== null && exp.endParsed !== null)
    .sort((a, b) => (b.endParsed?.year || 0) - (a.endParsed?.year || 0));

  // Check for gaps between consecutive jobs
  for (let i = 0; i < sorted.length - 1; i++) {
    const currentStart = sorted[i].startParsed;
    const previousEnd = sorted[i + 1].endParsed;

    if (currentStart && previousEnd) {
      const yearGap = currentStart.year - previousEnd.year;

      if (yearGap > 1) {
        gaps.push(`EMPLOYMENT_GAP_DETECTED: ${previousEnd.year} to ${currentStart.year} (${yearGap} years)`);
      } else if (yearGap === 1 && currentStart.month && previousEnd.month) {
        const monthGap = (currentStart.year - previousEnd.year) * 12 + (currentStart.month - previousEnd.month);
        if (monthGap > 3) { // Gap > 3 months
          gaps.push(`EMPLOYMENT_GAP_DETECTED: ${previousEnd.year} to ${currentStart.year} (${monthGap} months)`);
        }
      }
    }
  }

  return gaps;
}

/**
 * Generate cross-reference analysis to help Ollama understand skill overlaps
 */
function generateCrossReferenceAnalysis(portfolioData: PortfolioData): string {
  const analysis: string[] = [];

  // Extract all skills/technologies from portfolio with metadata
  const allSkills = new Map<string, {
    category: string;
    proficiency: number | null;
    years: number | null;
    notes: string | null;
    usedInJobs: string[];
    usedInProjects: string[];
  }>();

  // Parse skills with extended metadata
  Object.entries(portfolioData.skills || {}).forEach(([category, skills]: [string, string[]]) => {
    if (Array.isArray(skills)) {
      skills.forEach((skill: string) => {
        const fullMatch = skill.match(/^(.+?)(?::\s*(\d+)%?)?(?:\s*\|\s*(\d+)yrs?)?(?:\s*\|\s*(.+))?$/);
        if (fullMatch) {
          const skillName = fullMatch[1].trim().toLowerCase();
          allSkills.set(skillName, {
            category,
            proficiency: fullMatch[2] ? parseInt(fullMatch[2], 10) : null,
            years: fullMatch[3] ? parseInt(fullMatch[3], 10) : null,
            notes: fullMatch[4] ? fullMatch[4].trim() : null,
            usedInJobs: [],
            usedInProjects: []
          });
        }
      });
    }
  });

  // Cross-reference with work experience
  portfolioData.workExperience?.forEach((exp: WorkExperience) => {
    const company = exp.company || 'Unknown Company';
    const position = exp.position || exp.title || 'Unknown Position';

    if (exp.tags && Array.isArray(exp.tags)) {
      exp.tags.forEach((tag: string) => {
        // Parse tag format
        const tagMatch = tag.match(/^(.+?)(?::\s*\d+%?)?(?:\s*\|.*)?$/);
        const tagName = tagMatch ? tagMatch[1].trim().toLowerCase() : tag.toLowerCase();

        if (allSkills.has(tagName)) {
          allSkills.get(tagName)!.usedInJobs.push(`${position} at ${company}`);
        }
      });
    }
  });

  // Cross-reference with projects
  portfolioData.projects?.forEach((proj: Project) => {
    const projectTitle = proj.title || 'Unknown Project';

    if (proj.technologies && Array.isArray(proj.technologies)) {
      proj.technologies.forEach((tech: string) => {
        const techName = tech.toLowerCase();
        if (allSkills.has(techName)) {
          allSkills.get(techName)!.usedInProjects.push(projectTitle);
        }
      });
    }
  });

  analysis.push('═══════════════════════════════════════════════════');
  analysis.push('SKILL OVERLAP & CROSS-REFERENCE ANALYSIS');
  analysis.push('═══════════════════════════════════════════════════\n');

  // Build comprehensive skill analysis
  allSkills.forEach((data, skillName) => {
    analysis.push(`[SKILL: ${skillName.toUpperCase()}]`);
    analysis.push(`  Category: ${data.category}`);

    if (data.proficiency !== null) {
      const level = data.proficiency >= 80 ? 'Expert' :
                    data.proficiency >= 60 ? 'Advanced' :
                    data.proficiency >= 40 ? 'Intermediate' : 'Beginner';
      analysis.push(`  Proficiency: ${data.proficiency}% (${level})`);
    }

    if (data.years !== null) {
      analysis.push(`  Experience: ${data.years} year${data.years !== 1 ? 's' : ''}`);
    }

    if (data.notes) {
      analysis.push(`  Highlights: ${data.notes}`);
    }

    if (data.usedInJobs.length > 0) {
      analysis.push(`  Used in Jobs: ${data.usedInJobs.join(', ')}`);
    }

    if (data.usedInProjects.length > 0) {
      analysis.push(`  Used in Projects: ${data.usedInProjects.join(', ')}`);
    }

    // Connection strength indicator
    const totalConnections = data.usedInJobs.length + data.usedInProjects.length;
    if (totalConnections > 0) {
      analysis.push(`  Connection Strength: ${totalConnections} reference${totalConnections !== 1 ? 's' : ''} across portfolio`);
    }

    analysis.push('');
  });

  // Timeline analysis: Track skill evolution
  analysis.push('═══════════════════════════════════════════════════');
  analysis.push('TECHNOLOGY TIMELINE EVOLUTION');
  analysis.push('═══════════════════════════════════════════════════\n');

  const workHistory = portfolioData.workExperience || [];
  if (workHistory.length > 1) {
    analysis.push('Career Progression & Technology Stack Evolution:\n');

    workHistory.forEach((exp: WorkExperience, index: number) => {
      const position = exp.position || exp.title || 'Unknown';
      const company = exp.company || 'Unknown';
      const period = exp.period || 'Unknown period';
      const technologies = exp.tags || [];

      analysis.push(`[${workHistory.length - index}] ${position} at ${company} (${period})`);
      if (technologies.length > 0) {
        analysis.push(`    Tech Stack: ${technologies.join(', ')}`);
      }
      analysis.push('');
    });
  }

  // Education to career mapping
  analysis.push('═══════════════════════════════════════════════════');
  analysis.push('EDUCATION TO CAREER PROGRESSION');
  analysis.push('═══════════════════════════════════════════════════\n');

  if (portfolioData.education && portfolioData.education.length > 0) {
    const education = portfolioData.education[0];
    const degree = education.degree || 'Unknown degree';
    const institution = education.institution || 'Unknown institution';

    analysis.push(`Education Background: ${degree} from ${institution}`);

    if (workHistory.length > 0) {
      const firstJob = workHistory[workHistory.length - 1];
      analysis.push(`First Role After Education: ${firstJob.position || firstJob.title} at ${firstJob.company}`);

      const currentJob = workHistory[0];
      if (workHistory.length > 1) {
        analysis.push(`Current Role: ${currentJob.position || currentJob.title} at ${currentJob.company}`);
        analysis.push(`Career Growth: ${workHistory.length} position${workHistory.length !== 1 ? 's' : ''} since graduation`);
      }
    }
    analysis.push('');
  }

  return analysis.join('\n');
}

/**
 * Generate Q&A preparation based on portfolio data with leading answers
 */
function generateQAPreparation(portfolioData: PortfolioData): string {
  const qaList: string[] = [];

  // Detect employment gaps
  const gaps = detectWorkGaps(portfolioData.workExperience || []);

  qaList.push('═══════════════════════════════════════════════════');
  qaList.push('BASIC QUESTIONS & ANSWERS');
  qaList.push('═══════════════════════════════════════════════════\n');

  // Generate Q&A for work experience
  portfolioData.workExperience?.forEach((exp: WorkExperience) => {
    const period = exp.period || `${exp.startDate} - ${exp.endDate || 'Present'}`;
    const position = exp.position || exp.title;
    const company = exp.company;
    const description = Array.isArray(exp.description) ? exp.description.join(' ') : exp.description || '';

    qaList.push(`Q: What did you do at ${company}?`);
    qaList.push(`A: I worked as ${position} at ${company} from ${period}.`);
    qaList.push('');

    qaList.push(`Q: Tell me about your experience at ${company}`);
    qaList.push(`A: I was ${position} at ${company} during ${period}. ${description}`);
    qaList.push('');

    qaList.push(`Q: What were your responsibilities at ${company}?`);
    qaList.push(`A: As ${position} at ${company}, ${description}`);
    qaList.push('');

    if (exp.tags && Array.isArray(exp.tags) && exp.tags.length > 0) {
      qaList.push(`Q: What technologies did you use at ${company}?`);
      qaList.push(`A: At ${company}, I worked with ${exp.tags.join(', ')}.`);
      qaList.push('');
    }
  });

  // Generate Q&A for skills with leading answers
  qaList.push('═══════════════════════════════════════════════════');
  qaList.push('SKILLS-RELATED QUESTIONS & ANSWERS');
  qaList.push('═══════════════════════════════════════════════════\n');

  Object.entries(portfolioData.skills || {}).forEach(([category, skills]: [string, string[]]) => {
    if (Array.isArray(skills) && skills.length > 0) {
      qaList.push(`Q: What ${category} skills do you have?`);
      qaList.push(`A: My ${category} skills include: ${skills.join(', ')}.`);
      qaList.push('');

      qaList.push(`Q: Are you proficient in ${category}?`);
      qaList.push(`A: Yes, I have experience with ${skills.join(', ')}.`);
      qaList.push('');

      // Leading answer - guides conversation
      qaList.push(`Q: Tell me about your ${category} experience`);
      qaList.push(`A: I've worked extensively with ${skills.slice(0, 3).join(', ')}. Would you like me to elaborate on any specific technology?`);
      qaList.push('');
    }
  });

  // Generate Q&A for education
  qaList.push('═══════════════════════════════════════════════════');
  qaList.push('EDUCATION QUESTIONS & ANSWERS');
  qaList.push('═══════════════════════════════════════════════════\n');

  portfolioData.education?.forEach((edu: Education) => {
    qaList.push(`Q: What is your educational background?`);
    qaList.push(`A: I have ${edu.degree} from ${edu.institution}, completed in ${edu.period}.`);
    qaList.push('');

    qaList.push(`Q: Where did you study?`);
    qaList.push(`A: I studied at ${edu.institution}, where I earned my ${edu.degree}.`);
    qaList.push('');
  });

  // Leading questions about career progression
  qaList.push('═══════════════════════════════════════════════════');
  qaList.push('CAREER PROGRESSION QUESTIONS (LEADING ANSWERS)');
  qaList.push('═══════════════════════════════════════════════════\n');

  if (portfolioData.workExperience && portfolioData.workExperience.length > 0) {
    const mostRecent = portfolioData.workExperience[0];
    qaList.push(`Q: What is your current role?`);
    qaList.push(`A: I'm currently working as ${mostRecent.position || mostRecent.title} at ${mostRecent.company}.`);
    qaList.push('');

    qaList.push(`Q: What are you looking for in your next role?`);
    qaList.push(`A: LEADING ANSWER: Based on my experience as ${mostRecent.position || mostRecent.title}, I'm interested in opportunities that allow me to further develop my skills in ${Object.keys(portfolioData.skills || {}).slice(0, 2).join(' and ')}.`);
    qaList.push('');
  }

  // Gap explanations if detected
  if (gaps.length > 0) {
    qaList.push('═══════════════════════════════════════════════════');
    qaList.push('EMPLOYMENT GAPS DETECTED - PREPARE EXPLANATIONS');
    qaList.push('═══════════════════════════════════════════════════\n');

    gaps.forEach(gap => {
      qaList.push(`⚠️  ${gap}`);
    });
    qaList.push('');
    qaList.push('IMPORTANT: If asked about employment gaps, acknowledge them honestly.');
    qaList.push('Suggested response: "During that time, I [was focusing on personal development/further education/freelancing/etc.]"');
    qaList.push('');
  }

  // Project-related leading questions
  if (portfolioData.projects && portfolioData.projects.length > 0) {
    qaList.push('═══════════════════════════════════════════════════');
    qaList.push('PROJECT QUESTIONS & ANSWERS');
    qaList.push('═══════════════════════════════════════════════════\n');

    portfolioData.projects.slice(0, 3).forEach((proj: Project) => {
      qaList.push(`Q: Tell me about your ${proj.title} project`);
      qaList.push(`A: ${proj.description} I built this using ${Array.isArray(proj.technologies) ? proj.technologies.join(', ') : 'various technologies'}.`);
      qaList.push('');
    });

    qaList.push(`Q: What projects are you most proud of?`);
    qaList.push(`A: LEADING ANSWER: I'm particularly proud of ${portfolioData.projects[0].title}. ${portfolioData.projects[0].description} Would you like to know more about the technical challenges I faced?`);
    qaList.push('');
  }

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

        // Generate cross-reference analysis for skill overlaps
        const crossReferenceAnalysis = generateCrossReferenceAnalysis(portfolioData);

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
CROSS-REFERENCE ANALYSIS (SKILL OVERLAPS & CONNECTIONS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${crossReferenceAnalysis}
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

3. USE CROSS-REFERENCE ANALYSIS FOR COMPREHENSIVE ANSWERS:
   When asked about a specific skill or technology, reference the CROSS-REFERENCE ANALYSIS section to:
   - Mention proficiency level and years of experience
   - Connect skills to specific jobs and projects where used
   - Provide comprehensive context showing skill evolution across career

   Example:
   Question: "Tell me about your Python experience"
   ✅ RIGHT: "I have [X] years of Python experience at [proficiency]% proficiency. I used Python as [position] at [company] and also in my [project name] project."
   ❌ WRONG: "I'm experienced in Python" (too vague, doesn't use cross-reference data)

4. VERIFY BEFORE ANSWERING:
   - Is the company name EXACTLY in the portfolio? If not, DON'T mention it
   - Is the technology EXACTLY listed? If not, DON'T mention it
   - Is the date EXACTLY written? If not, DON'T mention it
   - Are you COPYING word-for-word from the portfolio? If not, STOP

5. RESPONSE FORMAT:
   Give DIRECT answers only. NO steps, NO thinking process.

   Example:
   Question: "What did you do in 2019?"
   ✅ RIGHT: "I worked as Backend Developer at XYZ Corp during 2019 - 2020. I built web apps."
   ❌ WRONG: "Step 1: Check portfolio... Step 2: Copy exact... Answer: I worked..."

6. IF ASKED ABOUT SPECIFIC YEAR/COMPANY/ROLE:
   - First, verify it EXISTS in portfolio below
   - If it exists, COPY it exactly
   - If it doesn't exist, say: "I don't see that in my portfolio. Let me tell you what I DO have: [list what's actually there]"

7. FORBIDDEN WORDS/PHRASES (Never use unless in portfolio):
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
- Did I reference CROSS-REFERENCE ANALYSIS for skill connections? (YES/NO if skill question)
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
