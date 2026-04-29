import bcrypt from "bcryptjs";
import { PrismaClient, CourseLevel, LessonType, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("Admin@12345", 10);
  const studentPassword = await bcrypt.hash("Student@12345", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@spokenpro.dev" },
    update: {},
    create: {
      name: "Platform Admin",
      email: "admin@spokenpro.dev",
      password: adminPassword,
      role: Role.ADMIN,
      referralCode: "ADMINPRO"
    }
  });

  const student = await prisma.user.upsert({
    where: { email: "student@spokenpro.dev" },
    update: {},
    create: {
      name: "Ava Student",
      email: "student@spokenpro.dev",
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
    update: {},
    create: {
      title: "Spoken English Foundations",
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
      update: {},
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
        update: {},
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
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
