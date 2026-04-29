import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/services/api";
import { getAdminAnalytics } from "@/lib/services/dashboard";

export async function GET() {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;
  if (auth.session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const analytics = await getAdminAnalytics();
  return NextResponse.json(analytics);
}
