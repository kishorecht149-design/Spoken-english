import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { courseSchema } from "@/lib/validators/course";
import { parseBody, requireApiUser, validationErrorResponse } from "@/lib/services/api";
import { isMongoObjectId } from "@/lib/utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;
  const course = await prisma.course.findFirst({
    where: { OR: [{ slug: courseId }, ...(isMongoObjectId(courseId) ? [{ id: courseId }] : [])] },
    include: { lessons: { orderBy: { dayNumber: "asc" } } }
  });

  if (!course) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(course);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const auth = await requireApiUser();
    if ("error" in auth) return auth.error;
    if (auth.session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const payload = await parseBody(request, courseSchema.partial());
    const { courseId } = await params;
    const course = await prisma.course.update({
      where: { id: courseId },
      data: payload
    });

    return NextResponse.json(course);
  } catch (error) {
    return validationErrorResponse(error) ?? NextResponse.json({ error: "Course update failed" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;
  if (auth.session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { courseId } = await params;
  await prisma.course.delete({ where: { id: courseId } });
  return NextResponse.json({ ok: true });
}
