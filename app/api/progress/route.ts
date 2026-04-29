import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { progressSchema } from "@/lib/validators/progress";
import { parseBody, requireApiUser, validationErrorResponse } from "@/lib/services/api";

export async function GET() {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;

  const progress = await prisma.progress.findMany({
    where: { userId: auth.session.id },
    include: { lesson: true }
  });
  return NextResponse.json(progress);
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiUser();
    if ("error" in auth) return auth.error;

    const payload = await parseBody(request, progressSchema);
    const existing = await prisma.progress.findUnique({
      where: {
        userId_lessonId: {
          userId: auth.session.id,
          lessonId: payload.lessonId
        }
      }
    });

    const progress = await prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId: auth.session.id,
          lessonId: payload.lessonId
        }
      },
      update: payload,
      create: {
        ...payload,
        userId: auth.session.id
      }
    });

    await prisma.user.update({
      where: { id: auth.session.id },
      data: {
        lastActiveAt: new Date(),
        totalPoints: {
          increment: payload.completed && !existing?.completed ? Math.max(10, payload.score) : 0
        },
        streakCount: payload.completed && !existing?.completed ? { increment: 1 } : undefined
      }
    });

    return NextResponse.json(progress);
  } catch (error) {
    return validationErrorResponse(error) ?? NextResponse.json({ error: "Progress update failed" }, { status: 500 });
  }
}
