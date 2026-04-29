import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/password";
import { signToken } from "@/lib/auth/session";
import { AUTH_COOKIE } from "@/lib/auth/constants";
import { parseBody, applyRateLimit, validationErrorResponse } from "@/lib/services/api";
import { registerSchema } from "@/lib/validators/auth";

export async function POST(request: NextRequest) {
  try {
    const rateLimited = applyRateLimit(request, 8);
    if (rateLimited) return rateLimited;

    const payload = await parseBody(request, registerSchema);
    const existing = await prisma.user.findUnique({ where: { email: payload.email } });
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const referredBy = payload.referralCode
      ? await prisma.user.findUnique({ where: { referralCode: payload.referralCode } })
      : null;

    const user = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: await hashPassword(payload.password),
        referralCode: crypto.randomUUID().slice(0, 8).toUpperCase(),
        referredById: referredBy?.id
      }
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
  } catch (error) {
    const validationError = validationErrorResponse(error);
    if (validationError) return validationError;

    return NextResponse.json(
      {
        error: "Registration failed",
        detail: error instanceof Error ? error.message : "Unknown server error"
      },
      { status: 500 }
    );
  }
}
