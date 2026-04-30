import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Mic2,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Target,
  Video,
  Wand2
} from "lucide-react";
import { StudentShell } from "@/components/dashboard/student-shell";
import { LessonCompletionActions } from "@/components/learning/lesson-completion-actions";
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

function getLessonContent(content: unknown) {
  if (!content || typeof content !== "object" || Array.isArray(content)) return null;

  const data = content as {
    objective?: unknown;
    explanation?: unknown;
    activities?: unknown;
    practiceExercise?: unknown;
    speakingPrompts?: unknown;
    speakingPrompt?: unknown;
    realLifeScenario?: unknown;
    dailyChallenge?: unknown;
    pronunciationDrill?: unknown;
    commonMistake?: unknown;
    aiScenario?: unknown;
  };

  return {
    objective: typeof data.objective === "string" ? data.objective : null,
    explanation: typeof data.explanation === "string" ? data.explanation : null,
    activities: Array.isArray(data.activities) ? data.activities.filter((item): item is string => typeof item === "string") : [],
    practiceExercise: typeof data.practiceExercise === "string" ? data.practiceExercise : null,
    speakingPrompts: Array.isArray(data.speakingPrompts)
      ? data.speakingPrompts.filter((item): item is string => typeof item === "string")
      : typeof data.speakingPrompt === "string"
        ? [data.speakingPrompt]
        : [],
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

function buildPracticeHref(path: "/practice/speaking" | "/practice/conversation", values: Record<string, string | null | undefined>) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(values)) {
    if (value) params.set(key, value);
  }

  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

export default async function LessonPlayerPage({
  params
}: {
  params: Promise<{ courseId: string; lessonSlug: string }>;
}) {
  const session = await requireUser();
  const { courseId, lessonSlug } = await params;
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

  const lesson = course.lessons.find((item) => item.slug === lessonSlug);
  if (!lesson) notFound();

  const progress = await prisma.progress.findMany({
    where: {
      userId: session.id,
      lessonId: { in: course.lessons.map((item) => item.id) }
    }
  });

  const completedLessons = course.lessons.filter((item) =>
    progress.some((progressItem) => progressItem.lessonId === item.id && progressItem.completed)
  ).length;
  const currentProgress = progress.find((item) => item.lessonId === lesson.id);
  const lessonIndex = course.lessons.findIndex((item) => item.id === lesson.id);
  const previousLesson = lessonIndex > 0 ? course.lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex >= 0 ? course.lessons[lessonIndex + 1] : null;
  const lessonContent = getLessonContent(lesson.content);
  const videoSource = getVideoSource(lesson.mediaUrl);
  const speakingPrompt = lessonContent?.speakingPrompts[0] || lessonContent?.objective || `Speak for one minute about ${lesson.title}.`;
  const conversationPrompt = lessonContent?.aiOpening || lessonContent?.realLifeScenario || lessonContent?.objective || speakingPrompt;
  const speakingHref = buildPracticeHref("/practice/speaking", {
    title: lesson.title,
    level: course.level,
    prompt: speakingPrompt
  });
  const conversationHref = buildPracticeHref("/practice/conversation", {
    topic: lesson.title,
    level: course.level,
    prompt: conversationPrompt
  });
  const courseHref = `/courses/${course.slug}`;
  const nextHref = nextLesson ? `/courses/${course.slug}/lessons/${nextLesson.slug}` : undefined;

  return (
    <StudentShell title={lesson.title} subtitle={`${course.title} • Day ${lesson.dayNumber}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href={courseHref} className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <ArrowLeft className="h-4 w-4" />
          Back to course path
        </Link>
        <div className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
          {percentage(completedLessons, course.lessons.length)}% course complete
        </div>
      </div>

      <section className="overflow-hidden rounded-[2rem] border border-border bg-[radial-gradient(circle_at_top_left,rgba(245,194,66,0.22),transparent_34%),linear-gradient(135deg,#07111f,#122132)] p-6 text-white shadow-premium lg:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
              <BookOpenCheck className="h-4 w-4" />
              Day {lesson.dayNumber} • {lesson.type}
            </div>
            <h2 className="mt-5 font-display text-4xl font-bold">{lesson.title}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              {lessonContent?.objective || "Complete this focused lesson, practice aloud, then mark it done to continue your course journey."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={speakingHref}>
                <Button className="gap-2 bg-white text-slate-950 hover:bg-slate-100">
                  <Mic2 className="h-4 w-4" />
                  Practice speaking
                </Button>
              </Link>
              <Link href={conversationHref}>
                <Button variant="secondary" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  AI role-play
                </Button>
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
            <p className="text-sm text-slate-300">Lesson checklist</p>
            <div className="mt-4 space-y-3 text-sm">
              {["Learn the pattern", "Speak aloud", "Try AI practice", "Mark complete"].map((item, index) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/10 p-3">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-amber-300 text-sm font-bold text-slate-950">
                    {index + 1}
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
        <div className="space-y-6">
          {videoSource ? (
            <Card className="overflow-hidden rounded-2xl p-0">
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
                <a className="flex items-center justify-between gap-4 p-5 text-sm font-semibold" href={videoSource.url} target="_blank" rel="noreferrer">
                  <span className="inline-flex items-center gap-2">
                    <Video className="h-4 w-4 text-primary" />
                    Open video lesson
                  </span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : null}
            </Card>
          ) : null}

          <Card className="rounded-2xl">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl font-bold">1. Understand the speaking pattern</h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              {lessonContent?.explanation || lessonContent?.objective || "Read the objective, say the examples aloud, and keep the sentences short and natural."}
            </p>
          </Card>

          <Card className="rounded-2xl">
            <div className="flex items-center gap-3">
              <Mic2 className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl font-bold">2. Speak aloud</h2>
            </div>
            <div className="mt-5 grid gap-3">
              {(lessonContent?.speakingPrompts.length ? lessonContent.speakingPrompts : [speakingPrompt]).map((prompt, index) => (
                <div key={prompt} className="rounded-2xl border border-border bg-background/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Prompt {index + 1}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{prompt}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-2xl">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl font-bold">3. Practice in a real situation</h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              {lessonContent?.realLifeScenario || "Use the AI role-play to practice this skill in a realistic everyday conversation."}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={conversationHref}>
                <Button className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Start AI role-play
                </Button>
              </Link>
              <Link href={speakingHref}>
                <Button variant="secondary" className="gap-2">
                  <Mic2 className="h-4 w-4" />
                  Record answer
                </Button>
              </Link>
            </div>
          </Card>

          <LessonCompletionActions
            lessonId={lesson.id}
            nextHref={nextHref}
            courseHref={courseHref}
            completed={Boolean(currentProgress?.completed)}
          />
        </div>

        <aside className="space-y-6">
          <Card className="rounded-2xl">
            <h2 className="font-display text-2xl font-bold">Coach notes</h2>
            <div className="mt-5 space-y-4 text-sm leading-6 text-muted-foreground">
              {lessonContent?.practiceExercise ? (
                <div className="rounded-2xl bg-primary/5 p-4">
                  <p className="font-semibold text-foreground">Practice exercise</p>
                  <p className="mt-2">{lessonContent.practiceExercise}</p>
                </div>
              ) : null}
              {lessonContent?.pronunciationDrill ? (
                <div className="rounded-2xl bg-amber-50 p-4 dark:bg-amber-950/20">
                  <p className="font-semibold text-amber-700 dark:text-amber-300">Pronunciation drill</p>
                  <p className="mt-2">{lessonContent.pronunciationDrill}</p>
                </div>
              ) : null}
              {lessonContent?.commonMistake?.wrong && lessonContent.commonMistake.correct ? (
                <div className="rounded-2xl bg-rose-50 p-4 dark:bg-rose-950/20">
                  <p className="font-semibold text-rose-600">Common mistake</p>
                  <p className="mt-2">Wrong: {lessonContent.commonMistake.wrong}</p>
                  <p>Correct: {lessonContent.commonMistake.correct}</p>
                  {lessonContent.commonMistake.why ? <p className="mt-2">{lessonContent.commonMistake.why}</p> : null}
                </div>
              ) : null}
              {lessonContent?.dailyChallenge ? (
                <div className="rounded-2xl bg-accent/10 p-4">
                  <p className="font-semibold text-foreground">Daily challenge</p>
                  <p className="mt-2">{lessonContent.dailyChallenge}</p>
                </div>
              ) : null}
              {!lessonContent?.practiceExercise && !lessonContent?.pronunciationDrill && !lessonContent?.dailyChallenge ? (
                <p>Keep your answer short, clear, and natural. Repeat the final version twice before completing the lesson.</p>
              ) : null}
            </div>
          </Card>

          <Card className="rounded-2xl">
            <h2 className="font-display text-2xl font-bold">Lesson navigation</h2>
            <div className="mt-5 grid gap-3">
              {previousLesson ? (
                <Link href={`/courses/${course.slug}/lessons/${previousLesson.slug}`}>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Previous lesson
                  </Button>
                </Link>
              ) : null}
              {nextLesson ? (
                <Link href={`/courses/${course.slug}/lessons/${nextLesson.slug}`}>
                  <Button variant="secondary" className="w-full justify-start gap-2">
                    Next lesson
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Link href={courseHref}>
                  <Button variant="secondary" className="w-full justify-start gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Back to certificate
                  </Button>
                </Link>
              )}
            </div>
          </Card>

          <Card className="rounded-2xl">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 h-5 w-5 text-primary" />
              <div>
                <h2 className="font-display text-xl font-bold">Rule for progress</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  A lesson counts only after you finish the guided activity and click complete. This keeps certificates meaningful.
                </p>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </StudentShell>
  );
}
