import { NextRequest, NextResponse } from "next/server";
import { detailedSampleLessons, getCurriculumLevel, verbalyxCurriculum } from "@/lib/curriculum/verbalyx-curriculum";

export async function GET(request: NextRequest) {
  const levelId = request.nextUrl.searchParams.get("level");
  const samplesOnly = request.nextUrl.searchParams.get("samples") === "true";

  if (samplesOnly) {
    return NextResponse.json({
      program: verbalyxCurriculum.program,
      version: verbalyxCurriculum.version,
      lessons: detailedSampleLessons
    });
  }

  if (levelId) {
    const level = getCurriculumLevel(levelId);
    if (!level) {
      return NextResponse.json({ error: "Curriculum level not found" }, { status: 404 });
    }

    return NextResponse.json(level);
  }

  return NextResponse.json(verbalyxCurriculum);
}
