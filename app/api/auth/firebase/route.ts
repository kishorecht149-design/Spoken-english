import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { z } from "zod";
import { getFirebaseAdminAuth } from "@/lib/auth/firebase-admin";
import { hashPassword } from "@/lib/auth/password";
import { setAuthCookie, signToken } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { applyRateLimit, parseBody, validationErrorResponse } from "@/lib/services/api";

const firebaseLoginSchema = z.object({
  idToken: z.string().min(20)
});

export async function POST(request: NextRequest) {
  try {
    const rateLimited = applyRateLimit(request, 10);
    if (rateLimited) return rateLimited;

    const payload = await parseBody(request, firebaseLoginSchema);
    const decoded = await getFirebaseAdminAuth().verifyIdToken(payload.idToken);

    if (!decoded.email || decoded.email_verified === false) {
      return NextResponse.json({ error: "Google email is not verified." }, { status: 403 });
    }

    const email = decoded.email.toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing?.role === Role.ADMIN) {
      return NextResponse.json({ error: "Use the admin login portal for this account." }, { status: 403 });
    }

    const user =
      existing ||
      (await prisma.user.create({
        data: {
          name: decoded.name || email.split("@")[0],
          email,
          password: await hashPassword(crypto.randomUUID()),
          avatarUrl: decoded.picture,
          referralCode: crypto.randomUUID().slice(0, 8).toUpperCase()
        }
      }));

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        lastActiveAt: new Date(),
        avatarUrl: user.avatarUrl || decoded.picture
      }
    });

    const token = await signToken({
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
      name: updatedUser.name
    });

    await setAuthCookie(token);
    return NextResponse.json({ ok: true, role: updatedUser.role });
  } catch (error) {
    const validationError = validationErrorResponse(error);
    if (validationError) return validationError;

    console.error("Firebase login failed", error);
    return NextResponse.json({ error: "Firebase login failed" }, { status: 500 });
  }
}
