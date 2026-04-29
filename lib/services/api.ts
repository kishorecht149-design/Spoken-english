import { NextRequest, NextResponse } from "next/server";
import { ZodError, ZodSchema } from "zod";
import { getSession } from "@/lib/auth/session";
import { rateLimit } from "@/lib/services/rate-limit";

export class RequestValidationError extends Error {
  constructor(public issues: ZodError["issues"]) {
    super("Invalid request body");
    this.name = "RequestValidationError";
  }
}

export async function parseBody<T>(request: NextRequest, schema: ZodSchema<T>) {
  const body = await request.json();
  const result = schema.safeParse(body);

  if (!result.success) {
    throw new RequestValidationError(result.error.issues);
  }

  return result.data;
}

export function validationErrorResponse(error: unknown) {
  if (error instanceof RequestValidationError) {
    return NextResponse.json(
      {
        error: "Invalid request body",
        issues: error.issues
      },
      { status: 400 }
    );
  }

  return null;
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
