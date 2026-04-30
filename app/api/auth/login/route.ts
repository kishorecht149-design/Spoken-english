import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { setAuthCookie, signToken } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validators/auth";
import { applyRateLimit, parseBody, validationErrorResponse } from "@/lib/services/api";

export async function POST(request: NextRequest) {
  try {
    const rateLimited = applyRateLimit(request, 10);
    if (rateLimited) return rateLimited;

    const payload = await parseBody(request, loginSchema);
    const user = await prisma.user.findUnique({ where: { email: payload.email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (payload.role && user.role !== payload.role) {
      return NextResponse.json({ error: "Use the correct login portal for this account." }, { status: 403 });
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

    await setAuthCookie(token);

    return NextResponse.json({ ok: true, role: user.role });
  } catch (error) {
    const validationError = validationErrorResponse(error);
    if (validationError) return validationError;

    console.error("Login failed", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
