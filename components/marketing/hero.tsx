"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mic, Trophy, Bot, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const highlights = [
  { icon: Mic, label: "AI pronunciation coach" },
  { icon: Bot, label: "Realtime tutor conversations" },
  { icon: Trophy, label: "Challenges, streaks, leaderboard" },
  { icon: GraduationCap, label: "Certificates and progress reports" }
];

export function Hero() {
  return (
    <section className="bg-hero-grid px-6 pb-24 pt-16">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-5 inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Speak Better Every Day
          </div>
          <h1 className="max-w-3xl font-display text-5xl font-bold leading-tight md:text-7xl">
            The premium platform for fluent, confident spoken English.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Guided learning paths, AI speaking evaluation, live conversation practice, and admin-ready analytics in one scalable product.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/signup">
              <Button className="px-7">Start Free Trial</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="secondary" className="px-7">View Demo Dashboard</Button>
            </Link>
          </div>
        </motion.div>

        <Card className="grid gap-4 p-5">
          {highlights.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-3xl border border-border bg-background/70 p-5"
            >
              <item.icon className="mb-3 h-5 w-5 text-primary" />
              <p className="text-sm font-medium">{item.label}</p>
            </motion.div>
          ))}
        </Card>
      </div>
    </section>
  );
}
