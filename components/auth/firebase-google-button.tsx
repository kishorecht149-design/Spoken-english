"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { Chrome, Loader2 } from "lucide-react";
import { getFirebaseAuth, getGoogleProvider, isFirebaseClientConfigured } from "@/lib/auth/firebase-client";
import { Button } from "@/components/ui/button";

export function FirebaseGoogleButton({ label }: { label: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isConfigured = isFirebaseClientConfigured();

  const signIn = async () => {
    setError("");

    if (!isConfigured) {
      setError("Firebase is not configured yet. Add Firebase env variables in Vercel.");
      return;
    }

    setIsLoading(true);

    try {
      const credential = await signInWithPopup(getFirebaseAuth(), getGoogleProvider());
      const idToken = await credential.user.getIdToken();
      const response = await fetch("/api/auth/firebase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Google sign-in failed.");
      }

      router.push("/dashboard");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Google sign-in failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button variant="secondary" className="w-full gap-2" onClick={signIn} disabled={isLoading}>
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Chrome className="h-4 w-4" />}
        {label}
      </Button>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </div>
  );
}
