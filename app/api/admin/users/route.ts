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
