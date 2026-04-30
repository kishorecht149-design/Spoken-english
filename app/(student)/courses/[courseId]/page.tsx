import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  Mic2,
  PlayCircle,
  Sparkles,
  Video
} from "lucide-react";
import { StudentShell } from "@/components/dashboard/student-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/guards";
import { isMongoObjectId, percentage } from "@/lib/utils";

export const dynamic = "force-dynamic";

type VideoSource = {
  kind: "iframe" | "video" | "link";
  url: string;
};

function getVideoSource(mediaUrl: string | null): VideoSource | null {
  if (!mediaUrl) return null;

  try {
    const url = new URL(mediaUrl);
    if (!["http:", "https:"].includes(url.protocol)) return null;

    const host = url.hostname.replace(/^www\./, "");
    const directVideoPattern = /\.(mp4|webm|ogg)(\?.*)?$/i;

    if (host === "youtu.be") {
      const videoId = url.pathname.split("/").filter(Boolean)[0];
      return videoId ? { kind: "iframe", url: `https://www.youtube.com/embed/${videoId}` } : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      const videoId = url.searchParams.get("v");
      const embedMatch = url.pathname.match(/^\/embed\/([^/?]+)/);
      const shortsMatch = url.pathname.match(/^\/shorts\/([^/?]+)/);
      const resolvedId = videoId || embedMatch?.[1] || shortsMatch?.[1];
      return resolvedId ? { kind: "iframe", url: `https://www.youtube.com/embed/${resolvedId}` } : null;
    }

    if (host === "vimeo.com") {
      const videoId = url.pathname.split("/").filter(Boolean)[0];
      return videoId ? { kind: "iframe", url: `https://player.vimeo.com/video/${videoId}` } : null;
    }

    if (host === "player.vimeo.com") {
      return { kind: "iframe", url: mediaUrl };
    }

    if (directVideoPattern.test(url.pathname)) {
      return { kind: "video", url: mediaUrl };
    }

    return { kind: "link", url: mediaUrl };
  } catch {
    return null;
  }
}

function getLessonObjective(content: unknown) {
  if (!content || typeof content !== "object" || Array.isArray(content)) return null;

  const objective = (content as { objective?: unknown }).objective;
  return typeof objective === "string" ? objective : null;
}

function getLessonContent(content: unknown) {
  if (!content || typeof content !== "object" || Array.isArray(content)) return null;
  const data = content as {
    explanation?: unknown;
    speakingPrompts?: unknown;
    realLifeScenario?: unknown;
    dailyChallenge?: unknown;
    pronunciationDrill?: unknown;
    commonMistake?: unknown;
    aiScenario?: unknown;
  };

  return {
    explanation: typeof data.explanation === "string" ? data.explanation : null,
    speakingPrompts: Array.isArray(data.speakingPrompts) ? data.speakingPrompts.filter((item): item is string => typeof item === "string") : [],
    realLifeScenario: typeof data.realLifeScenario === "string" ? data.realLifeScenario : null,
    dailyChallenge: typeof data.dailyChallenge === "string" ? data.dailyChallenge : null,
    pronunciationDrill: typeof data.pronunciationDrill === "string" ? data.pronunciationDrill : null,
    commonMistake:
      data.commonMistake && typeof data.commonMistake === "object" && !Array.isArray(data.commonMistake)
        ? (data.commonMistake as { wrong?: string; correct?: string; why?: string })
        : null,
    aiOpening:
      data.aiScenario && typeof data.aiScenario === "object" && !Array.isArray(data.aiScenario)
        ? (data.aiScenario as { openingLine?: string }).openingLine
        : null
  };
}

export default async function CourseDetailsPage({
  params
}: {
  params: Promise<{ courseId: string }>;
}) {
  const session = await requireUser();
  const { courseId } = await params;

  const course = await prisma.course.findFirst({
    where: {
      OR: [{ slug: courseId }, ...(isMongoObjectId(courseId) ? [{ id: courseId }] : [])]
    },
    include: {
      lessons: { orderBy: { dayNumber: "asc" } }
    }
  });

  if (!course) notFound();

  const progress = await prisma.progress.findMany({
    where: {
      userId: session.id,
      lessonId: { in: course.lessons.map((lesson) => lesson.id) }
    }
  });

  const completed = course.lessons.filter((lesson) =>
    progress.some((item) => item.lessonId === lesson.id && item.completed)
  ).length;
  const courseProgress = percentage(completed, course.lessons.length);
  const nextLesson = course.lessons.find((lesson) => !progress.some((item) => item.lessonId === lesson.id && item.completed)) || course.lessons[0];

  return (
    <StudentShell title={course.title} subtitle={course.description}>
      <section className="overflow-hidden rounded-[2rem] border border-border bg-slate-950 text-white shadow-premium">
        <div className="grid gap-8 p-6 lg:grid-cols-[1fr_0.8fr] lg:p-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
              <GraduationCap className="h-4 w-4" />
              {course.level} pathway
            </div>
            <h2 className="mt-5 font-display text-4xl font-bold">Your next step: {nextLesson?.title}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              Follow the daily sequence, practice the speaking task, then repeat the weakest sentence until your confidence score improves.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/practice/speaking">
                <Button className="gap-2 bg-white text-slate-950 hover:bg-slate-100">
                  <Mic2 className="h-4 w-4" />
                  Practice this lesson
                </Button>
              </Link>
              <Link href="/practice/conversation">
                <Button variant="secondary" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Role-play topic
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
          { icon: CalendarDays, title: "Daily rhythm", text: "One focused lesson and one speaking task per day." },
          { icon: BookOpenCheck, title: "Skill mix", text: "Grammar, vocabulary, and speaking tasks stay connected." },
          { icon: GraduationCap, title: "Certificate ready", text: "Complete the path to unlock certificate generation." }
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
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Curriculum</p>
            <h2 className="mt-2 font-display text-3xl font-bold">Daily lesson structure</h2>
          </div>
          <p className="text-sm text-muted-foreground">{course.estimatedMinutes} mins total</p>
        </div>

        <div className="mt-6 space-y-4">
          {course.lessons.map((lesson) => {
            const lessonProgress = progress.find((item) => item.lessonId === lesson.id);
            const isComplete = Boolean(lessonProgress?.completed);
            const videoSource = getVideoSource(lesson.mediaUrl);
            const objective = getLessonObjective(lesson.content);
            const lessonContent = getLessonContent(lesson.content);

            return (
              <div
                key={lesson.id}
                className="grid gap-4 rounded-2xl border border-border bg-background/60 p-5 md:grid-cols-[auto_1fr_auto]"
              >
                <div className={`grid h-12 w-12 place-items-center rounded-2xl ${isComplete ? "bg-accent text-accent-foreground" : "bg-primary/10 text-primary"}`}>
                  {isComplete ? <CheckCircle2 className="h-5 w-5" /> : lesson.dayNumber}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{lesson.title}</p>
                    <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">{lesson.type}</span>
                    {videoSource ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        <PlayCircle className="h-3 w-3" />
                        Video lesson
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {objective || `Day ${lesson.dayNumber}: learn, speak, receive feedback, and retry once.`}
                  </p>
                  {lessonContent ? (
                    <div className="mt-4 grid gap-3 lg:grid-cols-2">
                      {lessonContent.explanation ? (
                        <div className="rounded-2xl bg-muted/60 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Simple Explanation</p>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">{lessonContent.explanation}</p>
                        </div>
                      ) : null}
                      {lessonContent.realLifeScenario ? (
                        <div className="rounded-2xl bg-muted/60 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Real-Life Scenario</p>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">{lessonContent.realLifeScenario}</p>
                        </div>
                      ) : null}
                      {lessonContent.speakingPrompts.length ? (
                        <div className="rounded-2xl bg-muted/60 p-4 lg:col-span-2">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">5 Speaking Prompts</p>
                          <div className="mt-3 grid gap-2 md:grid-cols-2">
                            {lessonContent.speakingPrompts.map((prompt) => (
                              <p key={prompt} className="rounded-xl bg-background/70 p-3 text-sm leading-6 text-muted-foreground">
                                {prompt}
                              </p>
                            ))}
                          </div>
                        </div>
                      ) : null}
                      {lessonContent.dailyChallenge ? (
                        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Daily Challenge</p>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">{lessonContent.dailyChallenge}</p>
                        </div>
                      ) : null}
                      {lessonContent.pronunciationDrill ? (
                        <div className="rounded-2xl border border-amber-300/40 bg-amber-50 p-4 dark:bg-amber-950/20">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">Pronunciation Drill</p>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">{lessonContent.pronunciationDrill}</p>
                        </div>
                      ) : null}
                      {lessonContent.commonMistake?.wrong && lessonContent.commonMistake.correct ? (
                        <div className="rounded-2xl bg-rose-50 p-4 dark:bg-rose-950/20 lg:col-span-2">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-600">Common Mistake Fix</p>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            <span className="font-semibold text-rose-600">Wrong:</span> {lessonContent.commonMistake.wrong}
                          </p>
                          <p className="text-sm leading-6 text-muted-foreground">
                            <span className="font-semibold text-accent">Correct:</span> {lessonContent.commonMistake.correct}
                          </p>
                          {lessonContent.commonMistake.why ? <p className="text-sm leading-6 text-muted-foreground">{lessonContent.commonMistake.why}</p> : null}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                  {videoSource ? (
                    <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-slate-950 shadow-sm">
                      {videoSource.kind === "iframe" ? (
                        <div className="aspect-video">
                          <iframe
                            className="h-full w-full"
                            src={videoSource.url}
                            title={`${lesson.title} video lesson`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        </div>
                      ) : null}

                      {videoSource.kind === "video" ? (
                        <video className="aspect-video w-full bg-black" controls preload="metadata">
                          <source src={videoSource.url} />
                          Your browser does not support the video tag.
                        </video>
                      ) : null}

                      {videoSource.kind === "link" ? (
                        <a
                          className="flex items-center justify-between gap-4 p-4 text-sm font-semibold text-white"
                          href={videoSource.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span className="inline-flex items-center gap-2">
                            <Video className="h-4 w-4 text-amber-300" />
                            Open video lesson
                          </span>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      ) : null}
                    </div>
                  ) : null}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {lesson.durationMinutes} mins
                  <ArrowRight className="h-4 w-4 text-primary" />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </StudentShell>
  );
}
