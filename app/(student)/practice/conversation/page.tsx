import { StudentShell } from "@/components/dashboard/student-shell";
import { ConversationPanel } from "@/components/practice/conversation-panel";

export default function ConversationPracticePage() {
  return (
    <StudentShell
      title="Conversation Practice"
      subtitle="Have realistic back-and-forth conversations with the AI tutor in realtime."
    >
      <ConversationPanel />
    </StudentShell>
  );
}
