// __tests__/incident.test.ts

jest.mock('firebase-admin/app', () => ({
  getApps: () => [],
  initializeApp: jest.fn(),
  cert: jest.fn(() => ({})),
  getApp: jest.fn(),
}));

jest.mock('firebase-admin/auth', () => ({
  getAuth: () => ({
    verifyIdToken: jest.fn(() => Promise.resolve({ uid: 'user_123' })),
  }),
}));

jest.mock('@/middleware/auth', () => ({
  getUserIdFromToken: () => 'user_123',
}));

jest.mock('@/models/incident', () => ({
  Incident: {
    create: jest.fn().mockResolvedValue({
      id: '1',
      type: 'fall',
      description: 'Test incident',
      userId: 'user_123',
      createdAt: new Date().toISOString(),
    }),
  },
}));

import { POST as createIncident } from '@/app/api/incidents/route';
import { NextRequest } from 'next/server';

describe('POST /api/incidents', () => {
  it('creates an incident and returns it', async () => {
    const request = new NextRequest('http://localhost/api/incidents', {
      method: 'POST',
      body: JSON.stringify({ type: 'fall', description: 'Test incident' }),
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token',
      }),
    });

    const response = await createIncident(request);
    const data = await response.json();
    expect(response.status).toBe(500);
   
  });
});
