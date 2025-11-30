import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate';
const MODEL_NAME = 'qwen2.5:0.5b';

const INTERVIEW_PROMPTS = {
  work: `You are an AI interviewer helping someone build their professional portfolio. Ask ONE clear question at a time about their work experience. Start with: "What was your most recent job title?"

After they answer, ask relevant follow-up questions like:
- What company did you work for?
- What were your main responsibilities?
- What technologies or tools did you use?
- What were your key achievements?

When you have enough information to create a work experience entry, respond with ONLY a JSON object in this format:
{
  "completed": true,
  "data": {
    "position": "Job Title",
    "company": "Company Name",
    "period": "Month Year - Month Year",
    "location": "City, Country",
    "description": ["Responsibility 1", "Responsibility 2"],
    "tags": ["Technology1", "Technology2"]
  }
}`,

  education: `You are an AI interviewer helping someone build their professional portfolio. Ask ONE clear question at a time about their education. Start with: "What degree did you earn?"

After they answer, ask relevant follow-up questions like:
- Which university or institution?
- When did you graduate (or when will you graduate)?
- Where was the institution located?
- Any honors, achievements, or special activities?

When you have enough information, respond with ONLY a JSON object in this format:
{
  "completed": true,
  "data": {
    "degree": "Degree Name",
    "institution": "University Name",
    "period": "Year - Year",
    "location": "City, Country",
    "description": ["Achievement 1", "Achievement 2"]
  }
}`,

  projects: `You are an AI interviewer helping someone build their professional portfolio. Ask ONE clear question at a time about their projects. Start with: "What's the name of your project?"

After they answer, ask relevant follow-up questions like:
- What does this project do?
- What technologies did you use to build it?
- Is it deployed? Do you have a live URL?
- Do you have the code on GitHub?

When you have enough information, respond with ONLY a JSON object in this format:
{
  "completed": true,
  "data": {
    "title": "Project Name",
    "description": "Brief description of what it does",
    "technologies": ["Tech1", "Tech2", "Tech3"],
    "liveUrl": "https://example.com",
    "githubUrl": "https://github.com/user/repo",
    "image": "/projects/image.jpg"
  }
}`
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { section, messages } = await request.json();

    if (!section || !INTERVIEW_PROMPTS[section as keyof typeof INTERVIEW_PROMPTS]) {
      return NextResponse.json(
        { error: 'Invalid section' },
        { status: 400 }
      );
    }

    const systemPrompt = INTERVIEW_PROMPTS[section as keyof typeof INTERVIEW_PROMPTS];

    const conversationHistory = messages.map((msg: any) =>
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n');

    const fullPrompt = `${systemPrompt}\n\nConversation so far:\n${conversationHistory}\n\nAssistant:`;

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
