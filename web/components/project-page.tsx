import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Github } from "lucide-react";
import { TopToolbar } from "@/components/top-toolbar";
import { MiniFooter } from "@/components/mini-footer";
import { InlineHighlight } from "@/components/inline-highlight";
import { CodeBlock } from "@/components/code-block";
import type { Project } from "@/lib/projects";

interface Props {
  project: Project;
  prev?: Project;
  next?: Project;
}

export function ProjectPage({ project, prev, next }: Props) {
  // Split title into "before / highlight / after" for the InlineHighlight effect
  const idx = project.title.indexOf(project.highlightWord);
  const before = idx >= 0 ? project.title.slice(0, idx) : project.title + " ";
  const after =
    idx >= 0 ? project.title.slice(idx + project.highlightWord.length) : "";

  return (
    <>
      <TopToolbar />

      <main className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto w-full max-w-4xl px-6 py-10 md:px-10 md:py-14">
          {/* Top nav: prev / all projects / next */}
          <nav
            aria-label="Project navigation"
            className="mb-12 flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.2em]"
          >
            {prev ? (
              <Link
                href={`/projects/${prev.slug}`}
                className="group flex items-center gap-2 text-zinc-400 transition hover:text-zinc-100"
              >
                <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
                <span className="hidden sm:inline">{prev.title}</span>
                <span className="sm:hidden">Prev</span>
              </Link>
            ) : (
              <span />
            )}

            <Link
              href="/#projects"
              className="text-zinc-400 transition hover:text-zinc-100"
            >
              All projects
            </Link>

            {next ? (
              <Link
                href={`/projects/${next.slug}`}
                className="group flex items-center gap-2 text-zinc-400 transition hover:text-zinc-100"
              >
                <span className="hidden sm:inline">{next.title}</span>
                <span className="sm:hidden">Next</span>
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
            ) : (
              <span />
            )}
          </nav>

          {/* Hero */}
          <header className="mb-16">
            <p
              className="text-xs font-bold uppercase tracking-[0.2em]"
              style={{ color: project.accent }}
            >
              Project
            </p>
            <h1 className="mt-4 text-[clamp(2.5rem,7vw,5rem)] font-bold uppercase leading-[0.95] tracking-tight">
              <InlineHighlight
                before={before}
                highlight={project.highlightWord}
                after={after}
                baseColor="#fafafa"
                highlightColor={project.accent}
                duration={1.6}
                delay={0.25}
                fontWeight={700}
              />
            </h1>
            <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-zinc-400 md:text-xl">
              {project.subtitle}
            </p>

            <div className="mt-6 flex flex-wrap gap-1.5">
              {project.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-zinc-300"
                >
                  {t}
                </span>
              ))}
            </div>

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-8 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5"
                style={{
                  backgroundColor: project.accent,
                  color: "#0a0a0a",
                  borderColor: project.accent,
                  boxShadow: `0 4px 24px ${project.accent}33`,
                }}
              >
                <Github className="h-4 w-4" />
                View on GitHub
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            )}
          </header>

          {/* Context */}
          <NarrativeSection
            label="Context"
            color={project.accent}
            body={project.story.context}
          />

          {/* Challenge */}
          <NarrativeSection
            label="The challenge"
            color={project.accent}
            body={project.story.challenge}
          />

          {/* Approach */}
          <NarrativeSection
            label="Approach"
            color={project.accent}
            body={project.story.approach}
            details={project.story.approachDetails}
          />

          {/* Architecture / workflow */}
          <section aria-labelledby="architecture" className="mb-20">
            <h2
              id="architecture"
              className="mb-3 text-xs font-bold uppercase tracking-[0.2em]"
              style={{ color: project.accent }}
            >
              Architecture
            </h2>
            <p className="mb-6 max-w-[65ch] text-base leading-relaxed text-zinc-300">
              {project.story.architectureLead}
            </p>

            {project.diagramImage ? (
              <figure className="mb-8 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60">
                <figcaption className="border-b border-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Workflow diagram
                </figcaption>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.diagramImage}
                  alt={`${project.title} workflow diagram`}
                  className="h-auto w-full object-contain"
                />
              </figure>
            ) : project.workflowAscii ? (
              <figure className="mb-8 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60">
                <figcaption className="border-b border-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Workflow diagram
                </figcaption>
                <pre className="overflow-x-auto px-4 py-5 font-mono text-[12px] leading-[1.5] text-zinc-200">
                  <code>{project.workflowAscii}</code>
                </pre>
              </figure>
            ) : null}

            <ol className="space-y-4">
              {project.workflowSteps.map((step, i) => (
                <li
                  key={step.label}
                  className="flex gap-5 rounded-2xl border border-white/10 bg-white/[0.02] p-5"
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-sm font-bold"
                    style={{
                      backgroundColor: `${project.accent}22`,
                      color: project.accent,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <p className="text-base font-bold text-zinc-100">
                      {step.label}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                      {step.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Engineering decisions (technical literature) */}
          {project.engineeringNotes && project.engineeringNotes.length > 0 && (
            <section aria-labelledby="decisions" className="mb-20">
              <h2
                id="decisions"
                className="mb-8 text-xs font-bold uppercase tracking-[0.2em]"
                style={{ color: project.accent }}
              >
                Engineering decisions
              </h2>
              <div className="space-y-6">
                {project.engineeringNotes.map((n) => (
                  <article
                    key={n.title}
                    className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
                  >
                    <h3 className="text-base font-bold text-zinc-100">
                      {n.title}
                    </h3>
                    <p className="mt-2 leading-relaxed text-zinc-300">
                      {n.body}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Code */}
          {project.codeSnippets && project.codeSnippets.length > 0 && (
            <section aria-labelledby="code" className="mb-20">
              <h2
                id="code"
                className="mb-8 text-xs font-bold uppercase tracking-[0.2em]"
                style={{ color: project.accent }}
              >
                Code highlights
              </h2>
              <div className="space-y-6">
                {project.codeSnippets.map((s) => (
                  <CodeBlock
                    key={s.title}
                    title={s.title}
                    language={s.language}
                    code={s.code}
                    note={s.note}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Impact */}
          <NarrativeSection
            label="Impact"
            color={project.accent}
            body={project.story.impact}
          />

          {/* Bottom nav */}
          <nav
            aria-label="More projects"
            className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-10 sm:flex-row sm:justify-between"
          >
            {prev ? (
              <Link
                href={`/projects/${prev.slug}`}
                className="group flex flex-col rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:bg-white/[0.05]"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  ← Previous
                </span>
                <span className="mt-1 font-semibold text-zinc-100">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span className="hidden sm:block sm:flex-1" />
            )}
            {next ? (
              <Link
                href={`/projects/${next.slug}`}
                className="group flex flex-col rounded-xl border border-white/10 bg-white/[0.02] p-4 text-right transition hover:bg-white/[0.05]"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Next →
                </span>
                <span className="mt-1 font-semibold text-zinc-100">
                  {next.title}
                </span>
              </Link>
            ) : (
              <span className="hidden sm:block sm:flex-1" />
            )}
          </nav>
        </div>
      </main>

      <div className="bg-zinc-950 px-6 pb-10 text-zinc-400 md:px-10">
        <div className="mx-auto max-w-4xl">
          <MiniFooter />
        </div>
      </div>
    </>
  );
}

function NarrativeSection({
  label,
  body,
  color,
  details,
}: {
  label: string;
  body: string;
  color: string;
  details?: string[];
}) {
  return (
    <section className="mb-20">
      <h2
        className="mb-4 text-xs font-bold uppercase tracking-[0.2em]"
        style={{ color }}
      >
        {label}
      </h2>
      <p className="max-w-[65ch] text-base leading-relaxed text-zinc-300 md:text-lg">
        {body}
      </p>
      {details && details.length > 0 && (
        <ul className="mt-6 space-y-3">
          {details.map((d, i) => (
            <li
              key={i}
              className="flex gap-3 text-sm leading-relaxed text-zinc-400"
            >
              <span
                className="mt-2 h-1 w-1 shrink-0 rounded-full"
                style={{ backgroundColor: color }}
                aria-hidden
              />
              <span>{d}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
