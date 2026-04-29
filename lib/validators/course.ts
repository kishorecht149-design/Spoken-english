import { CourseLevel, LessonType } from "@prisma/client";
import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(3).max(120),
  slug: z.string().min(3).max(120),
  description: z.string().min(20),
  level: z.nativeEnum(CourseLevel),
  published: z.boolean().default(false),
  estimatedMinutes: z.number().int().min(5)
});

export const lessonSchema = z.object({
  courseId: z.string().cuid(),
  title: z.string().min(3),
  slug: z.string().min(3),
  type: z.nativeEnum(LessonType),
  dayNumber: z.number().int().min(1),
  durationMinutes: z.number().int().min(1),
  content: z.record(z.any()),
  mediaUrl: z.string().url().optional().or(z.literal(""))
});
