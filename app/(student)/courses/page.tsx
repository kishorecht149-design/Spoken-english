import Link from "next/link";
import { ArrowRight, BookOpenCheck, Clock, GraduationCap, Layers3, Mic2, Sparkles } from "lucide-react";
import { StudentShell } from "@/components/dashboard/student-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

const curriculumOrder = ["foundation-builder", "confidence-builder", "fluency-professional-communication"];

function sortCourses<T extends { slug: string; createdAt: Date }>(courses: T[]) {
  return [...courses].sort((a, b) => {
    const aIndex = curriculumOrder.indexOf(a.slug);
    const bIndex = curriculumOrder.indexOf(b.slug);
    if (aIndex !== -1 || bIndex !== -1) {
      return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
    }
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}

export default async function CoursesPage() {
  await requireUser();

  const courses = sortCourses(
    await prisma.course.findMany({
      where: { published: true },
      include: { lessons: { orderBy: { dayNumber: "asc" } } },
      orderBy: { createdAt: "desc" }
    })
  );

  const totalLessons = courses.reduce((total, course) => total + course.lessons.length, 0);

  return (
    <StudentShell
      title="Your Spoken English Courses"
      subtitle="Choose the right path and complete one speaking-focused lesson every day."
    >
      <section className="overflow-hidden rounded-[2rem] border border-border bg-[radial-gradient(circle_at_top_left,rgba(245,194,66,0.22),transparent_34%),linear-gradient(135deg,#07111f,#122132)] p-6 text-white shadow-premium lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
              <Sparkles className="h-4 w-4" />
              90-day transformation system
            </div>
            <h2 className="mt-5 font-display text-4xl font-bold">Start with Foundation, then unlock confidence and professional fluency.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              Every course includes daily speaking prompts, AI scenarios, common mistake fixes, pronunciation drills, and confidence tasks.
            </p>
          </div>
          <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/10 p-5 text-center sm:grid-cols-3 lg:min-w-[360px]">
            <div>
              <p className="font-display text-3xl font-bold">{courses.length}</p>
              <p className="text-xs text-slate-300">Courses</p>
            </div>
            <div>
              <p className="font-display text-3xl font-bold">{totalLessons}</p>
              <p className="text-xs text-slate-300">Lessons</p>
            </div>
            <div>
              <p className="font-display text-3xl font-bold">80%</p>
              <p className="text-xs text-slate-300">Speaking</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        {courses.map((course) => {
          const firstLesson = course.lessons[0];
          const isCoreCurriculum = curriculumOrder.includes(course.slug);

          return (
            <Card key={course.id} className="group flex rounded-2xl flex-col">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{course.level}</p>
                  <h2 className="mt-2 font-display text-2xl font-bold">{course.title}</h2>
                </div>
                {isCoreCurriculum ? (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">Core</span>
                ) : null}
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{course.description}</p>

              <div className="mt-5 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1">
                  <BookOpenCheck className="h-3 w-3" />
                  {course.lessons.length} lessons
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1">
                  <Clock className="h-3 w-3" />
                  {course.estimatedMinutes} mins
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1">
                  <Mic2 className="h-3 w-3" />
                  Speaking tasks
                </span>
              </div>

              <div className="mt-5 rounded-2xl border border-border bg-background/60 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  First lesson
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{firstLesson?.title || "Lessons coming soon"}</p>
              </div>

              <div className="mt-auto pt-5">
                <Link href={`/courses/${course.slug}`}>
                  <Button className="w-full gap-2">
                    Open course
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="rounded-2xl">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Layers3 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold">Recommended order</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Start with Beginner: Foundation Builder, then Intermediate: Confidence Builder, then Advanced: Fluency & Professional Communication.
              You can still open any course anytime.
            </p>
          </div>
        </div>
      </Card>
    </StudentShell>
  );
}
