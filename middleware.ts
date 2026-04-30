import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { AUTH_COOKIE } from "@/lib/auth/constants";

function getJwtSecret() {
  return new TextEncoder().encode(process.env.JWT_SECRET || "development-secret");
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const protectedRoutes = ["/dashboard", "/courses", "/practice", "/leaderboard", "/challenges", "/admin"];
  const shouldProtect = protectedRoutes.some((route) => pathname.startsWith(route));

  if (!shouldProtect) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL(pathname.startsWith("/admin") ? "/admin/login" : "/login", request.url));
  }

  try {
    const verified = await jwtVerify(token, getJwtSecret());
    const role = verified.payload.role;

    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL(pathname.startsWith("/admin") ? "/admin/login" : "/login", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/courses/:path*", "/practice/:path*", "/leaderboard/:path*", "/challenges/:path*", "/admin/:path*"]
};
