import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";

export const metadata: Metadata = {
  title: "Verbalyx | Spoken English Learning Platform",
  description:
    "Verbalyx is a production-ready spoken English learning platform with AI speaking practice, student dashboards, and admin analytics.",
  keywords: ["Verbalyx", "spoken English", "English learning", "AI speaking coach", "admin panel"]
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
