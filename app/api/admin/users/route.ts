import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiUser } from "@/lib/services/api";

export async function GET() {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;
  if (auth.session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    include: { progress: true, certificates: true },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(users);
}

export async function PATCH(request: NextRequest) {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;
  if (auth.session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as { id: string; role?: "ADMIN" | "STUDENT"; name?: string };
  const user = await prisma.user.update({
    where: { id: body.id },
    data: {
      role: body.role,
      name: body.name
    }
  });

  return NextResponse.json(user);
}

export async function DELETE(request: NextRequest) {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;
  if (auth.session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as { id?: string };
  if (!body.id) {
    return NextResponse.json({ error: "User id is required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: body.id } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.role === "ADMIN") {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    if (adminCount <= 1) {
      return NextResponse.json({ error: "Cannot delete the last admin" }, { status: 400 });
    }
  }

  await prisma.progress.deleteMany({ where: { userId: user.id } });
  await prisma.certificate.deleteMany({ where: { userId: user.id } });
  await prisma.conversation.deleteMany({ where: { userId: user.id } });
  await prisma.announcement.deleteMany({ where: { authorId: user.id } });
  await prisma.user.updateMany({
    where: { referredById: user.id },
    data: { referredById: null }
  });
  await prisma.user.delete({ where: { id: user.id } });

  return NextResponse.json({ ok: true });
}
