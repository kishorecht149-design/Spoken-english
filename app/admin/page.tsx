import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { getAdminAnalytics } from "@/lib/services/dashboard";
import { AdminShell } from "@/components/admin/admin-shell";
import { CoursePublisher } from "@/components/admin/course-publisher";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, Megaphone, RadioTower, Route, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  await requireAdmin();
  const { tab } = await searchParams;
  const analytics = await getAdminAnalytics();
  const [users, courses, announcements] = await Promise.all([
    prisma.user.findMany({ take: 8, include: { progress: true, certificates: true }, orderBy: { createdAt: "desc" } }),
    prisma.course.findMany({ include: { lessons: true }, orderBy: { createdAt: "desc" } }),
    prisma.announcement.findMany({ take: 5, orderBy: { createdAt: "desc" } })
  ]);

  if (tab === "courses") {
    return (
      <AdminShell>
        <CoursePublisher initialCourses={courses} />
      </AdminShell>
    );
  }

  if (tab === "users") {
    return (
      <AdminShell>
        <Card className="rounded-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Learners</p>
          <h1 className="mt-2 font-display text-3xl font-bold">Student progress and accounts</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Use this area to review learner accounts, activity, points, streaks, certificates, and course progress.
          </p>
        </Card>
        <div className="grid gap-4">
          {users.map((user) => {
            const completed = user.progress.filter((item) => item.completed).length;

            return (
              <Card key={user.id} className="rounded-2xl">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="grid gap-3 text-sm sm:grid-cols-4">
                    <span className="rounded-full bg-muted px-3 py-1">{user.role}</span>
                    <span className="rounded-full bg-muted px-3 py-1">{completed} lessons</span>
                    <span className="rounded-full bg-muted px-3 py-1">{user.streakCount} day streak</span>
                    <span className="rounded-full bg-muted px-3 py-1">{user.certificates.length} certificates</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </AdminShell>
    );
  }

  if (tab === "announcements") {
    return (
      <AdminShell>
        <Card className="rounded-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Announcements</p>
          <h1 className="mt-2 font-display text-3xl font-bold">Learner notifications</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Publish reminders, challenge updates, course releases, and certificate announcements from here.
          </p>
        </Card>
        <div className="grid gap-4">
          {announcements.length ? (
            announcements.map((announcement) => (
              <Card key={announcement.id} className="rounded-2xl">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold">{announcement.title}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{announcement.body}</p>
                  </div>
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                    {announcement.published ? "Published" : "Draft"}
                  </span>
                </div>
              </Card>
            ))
          ) : (
            <Card className="rounded-2xl border-dashed">
              <p className="text-sm text-muted-foreground">No announcements yet.</p>
            </Card>
          )}
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <Card className="rounded-2xl bg-[radial-gradient(circle_at_top_left,rgba(245,194,66,0.18),transparent_34%),linear-gradient(135deg,#07111f,#122132)] text-white">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">Verbalyx Operating System</p>
            <h1 className="mt-3 font-display text-4xl font-bold">Admin controls content. Learner app controls learning.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              Recommended flow: publish courses, review learners, send announcements, then open the learner app to verify the student journey.
            </p>
          </div>
          <Link href="/admin?tab=courses">
            <Button className="gap-2 bg-white text-slate-950 hover:bg-slate-100">
              Open course builder
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-4">
        {[
          { icon: BookOpenCheck, title: "1. Build courses", text: "Publish levels, lessons, video links, and speaking tasks.", href: "/admin?tab=courses" },
          { icon: Route, title: "2. Verify journey", text: "Open learner catalog and test lesson flow.", href: "/courses" },
          { icon: Users, title: "3. Track learners", text: "Review completion, streaks, and certificates.", href: "/admin?tab=users" },
          { icon: Megaphone, title: "4. Notify users", text: "Send reminders and challenge updates.", href: "/admin?tab=announcements" }
        ].map((item) => (
          <Link key={item.title} href={item.href}>
            <Card className="h-full rounded-2xl transition hover:border-primary/40 hover:bg-primary/5">
              <item.icon className="h-5 w-5 text-primary" />
              <h2 className="mt-4 font-display text-xl font-bold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <p className="text-sm text-muted-foreground">Total Users</p>
          <p className="mt-3 font-display text-4xl font-bold">{analytics.totalUsers}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Active Users</p>
          <p className="mt-3 font-display text-4xl font-bold">{analytics.activeUsers}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Courses</p>
          <p className="mt-3 font-display text-4xl font-bold">{analytics.totalCourses}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Completion Rate</p>
          <p className="mt-3 font-display text-4xl font-bold">{analytics.completionRate}%</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-display text-2xl font-bold">Recent learners</h2>
          <div className="mt-5 space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between rounded-3xl border border-border p-4">
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <p className="text-sm text-primary">{user.role}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-2xl font-bold">Course publishing health</h2>
          <div className="mt-5 space-y-3">
            {courses.map((course) => (
              <div key={course.id} className="rounded-3xl border border-border p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{course.title}</p>
                  <p className="text-sm text-muted-foreground">{course.lessons.length} lessons</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{course.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">Realtime operations checklist</h2>
            <p className="mt-2 text-sm text-muted-foreground">Use this before every launch or course update.</p>
          </div>
          <RadioTower className="h-6 w-6 text-primary" />
        </div>
        <div className="mt-5 space-y-3">
          {[
            "Course is published and visible in learner catalog.",
            "Every lesson opens in the focused lesson player.",
            "Speaking and role-play buttons carry the right lesson prompt.",
            "Completion updates progress and certificate unlocks at 100%."
          ].map((item) => (
            <div key={item} className="rounded-3xl border border-border p-4 text-sm text-muted-foreground">
              {item}
            </div>
          ))}
        </div>
      </Card>
    </AdminShell>
  );
}
