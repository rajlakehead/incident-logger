import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebaseAdmin';
import Incident from '@/models/incident';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function POST(req: NextRequest)  {
  try {
    // Extract and verify Firebase token
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Get the incident
    const id = req.nextUrl.pathname.split('/').at(-2);
    const incident = await Incident.findByPk(id);

    if (!incident || incident.userId !== uid) {
      return NextResponse.json({ error: 'Incident not found or access denied' }, { status: 404 });
    }

    // Generate summary with Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Summarize the following incident in 1-2 sentences:\n"${incident.description}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text().trim();

    if (!summary) {
      return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
    }

    // Save and return summary
    incident.summary = summary;
    await incident.save();

    return NextResponse.json(incident, { status: 200 });
  } catch (error) {
    console.error('Summarize Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
