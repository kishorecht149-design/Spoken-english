"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import { signOut } from "firebase/auth";
import { getFirebaseAuth, isFirebaseClientConfigured } from "@/lib/auth/firebase-client";
import { Button } from "@/components/ui/button";

export function SignOutButton({
  redirectTo = "/login",
  variant = "ghost",
  className = ""
}: {
  redirectTo?: string;
  variant?: "ghost" | "secondary";
  className?: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const logout = async () => {
    setIsLoading(true);

    try {
      if (isFirebaseClientConfigured()) {
        await signOut(getFirebaseAuth()).catch(() => null);
      }

      await fetch("/api/auth/logout", { method: "POST" });
      router.push(redirectTo);
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant={variant} className={`gap-2 ${className}`} onClick={logout} disabled={isLoading}>
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
      Sign out
    </Button>
  );
}
