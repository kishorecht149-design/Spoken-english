import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { verbalyxCurriculum } from "@/lib/curriculum/verbalyx-curriculum";
import { requireApiUser } from "@/lib/services/api";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toJsonValue(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export async function POST() {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;

  if (auth.session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const summary = [];

  for (const level of verbalyxCurriculum.levels) {
    const course = await prisma.course.upsert({
      where: { slug: level.id },
      update: {
        title: level.title,
        description: level.promise,
        level: level.level,
        published: true,
        estimatedMinutes: level.lessons.reduce((total, lesson) => total + lesson.durationMinutes, 0)
      },
      create: {
        title: level.title,
        slug: level.id,
        description: level.promise,
        level: level.level,
        published: true,
        estimatedMinutes: level.lessons.reduce((total, lesson) => total + lesson.durationMinutes, 0)
      }
    });

    for (const lesson of level.lessons) {
      await prisma.lesson.upsert({
        where: {
          courseId_slug: {
            courseId: course.id,
            slug: slugify(`day-${lesson.day}-${lesson.title}`)
          }
        },
        update: {
          title: `Day ${lesson.day}: ${lesson.title}`,
          type: lesson.type,
          dayNumber: lesson.day,
          durationMinutes: lesson.durationMinutes,
          content: toJsonValue(lesson)
        },
        create: {
          courseId: course.id,
          title: `Day ${lesson.day}: ${lesson.title}`,
          slug: slugify(`day-${lesson.day}-${lesson.title}`),
          type: lesson.type,
          dayNumber: lesson.day,
          durationMinutes: lesson.durationMinutes,
          content: toJsonValue(lesson)
        }
      });
    }

    summary.push({
      courseId: course.id,
      slug: course.slug,
      title: course.title,
      lessons: level.lessons.length
    });
  }

  return NextResponse.json({
    ok: true,
    program: verbalyxCurriculum.program,
    publishedCourses: summary
  });
}
