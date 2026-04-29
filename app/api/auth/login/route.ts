import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { signToken } from "@/lib/auth/session";
import { AUTH_COOKIE } from "@/lib/auth/constants";
import { loginSchema } from "@/lib/validators/auth";
import { applyRateLimit, parseBody } from "@/lib/services/api";

export async function POST(request: NextRequest) {
  const rateLimited = applyRateLimit(request, 10);
  if (rateLimited) return rateLimited;

  const payload = await parseBody(request, loginSchema);
  const user = await prisma.user.findUnique({ where: { email: payload.email } });
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const isValid = await verifyPassword(payload.password, user.password);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastActiveAt: new Date() }
  });

  const token = await signToken({
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name
  });

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  return NextResponse.json({ ok: true, role: user.role });
}
