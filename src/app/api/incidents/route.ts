import { NextRequest, NextResponse } from 'next/server';
import Incident from '@/models/incident'; // Your Sequelize model
import { verifyFirebaseToken } from '@/lib/verifyToken';

// POST /api/incidents → Create new incident
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.split('Bearer ')[1];
    const user = await verifyFirebaseToken(token); // Decode and verify the token

    const data = await request.json();

    const incident = await Incident.create({
      ...data,
      userId: user.uid,
    });

    return NextResponse.json(incident, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// GET /api/incidents → Return incidents for authenticated user
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.split('Bearer ')[1];
    const user = await verifyFirebaseToken(token); // Decode and verify the token
    const incidents = await Incident.findAll({
      where: { userId: user.uid },
      order: [['createdAt', 'DESC']],
    });


    return NextResponse.json(incidents);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
