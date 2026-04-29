import { Role } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { StudentShell } from "@/components/dashboard/student-shell";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const learners = await prisma.user.findMany({
    where: { role: Role.STUDENT },
    orderBy: [{ totalPoints: "desc" }, { streakCount: "desc" }],
    take: 10
  });

  return (
    <StudentShell title="Leaderboard" subtitle="Celebrate consistent practice and healthy competition.">
      <Card>
        <div className="space-y-4">
          {learners.map((learner, index) => (
            <div key={learner.id} className="flex items-center justify-between rounded-3xl border border-border p-4">
              <div>
                <p className="text-sm text-muted-foreground">#{index + 1}</p>
                <p className="font-semibold">{learner.name}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-2xl font-bold">{learner.totalPoints}</p>
                <p className="text-sm text-muted-foreground">{learner.streakCount}-day streak</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </StudentShell>
  );
}
