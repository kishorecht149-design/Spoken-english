import { StudentShell } from "@/components/dashboard/student-shell";
import { SpeakingRecorder } from "@/components/practice/speaking-recorder";

export default async function SpeakingPracticePage({
  searchParams
}: {
  searchParams: Promise<{ prompt?: string; title?: string; level?: string }>;
}) {
  const params = await searchParams;

  return (
    <StudentShell
      title="AI Speaking Lab"
      subtitle="Record your voice, receive instant feedback, and improve with focused repetition."
    >
      <SpeakingRecorder initialPrompt={params.prompt} initialTitle={params.title} initialLevel={params.level} />
    </StudentShell>
  );
}
