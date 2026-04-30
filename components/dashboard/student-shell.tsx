import type { ReactNode } from "react";
import Link from "next/link";
import { Bell, BookOpen, Home, Mic, Trophy } from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/practice/speaking", label: "Speaking", icon: Mic },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy }
];

export function StudentShell({
  children,
  title,
  subtitle
}: {
  children: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="min-h-screen px-6 py-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="glass rounded-[32px] p-6">
          <Link href="/" className="font-display text-2xl font-bold">
            Verbalyx
          </Link>
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
          <div className="mt-8 border-t border-border pt-4">
            <SignOutButton className="w-full justify-start rounded-2xl px-4 py-3 text-sm text-muted-foreground hover:bg-primary/10 hover:text-foreground" />
            <p className="mt-3 px-4 text-xs leading-5 text-muted-foreground">
              Sign out first if you want to continue with another Google account.
            </p>
          </div>
        </aside>
        <main className="space-y-6">
          <header className="glass flex items-center justify-between rounded-[32px] p-6">
            <div>
              <h1 className="font-display text-3xl font-bold">{title}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-full border border-border p-3">
                <Bell className="h-4 w-4" />
              </button>
              <ThemeToggle />
            </div>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
