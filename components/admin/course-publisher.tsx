"use client";

import { useState, startTransition } from "react";
import { BookOpenCheck, CheckCircle2, Clock, Link2, Loader2, Mic2, PlayCircle, Plus, Rocket, UploadCloud, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CourseLevel, LessonType } from "@/types";

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  level: CourseLevel;
  published: boolean;
  estimatedMinutes: number;
  lessons: Array<{
    id: string;
    title: string;
    slug: string;
    type: LessonType;
    dayNumber: number;
    durationMinutes: number;
    mediaUrl?: string | null;
  }>;
}

interface TemplateLesson {
  title: string;
  slug: string;
  type: LessonType;
  dayNumber: number;
  durationMinutes: number;
  mediaUrl?: string;
  objective: string;
  activities: string[];
}

interface CourseTemplate {
  title: string;
  slug: string;
  level: CourseLevel;
  estimatedMinutes: number;
  description: string;
  lessons: TemplateLesson[];
}

const templates: CourseTemplate[] = [
  {
    title: "Beginner Speaking Sprint",
    slug: "beginner-speaking-sprint",
    level: "BEGINNER",
    estimatedMinutes: 180,
    description: "A practical starter path for introductions, daily routines, common questions, and simple confident answers.",
    lessons: [
      {
        title: "Introduce Yourself Naturally",
        slug: "introduce-yourself-naturally",
        type: "SPEAKING",
        dayNumber: 1,
        durationMinutes: 18,
        objective: "Build a clear 30-second self introduction.",
        activities: ["Listen to a model answer", "Record your own introduction", "Retry with slower pacing"]
      },
      {
        title: "Daily Routine Fluency",
        slug: "daily-routine-fluency",
        type: "VOCABULARY",
        dayNumber: 2,
        durationMinutes: 16,
        objective: "Speak about habits using simple time expressions.",
        activities: ["Learn routine phrases", "Make 5 full sentences", "Record a morning routine answer"]
      },
      {
        title: "Answer Common Questions",
        slug: "answer-common-questions",
        type: "GRAMMAR",
        dayNumber: 3,
        durationMinutes: 20,
        objective: "Answer what, why, and how questions with complete sentences.",
        activities: ["Practice question patterns", "Answer 6 prompts", "Review grammar feedback"]
      }
    ]
  },
  {
    title: "Interview English Accelerator",
    slug: "interview-english-accelerator",
    level: "INTERMEDIATE",
    estimatedMinutes: 240,
    description: "A role-play course for job interviews, project explanations, strengths, weaknesses, and confident follow-up answers.",
    lessons: [
      {
        title: "Tell Me About Yourself",
        slug: "tell-me-about-yourself",
        type: "SPEAKING",
        dayNumber: 1,
        durationMinutes: 22,
        objective: "Structure a professional self introduction.",
        activities: ["Use present-past-future structure", "Record a 60-second answer", "Improve clarity and pace"]
      },
      {
        title: "Explain A Project Clearly",
        slug: "explain-a-project-clearly",
        type: "SPEAKING",
        dayNumber: 2,
        durationMinutes: 24,
        objective: "Explain a project with problem, action, and result.",
        activities: ["Build a STAR answer", "Use strong action verbs", "Retry with better transitions"]
      },
      {
        title: "Strengths And Weaknesses",
        slug: "strengths-and-weaknesses",
        type: "GRAMMAR",
        dayNumber: 3,
        durationMinutes: 20,
        objective: "Answer personal questions without sounding memorized.",
        activities: ["Practice balanced answers", "Add one real example", "Get grammar correction"]
      }
    ]
  },
  {
    title: "Presentation Fluency Studio",
    slug: "presentation-fluency-studio",
    level: "ADVANCED",
    estimatedMinutes: 300,
    description: "Advanced speaking practice for presentations, debates, storytelling, persuasion, and executive-style clarity.",
    lessons: [
      {
        title: "Open With Impact",
        slug: "open-with-impact",
        type: "VIDEO",
        dayNumber: 1,
        durationMinutes: 25,
        objective: "Start a presentation with a strong hook and clear agenda.",
        activities: ["Write a hook", "Record the opening", "Improve emphasis and pausing"]
      },
      {
        title: "Persuasive Speaking",
        slug: "persuasive-speaking",
        type: "SPEAKING",
        dayNumber: 2,
        durationMinutes: 28,
        objective: "Support an opinion with evidence and contrast.",
        activities: ["State an opinion", "Add two reasons", "Use contrast phrases"]
      },
      {
        title: "Handle Questions Confidently",
        slug: "handle-questions-confidently",
        type: "QUIZ",
        dayNumber: 3,
        durationMinutes: 22,
        objective: "Respond to unexpected questions with calm structure.",
        activities: ["Use bridge phrases", "Answer follow-up questions", "Practice recovery sentences"]
      }
    ]
  }
];

const emptyCourse = {
  title: "",
  slug: "",
  description: "",
  level: "BEGINNER" as CourseLevel,
  estimatedMinutes: 120
};

const emptyVideoLesson = {
  courseId: "",
  title: "",
  slug: "",
  dayNumber: 1,
  durationMinutes: 12,
  mediaUrl: "",
  objective: ""
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function parseError(response: Response) {
  const data = await response.json().catch(() => null);
  return data?.issues?.[0]?.message || data?.error || "Request failed";
}

export function CoursePublisher({ initialCourses }: { initialCourses: Course[] }) {
  const [courses, setCourses] = useState(initialCourses);
  const [form, setForm] = useState(emptyCourse);
  const [videoForm, setVideoForm] = useState(emptyVideoLesson);
  const [message, setMessage] = useState("");
  const [busyKey, setBusyKey] = useState("");

  const refreshCourses = async () => {
    const response = await fetch("/api/admin/courses");
    if (response.ok) {
      setCourses(await response.json());
    }
  };

  const createCourse = async (template?: CourseTemplate) => {
    const source = template || {
      ...form,
      slug: form.slug || slugify(form.title),
      published: true,
      lessons: [] as TemplateLesson[]
    };
    const key = template ? template.slug : "custom";

    setBusyKey(key);
    setMessage("");

    try {
      const existing = courses.find((course) => course.slug === source.slug);
      let course = existing;

      if (!course) {
        const response = await fetch("/api/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: source.title,
            slug: source.slug,
            description: source.description,
            level: source.level,
            published: true,
            estimatedMinutes: source.estimatedMinutes
          })
        });

        if (!response.ok) throw new Error(await parseError(response));
        course = await response.json();
      } else if (!course.published) {
        const response = await fetch(`/api/courses/${course.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ published: true })
        });
        if (!response.ok) throw new Error(await parseError(response));
      }

      for (const lesson of source.lessons) {
        const alreadyExists = course?.lessons.some((item) => item.slug === lesson.slug);
        if (alreadyExists || !course) continue;

        const response = await fetch("/api/lessons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId: course.id,
            title: lesson.title,
            slug: lesson.slug,
            type: lesson.type,
            dayNumber: lesson.dayNumber,
            durationMinutes: lesson.durationMinutes,
            content: {
              objective: lesson.objective,
              activities: lesson.activities,
              speakingPrompt: "Record a short answer and improve it after AI feedback."
            },
            mediaUrl: lesson.mediaUrl || ""
          })
        });
        if (!response.ok) throw new Error(await parseError(response));
      }

      await refreshCourses();
      setForm(emptyCourse);
      setMessage(`${source.title} is published.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not publish course.");
    } finally {
      setBusyKey("");
    }
  };

  const togglePublished = (course: Course) => {
    startTransition(async () => {
      setBusyKey(course.id);
      setMessage("");
      const response = await fetch(`/api/courses/${course.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !course.published })
      });

      if (!response.ok) {
        setMessage(await parseError(response));
      } else {
        await refreshCourses();
        setMessage(`${course.title} is now ${course.published ? "unpublished" : "published"}.`);
      }
      setBusyKey("");
    });
  };

  const createVideoLesson = () => {
    startTransition(async () => {
      const selectedCourse = courses.find((course) => course.id === videoForm.courseId);
      const key = "video-lesson";

      setBusyKey(key);
      setMessage("");

      try {
        const response = await fetch("/api/lessons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId: videoForm.courseId,
            title: videoForm.title,
            slug: videoForm.slug || slugify(videoForm.title),
            type: "VIDEO",
            dayNumber: videoForm.dayNumber,
            durationMinutes: videoForm.durationMinutes,
            mediaUrl: videoForm.mediaUrl,
            content: {
              objective: videoForm.objective || "Watch the video lesson, note three useful phrases, then practice them aloud.",
              activities: ["Watch the full video", "Write down three useful expressions", "Record a short spoken summary"],
              speakingPrompt: "Summarize the lesson in 45 seconds using your own words."
            }
          })
        });

        if (!response.ok) throw new Error(await parseError(response));

        await refreshCourses();
        setVideoForm(emptyVideoLesson);
        setMessage(`Video lesson added${selectedCourse ? ` to ${selectedCourse.title}` : ""}.`);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not add video lesson.");
      } finally {
        setBusyKey("");
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Course Publisher</p>
            <h2 className="mt-2 font-display text-3xl font-bold">Publish real spoken-English courses</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Launch ready-made courses for beginner confidence, interview English, and advanced presentation fluency. Each template creates lessons students can open immediately.
            </p>
          </div>
          <div className="rounded-2xl bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">
            {courses.filter((course) => course.published).length} live courses
          </div>
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-3">
        {templates.map((template) => {
          const existing = courses.find((course) => course.slug === template.slug);
          const isBusy = busyKey === template.slug;

          return (
            <Card key={template.slug} className="rounded-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{template.level}</p>
                  <h3 className="mt-2 font-display text-2xl font-bold">{template.title}</h3>
                </div>
                {existing?.published ? <CheckCircle2 className="h-5 w-5 text-accent" /> : <Rocket className="h-5 w-5 text-primary" />}
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{template.description}</p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded-full bg-muted px-3 py-1">{template.lessons.length} lessons</span>
                <span className="rounded-full bg-muted px-3 py-1">{template.estimatedMinutes} mins</span>
                <span className="rounded-full bg-muted px-3 py-1">AI speaking tasks</span>
              </div>
              <div className="mt-5 space-y-2">
                {template.lessons.map((lesson) => (
                  <div key={lesson.slug} className="flex items-center gap-3 rounded-xl border border-border bg-background/60 p-3 text-sm">
                    {lesson.type === "VIDEO" ? <PlayCircle className="h-4 w-4 text-primary" /> : <Mic2 className="h-4 w-4 text-primary" />}
                    <span>{lesson.title}</span>
                  </div>
                ))}
              </div>
              <Button className="mt-5 w-full gap-2" onClick={() => createCourse(template)} disabled={Boolean(busyKey)}>
                {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                {existing?.published ? "Refresh Course" : "Publish Course"}
              </Button>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Custom Course</p>
          <h2 className="mt-2 font-display text-2xl font-bold">Create a live course</h2>
          <div className="mt-5 space-y-3">
            <Input
              placeholder="Course title"
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  title: event.target.value,
                  slug: current.slug || slugify(event.target.value)
                }))
              }
            />
            <Input
              placeholder="course-slug"
              value={form.slug}
              onChange={(event) => setForm((current) => ({ ...current, slug: slugify(event.target.value) }))}
            />
            <select
              className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
              value={form.level}
              onChange={(event) => setForm((current) => ({ ...current, level: event.target.value as CourseLevel }))}
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
            <Input
              type="number"
              min={5}
              value={form.estimatedMinutes}
              onChange={(event) => setForm((current) => ({ ...current, estimatedMinutes: Number(event.target.value) }))}
            />
            <Textarea
              placeholder="Course description"
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            />
            <Button className="w-full gap-2" onClick={() => createCourse()} disabled={Boolean(busyKey) || !form.title || !form.description}>
              {busyKey === "custom" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Publish Custom Course
            </Button>
            {message ? <p className="rounded-2xl bg-primary/10 p-3 text-sm text-primary">{message}</p> : null}
          </div>
        </Card>

        <Card className="rounded-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Video Lessons</p>
          <h2 className="mt-2 font-display text-2xl font-bold">Add video by link</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Paste a YouTube, Vimeo, or direct MP4/WebM link. Students will see it as a playable video inside the course.
          </p>
          <div className="mt-5 space-y-3">
            <select
              className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
              value={videoForm.courseId}
              onChange={(event) => setVideoForm((current) => ({ ...current, courseId: event.target.value }))}
            >
              <option value="">Select course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
            <Input
              placeholder="Video lesson title"
              value={videoForm.title}
              onChange={(event) =>
                setVideoForm((current) => ({
                  ...current,
                  title: event.target.value,
                  slug: current.slug || slugify(event.target.value)
                }))
              }
            />
            <Input
              placeholder="video-lesson-slug"
              value={videoForm.slug}
              onChange={(event) => setVideoForm((current) => ({ ...current, slug: slugify(event.target.value) }))}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                type="number"
                min={1}
                placeholder="Day number"
                value={videoForm.dayNumber}
                onChange={(event) => setVideoForm((current) => ({ ...current, dayNumber: Number(event.target.value) }))}
              />
              <Input
                type="number"
                min={1}
                placeholder="Duration minutes"
                value={videoForm.durationMinutes}
                onChange={(event) => setVideoForm((current) => ({ ...current, durationMinutes: Number(event.target.value) }))}
              />
            </div>
            <div className="relative">
              <Link2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-11"
                placeholder="https://youtube.com/watch?v=... or https://example.com/video.mp4"
                value={videoForm.mediaUrl}
                onChange={(event) => setVideoForm((current) => ({ ...current, mediaUrl: event.target.value }))}
              />
            </div>
            <Textarea
              placeholder="What should students learn from this video?"
              value={videoForm.objective}
              onChange={(event) => setVideoForm((current) => ({ ...current, objective: event.target.value }))}
            />
            <Button
              className="w-full gap-2"
              onClick={createVideoLesson}
              disabled={Boolean(busyKey) || !videoForm.courseId || !videoForm.title || !videoForm.mediaUrl}
            >
              {busyKey === "video-lesson" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Video className="h-4 w-4" />}
              Add Video Lesson
            </Button>
          </div>
        </Card>

        <Card className="rounded-2xl lg:col-span-2">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Live Catalog</p>
          <h2 className="mt-2 font-display text-2xl font-bold">Published and draft courses</h2>
          <div className="mt-5 space-y-3">
            {courses.map((course) => (
              <div key={course.id} className="rounded-2xl border border-border bg-background/60 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{course.title}</p>
                      <span className={`rounded-full px-3 py-1 text-xs ${course.published ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}`}>
                        {course.published ? "Published" : "Draft"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{course.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1">
                        <BookOpenCheck className="h-3 w-3" />
                        {course.lessons.length} lessons
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1">
                        <Video className="h-3 w-3" />
                        {course.lessons.filter((lesson) => lesson.type === "VIDEO" || lesson.mediaUrl).length} videos
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1">
                        <Clock className="h-3 w-3" />
                        {course.estimatedMinutes} mins
                      </span>
                      <span className="rounded-full bg-muted px-3 py-1">{course.level}</span>
                    </div>
                  </div>
                  <Button variant={course.published ? "ghost" : "secondary"} onClick={() => togglePublished(course)} disabled={busyKey === course.id}>
                    {busyKey === course.id ? "Saving..." : course.published ? "Unpublish" : "Publish"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
