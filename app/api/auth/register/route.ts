import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/password";
import { setAuthCookie, signToken } from "@/lib/auth/session";
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

    await setAuthCookie(token);

    return NextResponse.json({ ok: true, role: user.role });
  } catch (error) {
    const validationError = validationErrorResponse(error);
    if (validationError) return validationError;

    console.error("Registration failed", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
