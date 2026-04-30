"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FirebaseGoogleButton } from "@/components/auth/firebase-google-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", referralCode: "" });
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      const issueMessage = data?.issues?.[0]?.message;
      setError(issueMessage || data?.error || "Unable to create your account.");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-md space-y-5">
        <div>
          <h1 className="font-display text-3xl font-bold">Start speaking with confidence</h1>
          <p className="mt-2 text-sm text-muted-foreground">Create your learner account in under a minute.</p>
        </div>
        <FirebaseGoogleButton label="Sign up with Google" />
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          or email
          <span className="h-px flex-1 bg-border" />
        </div>
        <Input placeholder="Full name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
        <Input placeholder="Email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
        <Input placeholder="Password" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} />
        <Input placeholder="Referral code (optional)" value={form.referralCode} onChange={(event) => setForm((current) => ({ ...current, referralCode: event.target.value }))} />
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <Button className="w-full" onClick={submit}>Create Account</Button>
        <p className="text-center text-sm text-muted-foreground">
          Already joined?{" "}
          <Link href="/login" className="font-semibold text-primary">
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
}
