export type UserRole = "ADMIN" | "STUDENT";
export type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type LessonType = "GRAMMAR" | "VOCABULARY" | "SPEAKING" | "QUIZ" | "VIDEO";

export interface DashboardStats {
  totalLessons: number;
  completedLessons: number;
  currentStreak: number;
  totalPoints: number;
}
