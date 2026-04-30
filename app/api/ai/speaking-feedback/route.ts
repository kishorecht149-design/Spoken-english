import { NextRequest, NextResponse } from "next/server";
import { getTutorSpeakingFeedback, type TutorContext } from "@/lib/services/ai-fallback";
import { applyRateLimit, requireApiUser } from "@/lib/services/api";

export async function POST(request: NextRequest) {
  const rateLimited = applyRateLimit(request, 12);
  if (rateLimited) return rateLimited;

  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;

  const body = (await request.json()) as {
    transcript: string;
    targetPrompt: string;
    context?: TutorContext;
  };

  const transcript = body.transcript.trim() || "I need help speaking this answer.";
  const result = await getTutorSpeakingFeedback({
    transcript,
    targetPrompt: body.targetPrompt,
    context: {
      ...body.context,
      userId: auth.session.id,
      userLevel: body.context?.userLevel || "BEGINNER"
    }
  });

  return NextResponse.json(result);
}
