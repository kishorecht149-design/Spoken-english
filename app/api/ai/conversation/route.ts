import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getTutorConversation, type TutorContext } from "@/lib/services/ai-fallback";
import { applyRateLimit, requireApiUser } from "@/lib/services/api";

export async function POST(request: NextRequest) {
  const rateLimited = applyRateLimit(request, 20);
  if (rateLimited) return rateLimited;

  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;

  const body = (await request.json()) as {
    topic: string;
    message: string;
    context?: TutorContext;
  };

  const result = await getTutorConversation({
    topic: body.topic,
    message: body.message,
    context: {
      ...body.context,
      userId: auth.session.id,
      userLevel: body.context?.userLevel || "BEGINNER"
    }
  });

  await prisma.conversation.create({
    data: {
      userId: auth.session.id,
      topic: body.topic,
      transcript: [
        { role: "student", content: body.message },
        { role: "coach", content: result.reply, layer: result.layer, qualityScore: result.qualityScore }
      ],
      feedback: result.tips.join(" ")
    }
  });

  return NextResponse.json(result);
}
