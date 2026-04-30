import { StudentShell } from "@/components/dashboard/student-shell";
import { ConversationPanel } from "@/components/practice/conversation-panel";

export default async function ConversationPracticePage({
  searchParams
}: {
  searchParams: Promise<{ topic?: string; prompt?: string; level?: string }>;
}) {
  const params = await searchParams;

  return (
    <StudentShell
      title="Conversation Practice"
      subtitle="Have realistic back-and-forth conversations with the AI tutor in realtime."
    >
      <ConversationPanel
        initialTopic={params.topic}
        initialPrompt={params.prompt}
        initialLevel={params.level}
      />
    </StudentShell>
  );
}
