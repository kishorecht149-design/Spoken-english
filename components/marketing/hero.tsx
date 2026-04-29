"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CalendarCheck, Mic2, PlayCircle, Sparkles, Star, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const proofPoints = [
  { value: "12 min", label: "daily speaking plan" },
  { value: "4-way", label: "fluency scoring" },
  { value: "A1-C1", label: "level pathways" }
];

const coachNotes = [
  "Slow down at clause endings",
  "Replace filler words with pauses",
  "Practice /th/ in 5 target phrases"
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-[linear-gradient(135deg,#f8fbff_0%,#eef7f3_45%,#fff7e7_100%)] px-6 py-16 dark:bg-[linear-gradient(135deg,#08111f_0%,#0d1b19_45%,#22180a_100%)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="mx-auto grid min-h-[calc(100vh-120px)] max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary shadow-sm backdrop-blur dark:bg-white/5">
            <Sparkles className="h-4 w-4" />
            AI speaking coach for real life
          </div>
          <h1 className="max-w-4xl font-display text-5xl font-bold leading-[0.95] text-foreground md:text-7xl">
            Verbalyx builds confident speakers, not lesson collectors.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Daily speaking missions, role-play conversations, pronunciation scoring, and admin visibility for learners who need English at school, work, and interviews.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup">
              <Button className="gap-2 px-7">
                Start speaking
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/practice/speaking">
              <Button variant="secondary" className="gap-2 px-7">
                <PlayCircle className="h-4 w-4" />
                Try speaking lab
              </Button>
            </Link>
          </div>
          <div className="mt-10 grid max-w-xl grid-cols-3 overflow-hidden rounded-2xl border border-border bg-white/70 shadow-sm backdrop-blur dark:bg-white/5">
            {proofPoints.map((item) => (
              <div key={item.label} className="border-r border-border px-4 py-4 last:border-r-0">
                <p className="font-display text-2xl font-bold">{item.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.12, duration: 0.6 }}
          className="relative"
        >
          <div className="rounded-[2rem] border border-slate-900/10 bg-slate-950 p-3 shadow-[0_30px_90px_-35px_rgba(15,23,42,0.75)]">
            <div className="rounded-[1.45rem] bg-[#f8faf8] p-4 text-slate-950">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Today</p>
                  <h2 className="font-display text-3xl font-bold">Interview Warm-up</h2>
                </div>
                <div className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">B1 path</div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-[1fr_0.85fr]">
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-sky-100 text-sky-700">
                      <Mic2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">Prompt</p>
                      <p className="text-sm text-slate-500">Tell me about a challenge you solved.</p>
                    </div>
                  </div>
                  <div className="mt-5 rounded-2xl bg-slate-950 p-4 text-slate-100">
                    <p className="text-sm leading-7">
                      “Last semester I led a small group project. We had a deadline issue, so I divided the work and checked progress daily.”
                    </p>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[78%] rounded-full bg-amber-300" />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">Coach score</p>
                    <Star className="h-5 w-5 fill-amber-300 text-amber-400" />
                  </div>
                  <p className="mt-4 font-display text-5xl font-bold">86</p>
                  <p className="mt-1 text-sm text-slate-500">Clear and confident</p>
                  <div className="mt-5 space-y-3">
                    {[
                      ["Fluency", "82%"],
                      ["Grammar", "91%"],
                      ["Pronunciation", "84%"]
                    ].map(([label, value]) => (
                      <div key={label}>
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>{label}</span>
                          <span>{value}</span>
                        </div>
                        <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-sky-500" style={{ width: value }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {[
                  { icon: Target, title: "Next drill", text: "Answer in 45 seconds" },
                  { icon: TrendingUp, title: "Upgrade", text: "Use stronger verbs" },
                  { icon: CalendarCheck, title: "Streak", text: "6 days active" }
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <item.icon className="h-4 w-4 text-sky-600" />
                    <p className="mt-3 text-sm font-semibold">{item.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 -left-5 hidden w-72 rounded-2xl border border-border bg-white p-4 shadow-premium dark:bg-slate-950 lg:block">
            <p className="text-sm font-semibold">Coach noticed</p>
            <div className="mt-3 space-y-2">
              {coachNotes.map((note) => (
                <p key={note} className="rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">
                  {note}
                </p>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
