import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProjectPage } from "@/components/project-page";
import {
  projects,
  getProjectBySlug,
  getProjectNeighbors,
} from "@/lib/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project not found — Nikhil Singh" };
  return {
    title: `${project.title} — Nikhil Singh`,
    description: project.subtitle,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const { prev, next } = getProjectNeighbors(slug);
  return <ProjectPage project={project} prev={prev} next={next} />;
}
