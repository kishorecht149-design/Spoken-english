import { BarChart3, BrainCircuit, Flame, Shield } from "lucide-react";
import { Hero } from "@/components/marketing/hero";
import { SiteHeader } from "@/components/layout/site-header";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: BrainCircuit,
    title: "AI speech evaluation",
    text: "Measure fluency, grammar, and pronunciation with actionable practice feedback."
  },
  {
    icon: Flame,
    title: "Gamified retention",
    text: "Drive daily consistency through streaks, challenges, referrals, and leaderboard energy."
  },
  {
    icon: BarChart3,
    title: "Operator-grade analytics",
    text: "Track user growth, completion rates, course performance, and active learners in one place."
  },
  {
    icon: Shield,
    title: "Secure by design",
    text: "JWT sessions, route guards, rate limiting, and role-based admin access are built in."
  }
];

const learningTracks = [
  { level: "Beginner", detail: "Daily fundamentals, introductions, pronunciation basics." },
  { level: "Intermediate", detail: "Fluency drills, storytelling, workplace communication." },
  { level: "Advanced", detail: "Debates, interviews, presentations, nuanced expression." }
];

export default function HomePage() {
  return (
    <div>
      <SiteHeader />
      <Hero />
      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 max-w-2xl">
          <h2 className="font-display text-4xl font-bold">Built for serious learning teams and modern learners.</h2>
          <p className="mt-4 text-muted-foreground">
            This platform combines the polish of premium SaaS with the engagement patterns of world-class language apps.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title}>
              <feature.icon className="h-5 w-5 text-primary" />
              <h3 className="mt-5 font-display text-xl font-bold">{feature.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{feature.text}</p>
            </Card>
          ))}
        </div>
      </section>
      <section id="courses" className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-6 md:grid-cols-3">
          {learningTracks.map((track) => (
            <Card key={track.level}>
              <p className="text-sm uppercase tracking-[0.25em] text-primary">{track.level}</p>
              <h3 className="mt-4 font-display text-2xl font-bold">{track.level} path</h3>
              <p className="mt-3 text-sm text-muted-foreground">{track.detail}</p>
            </Card>
          ))}
        </div>
      </section>
      <section id="pricing" className="mx-auto max-w-7xl px-6 py-20">
        <Card className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-primary">Pricing Ready</p>
            <h2 className="mt-3 font-display text-4xl font-bold">Prepared for subscriptions, cohorts, or enterprise licensing.</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Stripe and Razorpay hooks are scaffolded through environment configuration so you can adapt monetization to your market.
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
}
