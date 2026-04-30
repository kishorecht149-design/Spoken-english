"use client";

import { useRef, useState } from "react";
import { CheckCircle2, Lightbulb, Mic, RotateCcw, Sparkles, Square, Timer, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognition;
    SpeechRecognition?: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
    length: number;
  };
}

const scenarios = [
  {
    id: "interview",
    title: "Interview introduction",
    level: "B1",
    seconds: 60,
    prompt: "Introduce yourself and describe one challenge you solved recently.",
    checklist: ["Open with your name and role", "Use one past-tense story", "End with what you learned"]
  },
  {
    id: "presentation",
    title: "Presentation opening",
    level: "B2",
    seconds: 45,
    prompt: "Open a short presentation about a product, project, or idea you care about.",
    checklist: ["Hook the listener", "State the topic clearly", "Preview two points"]
  },
  {
    id: "daily",
    title: "Daily conversation",
    level: "A2",
    seconds: 45,
    prompt: "Describe your daily routine and mention one habit you want to improve.",
    checklist: ["Use time expressions", "Speak in full sentences", "Add one reason"]
  }
];

export function SpeakingRecorder({
  initialPrompt,
  initialTitle,
  initialLevel
}: {
  initialPrompt?: string;
  initialTitle?: string;
  initialLevel?: string;
}) {
  const customScenario = initialPrompt
    ? {
        id: "lesson",
        title: initialTitle || "Lesson speaking task",
        level: initialLevel || "Lesson",
        seconds: 60,
        prompt: initialPrompt,
        checklist: ["Answer in complete sentences", "Add one reason", "Add one real-life example"]
      }
    : null;
  const availableScenarios = customScenario ? [customScenario, ...scenarios] : scenarios;
  const [selectedId, setSelectedId] = useState(availableScenarios[0].id);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, number> | null>(null);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const scenario = availableScenarios.find((item) => item.id === selectedId) || availableScenarios[0];

  const startRecording = () => {
    setError("");
    setFeedback(null);
    setScores(null);

    const SpeechRecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionApi) {
      setError("Speech recognition is not available in this browser. Type your answer below and analyze it.");
      return;
    }

    const recognition = new SpeechRecognitionApi();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let next = "";
      for (let i = 0; i < event.results.length; i += 1) {
        next += event.results[i][0].transcript;
      }
      setTranscript(next.trim());
    };

    recognition.onend = () => {
      setRecording(false);
      recognitionRef.current = null;
    };

    recognition.start();
    setRecording(true);

    window.setTimeout(() => {
      recognition.stop();
    }, scenario.seconds * 1000);
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setRecording(false);
  };

  const reset = () => {
    setTranscript("");
    setFeedback(null);
    setScores(null);
    setError("");
  };

  const analyze = async () => {
    if (!transcript.trim()) return;

    setError("");
    const response = await fetch("/api/ai/speaking-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transcript,
        targetPrompt: scenario.prompt
      })
    });

    if (!response.ok) {
      setError("Could not analyze this attempt. Try again in a moment.");
      return;
    }

    const data = await response.json();
    setFeedback(data.feedback);
    setScores({
      fluency: data.fluencyScore,
      grammar: data.grammarScore,
      pronunciation: data.pronunciationScore,
      overall: data.overallScore
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <Card className="rounded-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Speaking Lab</p>
            <h2 className="mt-2 font-display text-3xl font-bold">Choose a real-life mission</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Practice the kind of English you will use in interviews, classrooms, meetings, and daily conversations.
            </p>
          </div>
          <div className="hidden rounded-2xl bg-primary/10 px-4 py-3 text-sm font-semibold text-primary sm:block">
            {scenario.level}
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          {availableScenarios.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedId(item.id);
                reset();
              }}
              className={`rounded-2xl border p-4 text-left transition ${
                selectedId === item.id
                  ? "border-primary bg-primary/10"
                  : "border-border bg-background/60 hover:border-primary/40"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <p className="font-semibold">{item.title}</p>
                <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">{item.seconds}s</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.prompt}</p>
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-background/60 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Lightbulb className="h-4 w-4 text-secondary" />
            Score checklist
          </div>
          <div className="mt-4 space-y-3">
            {scenario.checklist.map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="rounded-2xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold">{scenario.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{scenario.prompt}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={recording ? stopRecording : startRecording} className="gap-2">
              {recording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              {recording ? "Stop" : "Record"}
            </Button>
            <Button variant="ghost" onClick={reset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2 rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm text-muted-foreground">
          <Timer className="h-4 w-4 text-primary" />
          Aim for {scenario.seconds} seconds. Short, clear sentences score better than rushed long answers.
        </div>

        <Textarea
          className="mt-5 min-h-44 rounded-2xl"
          value={transcript}
          onChange={(event) => setTranscript(event.target.value)}
          placeholder="Your transcript will appear here. You can also type your answer manually, then analyze it."
        />

        {error ? <p className="mt-3 rounded-2xl bg-red-500/10 p-3 text-sm text-red-500">{error}</p> : null}

        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="secondary" onClick={analyze} disabled={!transcript.trim()} className="gap-2">
            <Sparkles className="h-4 w-4" />
            Analyze My Speaking
          </Button>
          <Button
            variant="ghost"
            onClick={() => setTranscript(`${transcript}${transcript ? " " : ""}My strongest point is that I can explain ideas clearly with examples.`)}
            className="gap-2"
          >
            <Wand2 className="h-4 w-4" />
            Add sample sentence
          </Button>
        </div>

        {scores && (
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {Object.entries(scores).map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-border bg-background/60 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
                <p className="mt-2 font-display text-3xl font-bold">{value}</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {feedback && (
          <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/10 p-5 text-sm leading-7 text-primary">
            {feedback}
          </div>
        )}
      </Card>
    </div>
  );
}
