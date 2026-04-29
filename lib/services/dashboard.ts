import { Role } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export async function getStudentDashboard(userId: string) {
  const [courses, progress, announcements] = await Promise.all([
    prisma.course.findMany({
      where: { published: true },
      include: { lessons: true },
      orderBy: { createdAt: "desc" }
    }),
    prisma.progress.findMany({
      where: { userId },
      include: { lesson: true }
    }),
    prisma.announcement.findMany({
      where: { published: true },
      take: 3,
      orderBy: { createdAt: "desc" }
    })
  ]);

  return { courses, progress, announcements };
}

export async function getAdminAnalytics() {
  const [totalUsers, activeUsers, totalCourses, completedProgress, totalProgress] = await Promise.all([
    prisma.user.count({ where: { role: Role.STUDENT } }),
    prisma.user.count({
      where: {
        role: Role.STUDENT,
        lastActiveAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    }),
    prisma.course.count(),
    prisma.progress.count({ where: { completed: true } }),
    prisma.progress.count()
  ]);

  return {
    totalUsers,
    activeUsers,
    totalCourses,
    completionRate: totalProgress ? Math.round((completedProgress / totalProgress) * 100) : 0
  };
}
