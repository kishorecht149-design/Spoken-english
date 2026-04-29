import { requireUser } from "@/lib/auth/guards";
import { getStudentDashboard } from "@/lib/services/dashboard";
import { StudentShell } from "@/components/dashboard/student-shell";
import { Card } from "@/components/ui/card";
import { percentage } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await requireUser();
  const { courses, progress, announcements } = await getStudentDashboard(session.id);

  const completedLessons = progress.filter((item) => item.completed).length;
  const totalLessons = courses.reduce((sum, course) => sum + course.lessons.length, 0);

  return (
    <StudentShell
      title={`Welcome back, ${session.name}`}
      subtitle="Track your progress, stay consistent, and practice speaking every day."
    >
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <p className="text-sm text-muted-foreground">Course Progress</p>
          <p className="mt-3 font-display text-4xl font-bold">{percentage(completedLessons, totalLessons)}%</p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Completed Lessons</p>
          <p className="mt-3 font-display text-4xl font-bold">{completedLessons}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Current Streak</p>
          <p className="mt-3 font-display text-4xl font-bold">6 days</p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">XP Points</p>
          <p className="mt-3 font-display text-4xl font-bold">820</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <h2 className="font-display text-2xl font-bold">Your Learning Path</h2>
          <div className="mt-5 space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="rounded-3xl border border-border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{course.title}</p>
                    <p className="text-sm text-muted-foreground">{course.level} level</p>
                  </div>
                  <p className="text-sm text-primary">{course.lessons.length} lessons</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-2xl font-bold">Announcements</h2>
          <div className="mt-5 space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="rounded-3xl border border-border p-4">
                <p className="font-semibold">{announcement.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{announcement.body}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </StudentShell>
  );
}
