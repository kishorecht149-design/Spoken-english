import bcrypt from "bcryptjs";
import { CourseLevel, LessonType, Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: NextRequest) {
  const debugKey = request.headers.get("x-debug-key");
  if (!process.env.JWT_SECRET || debugKey !== process.env.JWT_SECRET) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const adminPassword = await bcrypt.hash("Admin@12345", 10);
  const studentPassword = await bcrypt.hash("Student@12345", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@verbalyx.dev" },
    update: { password: adminPassword, role: Role.ADMIN },
    create: {
      name: "Platform Admin",
      email: "admin@verbalyx.dev",
      password: adminPassword,
      role: Role.ADMIN,
      referralCode: "ADMINPRO"
    }
  });

  const student = await prisma.user.upsert({
    where: { email: "student@verbalyx.dev" },
    update: { password: studentPassword, role: Role.STUDENT },
    create: {
      name: "Ava Student",
      email: "student@verbalyx.dev",
      password: studentPassword,
      role: Role.STUDENT,
      referralCode: "AVASTART",
      referredById: admin.id,
      streakCount: 6,
      totalPoints: 820
    }
  });

  const course = await prisma.course.upsert({
    where: { slug: "spoken-english-foundations" },
    update: { title: "Verbalyx Foundations", published: true },
    create: {
      title: "Verbalyx Foundations",
      slug: "spoken-english-foundations",
      description: "Build confidence with daily grammar, vocabulary, and speaking drills.",
      level: CourseLevel.BEGINNER,
      published: true,
      estimatedMinutes: 240
    }
  });

  const lessons = [
    {
      title: "Introducing Yourself With Confidence",
      slug: "introducing-yourself",
      type: LessonType.SPEAKING,
      dayNumber: 1,
      durationMinutes: 15
    },
    {
      title: "Essential Daily Vocabulary",
      slug: "daily-vocabulary",
      type: LessonType.VOCABULARY,
      dayNumber: 2,
      durationMinutes: 12
    },
    {
      title: "Present Tense in Real Conversations",
      slug: "present-tense",
      type: LessonType.GRAMMAR,
      dayNumber: 3,
      durationMinutes: 18
    }
  ];

  for (const lesson of lessons) {
    const created = await prisma.lesson.upsert({
      where: {
        courseId_slug: {
          courseId: course.id,
          slug: lesson.slug
        }
      },
      update: lesson,
      create: {
        ...lesson,
        courseId: course.id,
        content: {
          objective: "Practice natural and confident spoken English.",
          activities: [
            "Watch the guided walkthrough",
            "Repeat the model phrases aloud",
            "Record your own speaking sample"
          ]
        }
      }
    });

    if (lesson.slug === "introducing-yourself") {
      await prisma.progress.upsert({
        where: {
          userId_lessonId: {
            userId: student.id,
            lessonId: created.id
          }
        },
        update: {
          completed: true,
          score: 88,
          fluencyScore: 86,
          grammarScore: 90,
          pronunciationScore: 87
        },
        create: {
          userId: student.id,
          lessonId: created.id,
          completed: true,
          score: 88,
          fluencyScore: 86,
          grammarScore: 90,
          pronunciationScore: 87,
          feedback: "Strong confidence. Slow down slightly between sentences for clarity."
        }
      });
    }
  }

  return NextResponse.json({
    ok: true,
    adminEmail: admin.email,
    studentEmail: student.email,
    courseSlug: course.slug,
    lessons: lessons.length
  });
}
