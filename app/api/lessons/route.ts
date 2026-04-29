import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { lessonSchema } from "@/lib/validators/course";
import { parseBody, requireApiUser } from "@/lib/services/api";

export async function POST(request: NextRequest) {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;
  if (auth.session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const payload = await parseBody(request, lessonSchema);
  const lesson = await prisma.lesson.create({
    data: {
      ...payload,
      mediaUrl: payload.mediaUrl || null
    }
  });

  return NextResponse.json(lesson, { status: 201 });
}
