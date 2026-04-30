import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiUser } from "@/lib/services/api";

export async function POST(request: NextRequest) {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;

  const body = (await request.json().catch(() => null)) as { courseId?: string } | null;
  const courseId = body?.courseId;

  if (!courseId) {
    return NextResponse.json({ error: "Course is required" }, { status: 400 });
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { lessons: true }
  });

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const completedLessons = await prisma.progress.count({
    where: {
      userId: auth.session.id,
      completed: true,
      lessonId: { in: course.lessons.map((lesson) => lesson.id) }
    }
  });

  if (!course.lessons.length || completedLessons < course.lessons.length) {
    return NextResponse.json({ error: "Complete all lessons before generating the certificate." }, { status: 400 });
  }

  const existing = await prisma.certificate.findFirst({
    where: {
      userId: auth.session.id,
      courseId: course.id
    }
  });

  const certificate =
    existing ||
    (await prisma.certificate.create({
      data: {
        userId: auth.session.id,
        courseId: course.id,
        title: course.title
      }
    }));

  return NextResponse.json({
    id: certificate.id,
    downloadUrl: `/api/certificates/${certificate.id}`
  });
}
