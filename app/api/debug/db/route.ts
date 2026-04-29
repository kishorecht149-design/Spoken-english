import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  const debugKey = request.headers.get("x-debug-key");
  if (!process.env.JWT_SECRET || debugKey !== process.env.JWT_SECRET) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    await prisma.user.count();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown database error"
      },
      { status: 500 }
    );
  }
}
