import { Role } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

const curriculumOrder = ["foundation-builder", "confidence-builder", "fluency-professional-communication"];

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

  const sortedCourses = [...courses].sort((a, b) => {
    const aIndex = curriculumOrder.indexOf(a.slug);
    const bIndex = curriculumOrder.indexOf(b.slug);

    if (aIndex !== -1 || bIndex !== -1) {
      return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
    }

    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  return { courses: sortedCourses, progress, announcements };
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
