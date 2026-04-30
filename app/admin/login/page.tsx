"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role: "ADMIN" })
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error || "Invalid admin credentials.");
      return;
    }

    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_440px]">
        <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(251,191,36,0.22),transparent_28%),radial-gradient(circle_at_80%_30%,rgba(14,165,233,0.18),transparent_34%),linear-gradient(135deg,rgba(15,23,42,1),rgba(2,6,23,1))] p-8 shadow-2xl lg:p-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-300">
            <ShieldCheck className="h-4 w-4" />
            Verbalyx Operations
          </div>
          <h1 className="mt-8 max-w-2xl font-display text-5xl font-bold leading-tight">
            Separate secure access for the admin team.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300">
            Manage learners, courses, video lessons, announcements, and performance analytics from a portal that is intentionally separate from learner login.
          </p>
        </section>

        <Card className="rounded-[2rem] border-white/10 bg-white text-slate-950">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Admin Login</p>
            <h2 className="mt-2 font-display text-3xl font-bold">Control center</h2>
            <p className="mt-2 text-sm text-muted-foreground">Only admin accounts can enter this panel.</p>
          </div>
          <div className="mt-6 space-y-4">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-11" placeholder="Admin email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-11"
                placeholder="Admin password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            {error ? <p className="text-sm text-red-500">{error}</p> : null}
            <Button className="w-full" onClick={submit}>
              Login to admin panel
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Learner account?{" "}
              <Link href="/login" className="font-semibold text-primary">
                Open learner login
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
