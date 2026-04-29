import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { simulateConversation } from "@/lib/services/openai";
import { applyRateLimit, requireApiUser } from "@/lib/services/api";

export async function POST(request: NextRequest) {
  const rateLimited = applyRateLimit(request, 20);
  if (rateLimited) return rateLimited;

  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;

  const body = (await request.json()) as { topic: string; message: string };
  const result = await simulateConversation(body.topic, body.message);

  await prisma.conversation.create({
    data: {
      userId: auth.session.id,
      topic: body.topic,
      transcript: [
        { role: "student", content: body.message },
        { role: "coach", content: result.reply }
      ],
      feedback: result.tips.join(" ")
    }
  });

  return NextResponse.json(result);
}
