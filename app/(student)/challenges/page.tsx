import { Flame, Gift, Target } from "lucide-react";
import { StudentShell } from "@/components/dashboard/student-shell";
import { Card } from "@/components/ui/card";

const challenges = [
  { icon: Flame, title: "7-Day Streak Sprint", points: 120 },
  { icon: Target, title: "Complete 3 speaking drills", points: 80 },
  { icon: Gift, title: "Invite a friend with your referral code", points: 150 }
];

export default function ChallengesPage() {
  return (
    <StudentShell title="Daily Challenges" subtitle="Small wins that keep momentum high and learning sticky.">
      <div className="grid gap-6 md:grid-cols-3">
        {challenges.map((challenge) => (
          <Card key={challenge.title}>
            <challenge.icon className="h-6 w-6 text-primary" />
            <h2 className="mt-5 font-display text-xl font-bold">{challenge.title}</h2>
            <p className="mt-3 text-sm text-muted-foreground">Earn {challenge.points} XP when completed today.</p>
          </Card>
        ))}
      </div>
    </StudentShell>
  );
}
