import Link from "next/link";
import { ArrowRight, CalendarCheck, CheckCircle2, Flame, MessageCircle, Mic2, Sparkles, Target, Trophy } from "lucide-react";
import { requireUser } from "@/lib/auth/guards";
import { getStudentDashboard } from "@/lib/services/dashboard";
import { StudentShell } from "@/components/dashboard/student-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { percentage } from "@/lib/utils";

export const dynamic = "force-dynamic";

const skillFocus = [
  { label: "Pronunciation", score: 84, hint: "Repeat /th/ and final consonants" },
  { label: "Fluency", score: 78, hint: "Use shorter pauses between ideas" },
  { label: "Grammar", score: 88, hint: "Practice past tense storytelling" }
];

const missions = [
  { title: "Warm-up shadowing", time: "3 min", detail: "Repeat 5 model phrases aloud." },
  { title: "Main speaking task", time: "7 min", detail: "Answer today’s interview prompt." },
  { title: "Retry weak sentence", time: "2 min", detail: "Record one improved version." }
];

const roleplays = [
  "Job interview introduction",
  "College presentation opening",
  "Customer support apology",
  "Travel check-in conversation"
];

export default async function DashboardPage() {
  const session = await requireUser();
  const { courses, progress, announcements } = await getStudentDashboard(session.id);

  const completedLessons = progress.filter((item) => item.completed).length;
  const totalLessons = courses.reduce((sum, course) => sum + course.lessons.length, 0);
  const courseProgress = percentage(completedLessons, totalLessons);
  const nextCourse = courses[0];
  const nextLesson = nextCourse?.lessons.find(
    (lesson) => !progress.some((item) => item.lessonId === lesson.id && item.completed)
  ) || nextCourse?.lessons[0];

  return (
    <StudentShell
      title={`Welcome back, ${session.name}`}
      subtitle="Your speaking coach has prepared today’s plan. Finish one focused mission to keep momentum."
    >
      <section className="overflow-hidden rounded-[2rem] border border-border bg-slate-950 text-white shadow-premium">
        <div className="grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
              <Sparkles className="h-4 w-4" />
              Today’s Mission
            </div>
            <h2 className="mt-5 font-display text-4xl font-bold">Speak for 60 seconds with a clear beginning, middle, and ending.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              Prompt: introduce yourself, describe one recent challenge, and explain what you learned. Aim for confident pacing rather than perfect grammar.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/practice/speaking">
                <Button className="gap-2 bg-white text-slate-950 hover:bg-slate-100">
                  <Mic2 className="h-4 w-4" />
                  Start mission
                </Button>
              </Link>
              <Link href="/practice/conversation">
                <Button variant="secondary" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Role-play instead
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid gap-3">
            {missions.map((mission, index) => (
              <div key={mission.title} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-300 text-sm font-bold text-slate-950">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{mission.title}</p>
                      <p className="text-xs text-slate-300">{mission.detail}</p>
                    </div>
                  </div>
                  <p className="text-sm text-amber-200">{mission.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-4">
        {[
          { label: "Course Progress", value: `${courseProgress}%`, icon: Target },
          { label: "Completed Lessons", value: completedLessons, icon: CheckCircle2 },
          { label: "Current Streak", value: "6 days", icon: Flame },
          { label: "XP Points", value: "820", icon: Trophy }
        ].map((metric) => (
          <Card key={metric.label} className="rounded-2xl">
            <metric.icon className="h-5 w-5 text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">{metric.label}</p>
            <p className="mt-2 font-display text-4xl font-bold">{metric.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Card className="rounded-2xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Next Lesson</p>
              <h2 className="mt-2 font-display text-3xl font-bold">{nextLesson?.title || "Choose your first lesson"}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {nextCourse ? `${nextCourse.title} • ${nextCourse.level} path` : "Start a course to unlock your plan."}
              </p>
            </div>
            <Link href={`/courses/${nextCourse?.slug || "spoken-english-foundations"}`}>
              <Button className="gap-2">
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="mt-6 h-3 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary" style={{ width: `${courseProgress}%` }} />
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {skillFocus.map((skill) => (
              <div key={skill.label} className="rounded-2xl border border-border bg-background/60 p-4">
                <div className="flex items-center justify-between text-sm">
                  <p className="font-semibold">{skill.label}</p>
                  <p className="text-primary">{skill.score}</p>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${skill.score}%` }} />
                </div>
                <p className="mt-3 text-xs leading-5 text-muted-foreground">{skill.hint}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Role-play Library</p>
          <h2 className="mt-2 font-display text-3xl font-bold">Practice English you will actually use.</h2>
          <div className="mt-5 space-y-3">
            {roleplays.map((roleplay) => (
              <Link
                key={roleplay}
                href="/practice/conversation"
                className="flex items-center justify-between rounded-2xl border border-border bg-background/60 p-4 text-sm font-medium transition hover:border-primary/40 hover:bg-primary/5"
              >
                {roleplay}
                <ArrowRight className="h-4 w-4 text-primary" />
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-2xl">
          <h2 className="font-display text-2xl font-bold">Your Learning Path</h2>
          <div className="mt-5 space-y-4">
            {courses.map((course) => {
              const complete = course.lessons.filter((lesson) =>
                progress.some((item) => item.lessonId === lesson.id && item.completed)
              ).length;
              const value = percentage(complete, course.lessons.length);

              return (
                <div key={course.id} className="rounded-2xl border border-border p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold">{course.title}</p>
                      <p className="text-sm text-muted-foreground">{course.level} level</p>
                    </div>
                    <p className="text-sm text-primary">{complete}/{course.lessons.length} lessons</p>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="rounded-2xl">
          <h2 className="font-display text-2xl font-bold">Announcements</h2>
          <div className="mt-5 space-y-4">
            {announcements.length ? (
              announcements.map((announcement) => (
                <div key={announcement.id} className="rounded-2xl border border-border p-4">
                  <p className="font-semibold">{announcement.title}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{announcement.body}</p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-5 text-sm text-muted-foreground">
                No announcements yet. Your next learning update will appear here.
              </div>
            )}
          </div>
        </Card>
      </div>
    </StudentShell>
  );
}
