import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const courses = await prisma.course
    .findMany({ where: { published: true } })
    .catch(() => []);

  return [
    { url: `${baseUrl}/`, priority: 1 },
    { url: `${baseUrl}/login`, priority: 0.6 },
    { url: `${baseUrl}/signup`, priority: 0.7 },
    ...courses.map((course) => ({
      url: `${baseUrl}/courses/${course.slug}`,
      priority: 0.8
    }))
  ];
}
