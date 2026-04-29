import { z } from "zod";

export const progressSchema = z.object({
  lessonId: z.string().min(1),
  completed: z.boolean(),
  score: z.number().int().min(0).max(100),
  fluencyScore: z.number().int().min(0).max(100),
  grammarScore: z.number().int().min(0).max(100),
  pronunciationScore: z.number().int().min(0).max(100),
  feedback: z.string().min(10)
});
