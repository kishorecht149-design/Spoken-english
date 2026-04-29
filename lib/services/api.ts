import { NextRequest, NextResponse } from "next/server";
import { ZodSchema } from "zod";
import { getSession } from "@/lib/auth/session";
import { rateLimit } from "@/lib/services/rate-limit";

export async function parseBody<T>(request: NextRequest, schema: ZodSchema<T>) {
  const body = await request.json();
  return schema.parse(body);
}

export async function requireApiUser() {
  const session = await getSession();
  if (!session) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    };
  }
  return { session };
}

export function applyRateLimit(request: NextRequest, limit = 25) {
  const forwarded = request.headers.get("x-forwarded-for");
  const key = forwarded?.split(",")[0]?.trim() || "local";
  const allowed = rateLimit(key, limit);

  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  return null;
}
