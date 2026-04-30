import Link from "next/link";
import {
  BookOpenCheck,
  CheckCircle2,
  Flame,
  Gem,
  Heart,
  LockKeyhole,
  Mic2,
  MessageCircle,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Zap
} from "lucide-react";
import { StudentShell } from "@/components/dashboard/student-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { percentage } from "@/lib/utils";

export const dynamic = "force-dynamic";

const curriculumOrder = ["foundation-builder", "confidence-builder", "fluency-professional-communication"];

const unitSkins = [
  {
    gradient: "from-[#57c785] via-[#1f9f68] to-[#096b4b]",
    badge: "Unit 1",
    mission: "Build your speaking base"
  },
  {
    gradient: "from-[#4aa8ff] via-[#1d75d8] to-[#123f8c]",
    badge: "Unit 2",
    mission: "Answer confidently in real situations"
  },
  {
    gradient: "from-[#ffb84d] via-[#f06b2f] to-[#9f2f16]",
    badge: "Unit 3",
    mission: "Speak professionally with polish"
  }
];

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

function nodeIcon(type: string, completed: boolean, locked: boolean) {
  if (locked) return LockKeyhole;
  if (completed) return CheckCircle2;
  if (type === "VIDEO") return PlayCircle;
  if (type === "SPEAKING") return Mic2;
  if (type === "QUIZ") return ShieldCheck;
  return Star;
}

export default async function CoursesPage() {
  const session = await requireUser();

  const [courses, user, progress] = await Promise.all([
    prisma.course.findMany({
      where: { published: true, slug: { in: curriculumOrder } },
      include: { lessons: { orderBy: { dayNumber: "asc" } } },
      orderBy: { createdAt: "desc" }
    }),
    prisma.user.findUnique({ where: { id: session.id } }),
    prisma.progress.findMany({ where: { userId: session.id } })
  ]);

  const sortedCourses = sortCourses(courses);
  const totalLessons = sortedCourses.reduce((total, course) => total + course.lessons.length, 0);
  const completedLessons = progress.filter((item) => item.completed).length;
  const overallProgress = percentage(completedLessons, totalLessons);
  let previousCoreComplete = true;

  return (
    <StudentShell
      title="Verbalyx Path"
      subtitle="A bite-sized speaking journey with XP, streaks, review, and AI role-play."
    >
      <section className="overflow-hidden rounded-[2rem] border border-border bg-[#10251d] text-white shadow-premium">
        <div className="grid gap-6 bg-[radial-gradient(circle_at_top_left,rgba(255,220,92,0.28),transparent_36%),linear-gradient(135deg,#10251d,#0b1f30)] p-6 lg:grid-cols-[1fr_auto] lg:items-center lg:p-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-lime-200">
              <Sparkles className="h-4 w-4" />
              Daily speaking path
            </div>
            <h2 className="mt-5 font-display text-4xl font-bold">One small lesson. One speaking win. Every day.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200">
              Lessons are short rounds: notice the pattern, build a sentence, speak it aloud, repair a mistake, then role-play with AI.
            </p>
          </div>
          <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/10 p-5 sm:grid-cols-4 lg:min-w-[520px]">
            {[
              { icon: Flame, label: "Streak", value: `${user?.streakCount || 0}d`, color: "text-orange-200" },
              { icon: Zap, label: "XP", value: user?.totalPoints || 0, color: "text-yellow-200" },
              { icon: Heart, label: "Hearts", value: 5, color: "text-rose-200" },
              { icon: Gem, label: "Gems", value: 120, color: "text-cyan-200" }
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-white/10 p-3 text-center">
                <stat.icon className={`mx-auto h-5 w-5 ${stat.color}`} />
                <p className="mt-2 font-display text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-slate-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          {sortedCourses.map((course, courseIndex) => {
            const skin = unitSkins[courseIndex] || unitSkins[0];
            const courseCompleted = course.lessons.every((lesson) =>
              progress.some((item) => item.lessonId === lesson.id && item.completed)
            );
            const courseLocked = !previousCoreComplete;
            previousCoreComplete = previousCoreComplete && courseCompleted;

            return (
              <section key={course.id} className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-premium">
                <div className={`bg-gradient-to-br ${skin.gradient} p-6 text-white`}>
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/75">{skin.badge}</p>
                      <h2 className="mt-2 font-display text-3xl font-bold">{course.title.replace(/^(Beginner|Intermediate|Advanced): /, "")}</h2>
                      <p className="mt-2 text-sm text-white/80">{skin.mission}</p>
                    </div>
                    <div className="rounded-2xl bg-white/15 px-4 py-3 text-sm font-semibold">
                      {percentage(
                        course.lessons.filter((lesson) => progress.some((item) => item.lessonId === lesson.id && item.completed)).length,
                        course.lessons.length
                      )}
                      % complete
                    </div>
                  </div>
                </div>

                <div className="relative mx-auto max-w-3xl px-6 py-8">
                  <div className="absolute left-1/2 top-8 h-[calc(100%-4rem)] w-2 -translate-x-1/2 rounded-full bg-muted" />
                  <div className="relative space-y-6">
                    {course.lessons.map((lesson, index) => {
                      const completed = progress.some((item) => item.lessonId === lesson.id && item.completed);
                      const previousLesson = index === 0 ? null : course.lessons[index - 1];
                      const previousLessonComplete = previousLesson
                        ? progress.some((item) => item.lessonId === previousLesson.id && item.completed)
                        : true;
                      const locked = courseLocked || (!completed && !previousLessonComplete);
                      const Icon = nodeIcon(lesson.type, completed, locked);
                      const align = index % 2 === 0 ? "mr-auto pr-16" : "ml-auto pl-16";

                      return (
                        <div key={lesson.id} className={`relative flex w-full max-w-[320px] ${align}`}>
                          <Link
                            href={locked ? "#" : `/courses/${course.slug}/lessons/${lesson.slug}`}
                            aria-disabled={locked}
                            className={`group flex w-full items-center gap-4 rounded-[2rem] border p-4 transition ${
                              locked
                                ? "cursor-not-allowed border-border bg-muted/60 opacity-60"
                                : completed
                                  ? "border-emerald-300 bg-emerald-50 shadow-[0_8px_0_#86efac] dark:bg-emerald-950/20"
                                  : "border-lime-300 bg-lime-50 shadow-[0_8px_0_#bef264] hover:-translate-y-1 dark:bg-lime-950/20"
                            }`}
                          >
                            <div
                              className={`grid h-14 w-14 shrink-0 place-items-center rounded-full border-4 text-white ${
                                locked ? "border-slate-300 bg-slate-400" : completed ? "border-emerald-200 bg-emerald-500" : "border-lime-200 bg-lime-500"
                              }`}
                            >
                              <Icon className="h-6 w-6" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Day {lesson.dayNumber}</p>
                              <p className="mt-1 font-semibold leading-5">{lesson.title.replace(/^Day \d+: /, "")}</p>
                              <p className="mt-1 text-xs text-muted-foreground">{locked ? "Complete previous lesson" : `${lesson.durationMinutes} min • +20 XP`}</p>
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        <aside className="space-y-5">
          <Card className="rounded-2xl border-lime-200 bg-lime-50 dark:bg-lime-950/20">
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-lime-600" />
              <div>
                <p className="text-sm text-muted-foreground">Path progress</p>
                <p className="font-display text-3xl font-bold">{overallProgress}%</p>
              </div>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/70 dark:bg-black/20">
              <div className="h-full rounded-full bg-lime-500" style={{ width: `${overallProgress}%` }} />
            </div>
          </Card>

          <Card className="rounded-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Daily quests</p>
            <div className="mt-4 space-y-3">
              {[
                { icon: Mic2, text: "Complete 1 speaking node", xp: "+20 XP" },
                { icon: MessageCircle, text: "Do 1 AI role-play", xp: "+15 XP" },
                { icon: BookOpenCheck, text: "Review one mistake", xp: "+10 XP" }
              ].map((quest) => (
                <div key={quest.text} className="flex items-center justify-between rounded-2xl border border-border bg-background/60 p-3 text-sm">
                  <span className="flex items-center gap-3">
                    <quest.icon className="h-4 w-4 text-primary" />
                    {quest.text}
                  </span>
                  <span className="font-semibold text-primary">{quest.xp}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Teaching loop</p>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              {["Notice a pattern", "Build a sentence", "Say it aloud", "Fix one mistake", "Use it in role-play"].map((step, index) => (
                <div key={step} className="flex items-center gap-3 rounded-2xl bg-muted/60 p-3">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{index + 1}</span>
                  {step}
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </StudentShell>
  );
}
