import { Role } from "@prisma/client";
import { JWTPayload, jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/lib/auth/constants";

function getJwtSecret() {
  const value = process.env.JWT_SECRET;
  if (!value) {
    throw new Error("JWT_SECRET is not configured.");
  }
  return new TextEncoder().encode(value);
}

export interface SessionUser extends JWTPayload {
  id: string;
  email: string;
  role: Role;
  name: string;
}

export async function signToken(user: SessionUser) {
  return await new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifyToken(token: string) {
  const result = await jwtVerify(token, getJwtSecret());
  return result.payload as unknown as SessionUser;
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (!token) return null;

  try {
    return await verifyToken(token);
  } catch {
    return null;
  }
}
