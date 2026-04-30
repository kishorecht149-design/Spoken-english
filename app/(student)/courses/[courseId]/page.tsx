import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  GraduationCap,
  ListChecks,
  LockKeyhole,
  Mic2,
  PlayCircle,
  Sparkles
} from "lucide-react";
import { StudentShell } from "@/components/dashboard/student-shell";
import { CertificateAction } from "@/components/learning/certificate-action";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/guards";
import { isMongoObjectId, percentage } from "@/lib/utils";

export const dynamic = "force-dynamic";

const legacyCourseRedirects: Record<string, string> = {
  "spoken-english-foundations": "foundation-builder",
  "beginner-speaking-sprint": "foundation-builder"
};

function getLessonObjective(content: unknown) {
  if (!content || typeof content !== "object" || Array.isArray(content)) return null;

  const objective = (content as { objective?: unknown }).objective;
  return typeof objective === "string" ? objective : null;
}

function getSpeakingPrompt(content: unknown) {
  if (!content || typeof content !== "object" || Array.isArray(content)) return null;

  const data = content as { speakingPrompts?: unknown; speakingPrompt?: unknown };
  if (Array.isArray(data.speakingPrompts) && typeof data.speakingPrompts[0] === "string") {
    return data.speakingPrompts[0];
  }

  return typeof data.speakingPrompt === "string" ? data.speakingPrompt : null;
}

export default async function CourseDetailsPage({
  params
}: {
  params: Promise<{ courseId: string }>;
}) {
  const session = await requireUser();
  const { courseId } = await params;
  const legacyRedirect = legacyCourseRedirects[courseId];

  if (legacyRedirect) {
    redirect(`/courses/${legacyRedirect}`);
  }

  const course = await prisma.course.findFirst({
    where: {
      OR: [{ slug: courseId }, ...(isMongoObjectId(courseId) ? [{ id: courseId }] : [])]
    },
    include: {
      lessons: { orderBy: { dayNumber: "asc" } }
    }
  });

  if (!course) notFound();

  const [progress, certificate] = await Promise.all([
    prisma.progress.findMany({
      where: {
        userId: session.id,
        lessonId: { in: course.lessons.map((lesson) => lesson.id) }
      }
    }),
    prisma.certificate.findFirst({
      where: {
        userId: session.id,
        courseId: course.id
      }
    })
  ]);

  const completed = course.lessons.filter((lesson) =>
    progress.some((item) => item.lessonId === lesson.id && item.completed)
  ).length;
  const courseProgress = percentage(completed, course.lessons.length);
  const nextLesson =
    course.lessons.find((lesson) => !progress.some((item) => item.lessonId === lesson.id && item.completed)) ||
    course.lessons[0];
  const certificateUnlocked = Boolean(course.lessons.length && completed === course.lessons.length);

  return (
    <StudentShell title={course.title} subtitle={course.description}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <ArrowLeft className="h-4 w-4" />
          All courses
        </Link>
        <div className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
          {completed}/{course.lessons.length} lessons complete
        </div>
      </div>

      <section className="overflow-hidden rounded-[2rem] border border-border bg-slate-950 text-white shadow-premium">
        <div className="grid gap-8 p-6 lg:grid-cols-[1fr_0.8fr] lg:p-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
              <GraduationCap className="h-4 w-4" />
              {course.level} pathway
            </div>
            <h2 className="mt-5 font-display text-4xl font-bold">Continue with: {nextLesson?.title || "Your first lesson"}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              Follow one lesson at a time: learn the pattern, watch/read, speak aloud, practice with AI, then mark the lesson complete.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {nextLesson ? (
                <Link href={`/courses/${course.slug}/lessons/${nextLesson.slug}`}>
                  <Button className="gap-2 bg-white text-slate-950 hover:bg-slate-100">
                    <PlayCircle className="h-4 w-4" />
                    Continue lesson
                  </Button>
                </Link>
              ) : null}
              <Link href="/practice/speaking">
                <Button variant="secondary" className="gap-2">
                  <Mic2 className="h-4 w-4" />
                  Open speaking lab
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
            <p className="text-sm text-slate-300">Course completion</p>
            <p className="mt-2 font-display text-5xl font-bold">{courseProgress}%</p>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-amber-300" style={{ width: `${courseProgress}%` }} />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm">
              <div className="rounded-xl bg-white/10 p-3">
                <p className="font-bold">{completed}</p>
                <p className="text-xs text-slate-300">Done</p>
              </div>
              <div className="rounded-xl bg-white/10 p-3">
                <p className="font-bold">{course.lessons.length}</p>
                <p className="text-xs text-slate-300">Lessons</p>
              </div>
              <div className="rounded-xl bg-white/10 p-3">
                <p className="font-bold">{course.estimatedMinutes}</p>
                <p className="text-xs text-slate-300">Minutes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-3">
        {[
          { icon: CalendarDays, title: "Step 1: Learn", text: "Open one lesson and learn the speaking pattern." },
          { icon: Mic2, title: "Step 2: Practice", text: "Record or role-play with the AI tutor for feedback." },
          { icon: Award, title: "Step 3: Certify", text: "Finish all lessons to unlock your PDF certificate." }
        ].map((item) => (
          <Card key={item.title} className="rounded-2xl">
            <item.icon className="h-5 w-5 text-primary" />
            <h3 className="mt-4 font-display text-xl font-bold">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Learning path</p>
            <h2 className="mt-2 font-display text-3xl font-bold">Daily lesson sequence</h2>
          </div>
          <p className="text-sm text-muted-foreground">{course.estimatedMinutes} mins total</p>
        </div>

        <div className="mt-6 space-y-3">
          {course.lessons.map((lesson) => {
            const lessonProgress = progress.find((item) => item.lessonId === lesson.id);
            const isComplete = Boolean(lessonProgress?.completed);
            const objective = getLessonObjective(lesson.content);
            const speakingPrompt = getSpeakingPrompt(lesson.content);

            return (
              <Link
                key={lesson.id}
                href={`/courses/${course.slug}/lessons/${lesson.slug}`}
                className="grid gap-4 rounded-2xl border border-border bg-background/60 p-5 transition hover:border-primary/40 hover:bg-primary/5 md:grid-cols-[auto_1fr_auto]"
              >
                <div className={`grid h-12 w-12 place-items-center rounded-2xl ${isComplete ? "bg-accent text-accent-foreground" : "bg-primary/10 text-primary"}`}>
                  {isComplete ? <CheckCircle2 className="h-5 w-5" /> : lesson.dayNumber}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{lesson.title}</p>
                    <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">{lesson.type}</span>
                    {lesson.mediaUrl ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        <PlayCircle className="h-3 w-3" />
                        Video
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {objective || speakingPrompt || `Day ${lesson.dayNumber}: learn, speak, receive feedback, and continue.`}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold text-primary">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {lesson.durationMinutes} mins
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </Card>

      <Card className="rounded-2xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
              {certificateUnlocked ? <Award className="h-5 w-5" /> : <LockKeyhole className="h-5 w-5" />}
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Certificate</p>
              <h2 className="mt-2 font-display text-2xl font-bold">
                {certificateUnlocked ? "Certificate unlocked" : "Complete every lesson to unlock"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Certificates are generated only after all course lessons are marked complete.
              </p>
            </div>
          </div>
          <CertificateAction courseId={course.id} existingCertificateId={certificate?.id} unlocked={certificateUnlocked} />
        </div>
      </Card>

      <Card className="rounded-2xl bg-primary/5">
        <div className="flex items-start gap-4">
          <ListChecks className="mt-1 h-5 w-5 text-primary" />
          <div>
            <h2 className="font-display text-2xl font-bold">How to use this course</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Open today’s lesson, complete the speaking task, use AI role-play if you need practice, then mark the lesson complete.
              The course page becomes your progress map, not the place to do every activity.
            </p>
          </div>
        </div>
      </Card>
    </StudentShell>
  );
}
