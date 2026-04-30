"use client";

import { useState, startTransition } from "react";
import { Award, Loader2, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CertificateAction({
  courseId,
  existingCertificateId,
  unlocked
}: {
  courseId: string;
  existingCertificateId?: string;
  unlocked: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [certificateId, setCertificateId] = useState(existingCertificateId || "");
  const [message, setMessage] = useState("");

  const issueCertificate = () => {
    startTransition(async () => {
      setBusy(true);
      setMessage("");

      const response = await fetch("/api/certificates/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId })
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setMessage(data?.error || "Complete all lessons to unlock the certificate.");
        setBusy(false);
        return;
      }

      setCertificateId(data.id);
      setMessage("Certificate ready.");
      setBusy(false);
    });
  };

  if (certificateId) {
    return (
      <a href={`/api/certificates/${certificateId}`} className="inline-flex">
        <Button className="gap-2">
          <Award className="h-4 w-4" />
          Download certificate
        </Button>
      </a>
    );
  }

  return (
    <div>
      <Button onClick={issueCertificate} disabled={!unlocked || busy} className="gap-2">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : unlocked ? <Award className="h-4 w-4" /> : <LockKeyhole className="h-4 w-4" />}
        {unlocked ? "Generate certificate" : "Certificate locked"}
      </Button>
      {message ? <p className="mt-2 text-sm text-primary">{message}</p> : null}
    </div>
  );
}
