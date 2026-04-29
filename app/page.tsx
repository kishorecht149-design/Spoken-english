import {
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  CalendarDays,
  CheckCircle2,
  Flame,
  GraduationCap,
  MessageSquareText,
  Mic2,
  Shield,
  Sparkles,
  Trophy
} from "lucide-react";
import Link from "next/link";
import { Hero } from "@/components/marketing/hero";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const productPillars = [
  {
    icon: Mic2,
    title: "Pronunciation that feels actionable",
    text: "Learners get fluency, grammar, pronunciation, and overall scores with specific repeat drills."
  },
  {
    icon: MessageSquareText,
    title: "Conversation practice with a purpose",
    text: "Role-play interviews, presentations, travel, college discussions, and client calls instead of empty chatbot prompts."
  },
  {
    icon: CalendarDays,
    title: "Daily mission rhythm",
    text: "A tight practice loop keeps learners moving: warm-up, speak, review, retry, and keep the streak alive."
  },
  {
    icon: BarChart3,
    title: "Admin visibility",
    text: "Operators can see users, activity, course completion, learner progress, and announcements from one panel."
  }
];

const journeys = [
  {
    label: "Beginner",
    title: "Confidence Builder",
    detail: "Introductions, daily routines, common questions, survival vocabulary.",
    outcome: "Speak for 30 seconds without freezing."
  },
  {
    label: "Intermediate",
    title: "Workplace Speaker",
    detail: "Storytelling, meetings, interviews, opinions, and clear explanations.",
    outcome: "Hold a 5-minute guided conversation."
  },
  {
    label: "Advanced",
    title: "Fluency Studio",
    detail: "Debates, presentations, persuasion, nuance, and professional polish.",
    outcome: "Present ideas with structure and control."
  }
];

const workflow = [
  "Choose a real-life scenario",
  "Record or type your answer",
  "Get score and coaching notes",
  "Repeat the weakest sentence",
  "Track streak and progress"
];

const adminFeatures = [
  "Create and publish courses",
  "Review learner progress",
  "Monitor completion rate",
  "Send announcements",
  "Manage users and roles",
  "Export certificates"
];

export default function HomePage() {
  return (
    <div>
      <SiteHeader />
      <Hero />

      <section id="features" className="border-b border-border bg-background px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Built Like A Learning Product</p>
            <h2 className="mt-4 font-display text-4xl font-bold md:text-5xl">
              The core loop is simple: speak, get coached, repeat better.
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Verbalyx takes the strongest patterns from modern language apps: short lessons, daily streaks, AI feedback, realistic speaking rooms, and admin-grade reporting.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {productPillars.map((feature) => (
              <Card key={feature.title} className="rounded-2xl">
                <feature.icon className="h-5 w-5 text-primary" />
                <h3 className="mt-5 font-display text-xl font-bold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{feature.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="courses" className="bg-[linear-gradient(180deg,hsl(var(--background))_0%,hsl(var(--muted))_100%)] px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Course Paths</p>
            <h2 className="mt-4 font-display text-4xl font-bold md:text-5xl">Clear paths for different learner goals.</h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Each level includes grammar, vocabulary, speaking tasks, role-play practice, daily challenges, and completion certificates.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup">
                <Button className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Start your path
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost">Already enrolled</Button>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {journeys.map((track) => (
              <div key={track.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">{track.label}</p>
                    <h3 className="mt-2 font-display text-2xl font-bold">{track.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{track.detail}</p>
                  </div>
                  <div className="rounded-xl bg-primary/10 px-4 py-3 text-sm font-semibold text-primary md:max-w-56">
                    {track.outcome}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <Card className="rounded-2xl">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <h2 className="mt-5 font-display text-4xl font-bold">AI coaching workflow</h2>
            <div className="mt-8 space-y-4">
              {workflow.map((item, index) => (
                <div key={item} className="flex items-center gap-4 rounded-2xl border border-border bg-background/60 p-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
                    {index + 1}
                  </div>
                  <p className="font-medium">{item}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-2xl">
            <Shield className="h-6 w-6 text-primary" />
            <h2 className="mt-5 font-display text-4xl font-bold">Admin-ready operations</h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {adminFeatures.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-border bg-background/60 p-4">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  <p className="text-sm font-medium">{item}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section id="pricing" className="px-6 pb-20">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-border bg-slate-950 p-8 text-white shadow-premium md:p-12">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">Launch Ready</p>
              <h2 className="mt-4 font-display text-4xl font-bold">A product foundation for courses, cohorts, and paid subscriptions.</h2>
              <p className="mt-4 max-w-2xl text-slate-300">
                JWT auth, MongoDB, admin controls, AI routes, certificate generation, referrals, reminders, and payment placeholders are already wired for growth.
              </p>
            </div>
            <div className="grid gap-3 text-sm">
              {[
                { icon: Flame, text: "Streaks and challenges" },
                { icon: Trophy, text: "Leaderboard and rewards" },
                { icon: GraduationCap, text: "Certificates" },
                { icon: BookOpenCheck, text: "Structured lessons" }
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
                  <item.icon className="h-4 w-4 text-amber-300" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
