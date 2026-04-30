"use client";

import { useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LessonCompletionActions({
  lessonId,
  nextHref,
  courseHref,
  completed
}: {
  lessonId: string;
  nextHref?: string;
  courseHref: string;
  completed: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(completed ? "Lesson already completed." : "");

  const completeLesson = () => {
    startTransition(async () => {
      setBusy(true);
      setMessage("");

      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          completed: true,
          score: 90,
          fluencyScore: 88,
          grammarScore: 90,
          pronunciationScore: 86,
          feedback: "Lesson completed through the guided Verbalyx lesson player."
        })
      });

      if (!response.ok) {
        setMessage("Could not save progress. Please try again.");
        setBusy(false);
        return;
      }

      setMessage("Progress saved.");
      router.refresh();
      router.push(nextHref || courseHref);
    });
  };

  return (
    <div className="rounded-3xl border border-border bg-background/70 p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-2xl font-bold">Finish this lesson</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Complete the lesson after watching/reading, speaking aloud, and trying at least one AI practice task.
          </p>
          {message ? <p className="mt-2 text-sm text-primary">{message}</p> : null}
        </div>
        <Button onClick={completeLesson} disabled={busy || completed} className="gap-2">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          {completed ? "Completed" : nextHref ? "Complete & Continue" : "Complete Course"}
        </Button>
      </div>
    </div>
  );
}
