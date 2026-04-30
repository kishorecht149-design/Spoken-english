import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { Role } from "@prisma/client";
import { GOOGLE_OAUTH_STATE_COOKIE } from "@/lib/auth/constants";
import { hashPassword } from "@/lib/auth/password";
import { setAuthCookie, signToken } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

const googleKeys = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));

interface GoogleIdTokenPayload {
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
}

function getAppUrl(request: NextRequest) {
  return process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
}

function getRedirectUri(request: NextRequest) {
  return process.env.GOOGLE_REDIRECT_URI || `${getAppUrl(request)}/api/auth/google/callback`;
}

function redirectWithError(request: NextRequest, error: string, target = "/login") {
  return NextResponse.redirect(new URL(`${target}?error=${error}`, request.url));
}

async function exchangeCodeForIdToken(request: NextRequest, code: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth is not configured.");
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: getRedirectUri(request),
      grant_type: "authorization_code"
    })
  });

  if (!response.ok) {
    throw new Error("Google token exchange failed.");
  }

  const data = (await response.json()) as { id_token?: string };
  if (!data.id_token) {
    throw new Error("Google did not return an ID token.");
  }

  const verified = await jwtVerify(data.id_token, googleKeys, {
    audience: clientId,
    issuer: ["https://accounts.google.com", "accounts.google.com"]
  });

  return verified.payload as GoogleIdTokenPayload;
}

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const savedState = cookieStore.get(GOOGLE_OAUTH_STATE_COOKIE)?.value;
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  cookieStore.delete(GOOGLE_OAUTH_STATE_COOKIE);

  if (!code || !state || !savedState || state !== savedState) {
    return redirectWithError(request, "google_state");
  }

  try {
    const profile = await exchangeCodeForIdToken(request, code);
    if (!profile.email || !profile.email_verified) {
      return redirectWithError(request, "google_unverified");
    }

    const email = profile.email.toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing?.role === Role.ADMIN) {
      return redirectWithError(request, "use_admin_login", "/admin/login");
    }

    const user =
      existing ||
      (await prisma.user.create({
        data: {
          name: profile.name || email.split("@")[0],
          email,
          password: await hashPassword(crypto.randomUUID()),
          avatarUrl: profile.picture,
          referralCode: crypto.randomUUID().slice(0, 8).toUpperCase()
        }
      }));

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        lastActiveAt: new Date(),
        avatarUrl: user.avatarUrl || profile.picture
      }
    });

    const token = await signToken({
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
      name: updatedUser.name
    });

    await setAuthCookie(token);
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("Google OAuth failed", error);
    return redirectWithError(request, "google_failed");
  }
}
