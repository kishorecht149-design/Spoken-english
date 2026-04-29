import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiUser } from "@/lib/services/api";

export async function GET() {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;
  if (auth.session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(announcements);
}

export async function POST(request: NextRequest) {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;
  if (auth.session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as { title: string; body: string; published?: boolean };
  const announcement = await prisma.announcement.create({
    data: {
      title: body.title,
      body: body.body,
      published: body.published ?? true,
      authorId: auth.session.id
    }
  });

  return NextResponse.json(announcement, { status: 201 });
}
