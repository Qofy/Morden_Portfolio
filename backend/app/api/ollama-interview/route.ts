import { NextRequest, NextResponse } from 'next/server';

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate';
const MODEL_NAME = 'qwen2.5:0.5b';

const INTERVIEW_PROMPTS = {
  work: `You are an AI interviewer helping someone document their work experience for their portfolio.

IMPORTANT RULES:
1. Ask ONLY ONE question at a time
2. Keep your questions conversational and friendly
3. DO NOT output JSON until you have ALL the required information
4. You need to collect: job title, company name, time period, location, responsibilities, and technologies used
5. After collecting ALL information, THEN output the JSON format

Start the interview by asking: "What was your most recent job title?"

After each answer, ask the next relevant question:
- What company did you work for?
- When did you work there? (start and end dates)
- Where was the company located?
- What were your main responsibilities? (ask for 2-3 key responsibilities)
- What technologies or tools did you use?

ONLY when you have collected ALL this information, respond with a JSON object in this EXACT format:
{
  "completed": true,
  "data": {
    "position": "Software Engineer",
    "company": "Tech Corp",
    "period": "Jan 2020 - Dec 2022",
    "location": "San Francisco, CA",
    "description": ["Built scalable APIs", "Led team of 3 developers"],
    "tags": ["React", "Node.js", "AWS"]
  }
}`,

  education: `You are an AI interviewer helping someone document their education for their portfolio.

IMPORTANT RULES:
1. Ask ONLY ONE question at a time
2. Keep your questions conversational and friendly
3. DO NOT output JSON until you have ALL the required information
4. You need to collect: degree/program, institution name, time period, location, and achievements
5. After collecting ALL information, THEN output the JSON format

Start the interview by asking: "What degree or program did you complete?"

After each answer, ask the next relevant question:
- Which university or institution?
- When did you attend? (start and end years)
- Where is the institution located?
- What were your key achievements or activities? (honors, GPA, clubs, etc.)

ONLY when you have collected ALL this information, respond with a JSON object in this EXACT format:
{
  "completed": true,
  "data": {
    "degree": "Bachelor of Science in Computer Science",
    "institution": "Stanford University",
    "period": "2016 - 2020",
    "location": "Stanford, CA",
    "description": ["Graduated with Honors (3.8 GPA)", "President of Coding Club"]
  }
}`,

  projects: `You are an AI interviewer helping someone document their projects for their portfolio.

IMPORTANT RULES:
1. Ask ONLY ONE question at a time
2. Keep your questions conversational and friendly
3. DO NOT output JSON until you have ALL the required information
4. You need to collect: project name, description, technologies used, and optionally live/github URLs
5. After collecting ALL information, THEN output the JSON format

Start the interview by asking: "What's the name of your project?"

After each answer, ask the next relevant question:
- What does this project do? (brief description)
- What technologies or tools did you use to build it?
- Is it deployed anywhere? What's the live URL? (optional)
- Is the code on GitHub? What's the repository URL? (optional)

ONLY when you have collected ALL this information, respond with a JSON object in this EXACT format:
{
  "completed": true,
  "data": {
    "title": "Task Manager App",
    "description": "A full-stack todo application with user authentication",
    "technologies": ["React", "Node.js", "MongoDB"],
    "liveUrl": "https://taskmanager.com",
    "githubUrl": "https://github.com/user/task-manager",
    "image": ""
  }
}`
};

export async function POST(request: NextRequest) {
  try {
    const { section, messages } = await request.json();

    if (!section || !INTERVIEW_PROMPTS[section as keyof typeof INTERVIEW_PROMPTS]) {
      return NextResponse.json(
        { error: 'Invalid section' },
        { status: 400 }
      );
    }

    const systemPrompt = INTERVIEW_PROMPTS[section as keyof typeof INTERVIEW_PROMPTS];

    // Build conversation history
    let conversationHistory = '';
    if (messages.length > 0) {
      conversationHistory = 'Conversation so far:\n' + messages.map((msg: any) =>
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n') + '\n';
    }

    const fullPrompt = `${systemPrompt}

${conversationHistory}
Assistant:`;

    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        prompt: fullPrompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
        }
      }),
    });

    if (!response.ok) {
      throw new Error('Ollama API request failed');
    }

    const data = await response.json();
    let aiResponse = data.response.trim();

    let parsedData = null;
    let completed = false;

    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonData = JSON.parse(jsonMatch[0]);
        if (jsonData.completed && jsonData.data) {
          completed = true;
          parsedData = jsonData.data;
          aiResponse = "Great! I've collected all the information. You can review and edit it before saving.";
        }
      }
    } catch (e) {
    }

    return NextResponse.json({
      message: aiResponse,
      completed,
      data: parsedData
    });

  } catch (error) {
    console.error('Ollama interview error:', error);
    return NextResponse.json(
      { error: 'Failed to process interview request' },
      { status: 500 }
    );
  }
}
