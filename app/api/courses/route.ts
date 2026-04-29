import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { courseSchema } from "@/lib/validators/course";
import { parseBody, requireApiUser, validationErrorResponse } from "@/lib/services/api";

export async function GET() {
  const courses = await prisma.course.findMany({
    include: { lessons: { orderBy: { dayNumber: "asc" } } },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(courses);
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiUser();
    if ("error" in auth) return auth.error;
    if (auth.session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const payload = await parseBody(request, courseSchema);
    const course = await prisma.course.create({ data: payload });
    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    return validationErrorResponse(error) ?? NextResponse.json({ error: "Course creation failed" }, { status: 500 });
  }
}
