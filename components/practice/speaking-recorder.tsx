"use client";

import { useState } from "react";
import { Mic, Square, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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

export function SpeakingRecorder() {
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, number> | null>(null);
  const [recording, setRecording] = useState(false);

  const startRecording = () => {
    const SpeechRecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionApi) return;

    const recognition = new SpeechRecognitionApi();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let next = "";
      for (let i = 0; i < event.results.length; i += 1) {
        next += event.results[i][0].transcript;
      }
      setTranscript(next);
    };

    recognition.start();
    setRecording(true);

    setTimeout(() => {
      recognition.stop();
      setRecording(false);
    }, 12_000);
  };

  const analyze = async () => {
    const response = await fetch("/api/ai/speaking-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transcript,
        targetPrompt: "Introduce yourself and describe your daily routine."
      })
    });

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
    <Card className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Speaking Practice</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Record a response and get AI coaching on clarity, fluency, and grammar.
          </p>
        </div>
        <Button onClick={recording ? undefined : startRecording} disabled={recording}>
          {recording ? <Square className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
          {recording ? "Recording..." : "Start Recording"}
        </Button>
      </div>

      <div className="rounded-[28px] border border-border bg-background/70 p-5 text-sm leading-7">
        {transcript || "Your transcript will appear here once you start speaking."}
      </div>

      <Button variant="secondary" onClick={analyze} disabled={!transcript}>
        <Sparkles className="mr-2 h-4 w-4" />
        Analyze My Speaking
      </Button>

      {scores && (
        <div className="grid gap-4 md:grid-cols-4">
          {Object.entries(scores).map(([label, value]) => (
            <div key={label} className="rounded-3xl border border-border bg-card p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
              <p className="mt-2 font-display text-3xl font-bold">{value}</p>
            </div>
          ))}
        </div>
      )}

      {feedback && <p className="rounded-3xl bg-primary/10 p-4 text-sm text-primary">{feedback}</p>}
    </Card>
  );
}
