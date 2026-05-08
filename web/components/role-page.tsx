import Link from "next/link";
import { TopToolbar } from "@/components/top-toolbar";
import { MiniFooter } from "@/components/mini-footer";

export interface Bullet {
  id?: string;
  title: string;
  body: string;
}

export interface SkillGroup {
  title: string;
  tags: string[];
}

export interface RolePageProps {
  company: string;
  logo?: string;
  logoAlt?: string;
  role: string;
  dates: string;
  location: string;
  accent: string;
  bg: string;
  fg: string;
  bullets: Bullet[];
  skills: SkillGroup[];
  prevHref?: string;
  prevLabel?: string;
  nextHref?: string;
  nextLabel?: string;
}

export function RolePage({
  company,
  logo,
  logoAlt,
  role,
  dates,
  location,
  accent,
  bg,
  fg,
  bullets,
  skills,
  prevHref,
  prevLabel,
  nextHref,
  nextLabel,
}: RolePageProps) {
  return (
    <>
      <TopToolbar />

      <main
        style={{ backgroundColor: bg, color: fg }}
        className="min-h-screen w-full"
      >
        <div className="mx-auto w-full max-w-5xl px-[6vw] py-[clamp(3rem,8vw,6rem)]">
          {/* Back link */}
          <div className="mb-12 flex items-center gap-4 text-sm font-semibold uppercase tracking-[0.2em]">
            <Link
              href="/"
              className="opacity-70 transition hover:opacity-100"
              style={{ color: fg }}
            >
              ← Home
            </Link>
          </div>

          {/* Header */}
          <header className="mb-16">
            <p
              className="text-xs font-bold uppercase tracking-[0.2em]"
              style={{ color: accent }}
            >
              Experience
            </p>
            {logo && (
              <div className="mt-6 flex h-12 items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo}
                  alt={logoAlt ?? company}
                  className="h-10 w-auto object-contain"
                />
              </div>
            )}
            <h1 className="mt-4 text-[clamp(2.5rem,8vw,7rem)] font-bold uppercase leading-[0.9] tracking-tight">
              {company}
            </h1>
            <p className="mt-4 text-[clamp(1rem,2vw,1.5rem)] font-medium opacity-80">
              {role}
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm uppercase tracking-wider opacity-60">
              <span>{dates}</span>
              <span aria-hidden>·</span>
              <span>{location}</span>
            </div>
          </header>

          <hr
            className="my-12 border-none border-t"
            style={{ borderTopColor: `${accent}66` }}
          />

          {/* Bullets */}
          <section className="space-y-10">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">
              Key contributions
            </h2>
            <ul className="space-y-10">
              {bullets.map((b, i) => (
                <li
                  key={b.id ?? `${i}-${b.title}`}
                  id={b.id}
                  className="border-l-2 pl-6 transition hover:opacity-100"
                  style={{ borderLeftColor: accent }}
                >
                  <h3 className="text-xl font-bold leading-snug md:text-2xl">
                    {b.title}
                  </h3>
                  <p className="mt-3 max-w-[70ch] text-base leading-relaxed opacity-80 md:text-lg">
                    {b.body}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <hr
            className="my-16 border-none border-t"
            style={{ borderTopColor: `${accent}66` }}
          />

          {/* Skills */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">
              Technologies & skills
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {skills.map((g) => (
                <div key={g.title}>
                  <h3 className="text-base font-bold">{g.title}</h3>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {g.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full px-3 py-1 text-xs font-medium"
                        style={{
                          backgroundColor: `${accent}22`,
                          color: fg,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Prev / Next */}
          {(prevHref || nextHref) && (
            <nav className="mt-20 flex items-center justify-between gap-4 text-sm font-semibold uppercase tracking-[0.2em]">
              {prevHref ? (
                <Link
                  href={prevHref}
                  className="opacity-70 transition hover:opacity-100"
                >
                  ← {prevLabel}
                </Link>
              ) : (
                <span />
              )}
              {nextHref ? (
                <Link
                  href={nextHref}
                  className="opacity-70 transition hover:opacity-100"
                >
                  {nextLabel} →
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </div>
      </main>

      <div className="bg-zinc-950 px-6 pb-10 text-zinc-400 md:px-10">
        <div className="mx-auto max-w-5xl">
          <MiniFooter />
        </div>
      </div>
    </>
  );
}
