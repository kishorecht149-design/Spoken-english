import type { ReactNode } from "react";
import Link from "next/link";
import { BarChart3, BookCopy, Megaphone, ShieldCheck, Users } from "lucide-react";

const links = [
  { href: "/admin", label: "Overview", icon: BarChart3 },
  { href: "/admin?tab=users", label: "Users", icon: Users },
  { href: "/admin?tab=courses", label: "Courses", icon: BookCopy },
  { href: "/admin?tab=announcements", label: "Announcements", icon: Megaphone }
];

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen px-6 py-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="glass rounded-[32px] p-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <div>
              <p className="font-display text-xl font-bold">Admin Panel</p>
              <p className="text-xs text-muted-foreground">Platform operations</p>
            </div>
          </div>
          <nav className="mt-8 space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-muted-foreground transition hover:bg-primary/10 hover:text-foreground"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
}
