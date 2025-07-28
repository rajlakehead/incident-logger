// __tests__/summarizeIncident.test.ts

import { POST } from "../src/app/api/incidents/[id]/summarize/route";
import { NextRequest } from "next/server";

import Incident from "@/models/incident";
import { adminAuth } from "@/lib/firebaseAdmin";
import { GoogleGenerativeAI } from "@google/generative-ai";

jest.mock("@/lib/firebaseAdmin", () => ({
  adminAuth: {
    verifyIdToken: jest.fn(),
  },
}));

jest.mock("@/models/incident", () => ({
  findByPk: jest.fn(),
}));

jest.mock("@google/generative-ai", () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
      getGenerativeModel: jest.fn(() => ({
        generateContent: jest.fn(() => ({
          response: Promise.resolve({
            text: () => "This is a mock summary.",
          }),
        })),
      })),
    })),
  };
});

describe("POST /api/incidents/[id]/summarize", () => {
  it("generates summary and returns updated incident", async () => {
    (adminAuth.verifyIdToken as jest.Mock).mockResolvedValue({ uid: "user123" });

    const mockIncident = {
      userId: "user123",
      description: "Incident description",
      save: jest.fn(),
    };
    (Incident.findByPk as jest.Mock).mockResolvedValue(mockIncident);

    const req = new NextRequest("http://localhost/api/incidents/123/summarize", {
      method: "POST",
      headers: {
        authorization: "Bearer valid-token",
      },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.summary).toBe("This is a mock summary.");
    expect(mockIncident.save).toHaveBeenCalled();
  });
});
