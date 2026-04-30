"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Chrome, LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role: "STUDENT" })
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error || "Invalid learner credentials.");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(19,132,173,0.16),_transparent_34%),linear-gradient(135deg,_#f8fbff,_#eef7f3)] px-6">
      <Card className="w-full max-w-md space-y-5 rounded-[2rem]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Learner Login</p>
          <h1 className="mt-2 font-display text-3xl font-bold">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to continue your spoken English journey.</p>
        </div>
        <a href="/api/auth/google/start">
          <Button variant="secondary" className="w-full gap-2">
            <Chrome className="h-4 w-4" />
            Continue with Google
          </Button>
        </a>
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          or email
          <span className="h-px flex-1 bg-border" />
        </div>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-11" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-11" placeholder="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <Button className="w-full" onClick={submit}>Login as learner</Button>
        <p className="text-center text-sm text-muted-foreground">
          Admin?{" "}
          <Link href="/admin/login" className="font-semibold text-primary">
            Open admin login
          </Link>
        </p>
      </Card>
    </div>
  );
}
