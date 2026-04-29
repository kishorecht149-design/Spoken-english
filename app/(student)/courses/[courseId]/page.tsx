import { notFound } from "next/navigation";
import { StudentShell } from "@/components/dashboard/student-shell";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";

export default async function CourseDetailsPage({
  params
}: {
  params: Promise<{ courseId: string }>;
}) {
  await requireUser();
  const { courseId } = await params;

  const course = await prisma.course.findFirst({
    where: {
      OR: [{ id: courseId }, { slug: courseId }]
    },
    include: { lessons: { orderBy: { dayNumber: "asc" } } }
  });

  if (!course) notFound();

  return (
    <StudentShell title={course.title} subtitle={course.description}>
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-primary">{course.level}</p>
            <h2 className="mt-2 font-display text-3xl font-bold">Daily lesson structure</h2>
          </div>
          <p className="text-sm text-muted-foreground">{course.estimatedMinutes} mins total</p>
        </div>
        <div className="mt-6 space-y-4">
          {course.lessons.map((lesson) => (
            <div key={lesson.id} className="rounded-3xl border border-border bg-background/50 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Day {lesson.dayNumber}</p>
                  <h3 className="mt-1 font-semibold">{lesson.title}</h3>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p>{lesson.type}</p>
                  <p>{lesson.durationMinutes} mins</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </StudentShell>
  );
}
