import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiUser } from "@/lib/services/api";

export async function GET() {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;
  if (auth.session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const courses = await prisma.course.findMany({
    include: { lessons: true },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(courses);
}
