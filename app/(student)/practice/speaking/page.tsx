import { StudentShell } from "@/components/dashboard/student-shell";
import { SpeakingRecorder } from "@/components/practice/speaking-recorder";

export default function SpeakingPracticePage() {
  return (
    <StudentShell
      title="AI Speaking Lab"
      subtitle="Record your voice, receive instant feedback, and improve with focused repetition."
    >
      <SpeakingRecorder />
    </StudentShell>
  );
}
