import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { getAdminAnalytics } from "@/lib/services/dashboard";
import { AdminShell } from "@/components/admin/admin-shell";
import { CoursePublisher } from "@/components/admin/course-publisher";
import { Card } from "@/components/ui/card";

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
    prisma.user.findMany({ take: 8, orderBy: { createdAt: "desc" } }),
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

  return (
    <AdminShell>
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
          <h2 className="font-display text-2xl font-bold">Published courses</h2>
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
        <h2 className="font-display text-2xl font-bold">Announcements</h2>
        <div className="mt-5 space-y-3">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="rounded-3xl border border-border p-4">
              <p className="font-semibold">{announcement.title}</p>
              <p className="mt-2 text-sm text-muted-foreground">{announcement.body}</p>
            </div>
          ))}
        </div>
      </Card>
    </AdminShell>
  );
}
