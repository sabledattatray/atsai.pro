import { NextRequest, NextResponse } from 'next/server';
import { getAi } from '@/lib/gemini';

const GENERATE_PROMPT = `Generate a realistic, highly professional resume in perfectly structured JSON format based on the following user prompt.
Produce rich, detailed, realistic bullet points focused on impact, metrics, and action verbs. Make sure the total length is substantial so it fills up a full page. Do NOT wrap the JSON in Markdown code blocks.

User Prompt: "{PROMPT}"

Required JSON format:
{
  "name": "String (Realistic name or use a default like 'Alex Johnson')",
  "title": "String (e.g. Senior Software Engineer)",
  "email": "String",
  "phone": "String",
  "summary": "String (A compelling, multi-sentence professional summary)",
  "experience": [
    {
      "company": "String",
      "role": "String",
      "duration": "String (e.g. Jan 2021 - Present)",
      "description": "String (Multiple bullet points separated by \\n character. Use • as the bullet character for each line. Highly detailed.)"
    }
  ],
  "education": [
    {
      "institution": "String",
      "degree": "String",
      "year": "String"
    }
  ],
  "skills": "String (Comma separated list of skills)"
}`;

import { verifyToken, getUserByUid, decrementCredits, upsertUser, isAdmin } from '@/lib/users';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 20 generate-resume calls per minute per IP
    const { limited } = rateLimit(req, { limit: 20, windowMs: 60_000, identifier: 'generate-resume' });
    if (limited) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment before trying again.' }, { status: 429 });
    }

    let aiClient;
    try {
      aiClient = getAi();
    } catch {
      return NextResponse.json({ error: 'Gemini API key is not configured.' }, { status: 500 });
    }

    const body = await req.json();
    const { prompt } = body;
    if (!prompt) return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });

    const authHeader = req.headers.get('authorization');
    const sessionUser = await verifyToken(authHeader, body);

    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized: Invalid or missing session token.' }, { status: 401 });
    }

    // Load or register the user profile in PostgreSQL
    let user = await getUserByUid(sessionUser.uid);
    if (!user) {
      user = await upsertUser({
        uid: sessionUser.uid,
        email: sessionUser.email,
        displayName: sessionUser.email.split('@')[0] || 'User',
        providerId: 'password',
        emailVerified: false,
        credits: 3 // Default signup credits
      });
    }

    // Check credit limits (admins have unlimited credits)
    const isAdminUser = isAdmin(sessionUser.email);
    
    if (user.credits <= 0 && !isAdminUser) {
      return NextResponse.json({ error: 'Insufficient credits. Please upgrade your plan to generate resumes.' }, { status: 402 });
    }

    const promptText = GENERATE_PROMPT.replace('{PROMPT}', prompt);

    let responseText = "{}";
    let retries = 3;
    while (retries > 0) {
      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [promptText],
          config: { responseMimeType: 'application/json' }
        });
        responseText = response.text || "{}";
        break;
      } catch (genErr: any) {
        retries--;
        if (retries === 0 || (genErr.status !== 503 && genErr.status !== 429)) throw genErr;
        console.log(`Gemini API busy (${genErr.status}). Retrying...`);
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    const cleanJsonStr = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const result = JSON.parse(cleanJsonStr);

    // Decrement credits if not admin bypass
    let updatedUser = user;
    if (!isAdminUser) {
      const decResult = await decrementCredits(sessionUser.uid);
      if (decResult) updatedUser = decResult;
    }

    return NextResponse.json({
      ...result,
      remainingCredits: updatedUser.credits
    });
  } catch (error: any) {
    console.error('Error generating resume:', error);
    return NextResponse.json({ error: 'Failed to generate resume from AI.' }, { status: 500 });
  }
}
