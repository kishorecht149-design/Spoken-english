import { NextRequest, NextResponse } from "next/server";
import { evaluateSpeaking } from "@/lib/services/openai";
import { applyRateLimit, requireApiUser } from "@/lib/services/api";

export async function POST(request: NextRequest) {
  const rateLimited = applyRateLimit(request, 12);
  if (rateLimited) return rateLimited;

  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;

  const body = (await request.json()) as { transcript: string; targetPrompt: string };

  if (body.transcript.trim().split(/\s+/).length < 10) {
    return NextResponse.json(
      { error: "Speech sample is too short for reliable scoring." },
      { status: 400 }
    );
  }

  const result = await evaluateSpeaking(body);
  return NextResponse.json(result);
}
