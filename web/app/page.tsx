import { Github, Linkedin, Instagram, Twitter, Download } from "lucide-react";
import FlowArt, { FlowSection } from "@/components/ui/story-scroll";
import { ContactForm } from "@/components/contact-form";
import { GlassCard } from "@/components/glass-card";
import { TopToolbar } from "@/components/top-toolbar";
import { MiniFooter } from "@/components/mini-footer";
import { ResetScrollOnLoad } from "@/components/reset-scroll-on-load";
import { NameHighlight } from "@/components/name-highlight";
import { ThemedHighlight } from "@/components/themed-highlight";
import { projects as projectData } from "@/lib/projects";

const certs = [
  {
    title: "AWS Certified Developer Associate",
    issuer: "Amazon Web Services",
    id: "ZQJZ42BKRMEE1P9N",
    logo: "/images/aws-developer-associate.png",
    url: "https://www.credly.com/badges/0a1d27d3-8456-418d-8c54-6d2be1d180da/public_url",
  },
  {
    title: "Oracle Cloud Infrastructure Foundations",
    issuer: "Oracle",
    id: "289337060OCIBF2021",
    logo: "/images/oracle-cloud-foundations.png",
    url: "https://pubartifacts-bkt.s3.ap-south-1.amazonaws.com/Oracle+Cloud+Infrastructure+Foundations+2021+Certified+Associate.pdf",
  },
  {
    title: "SQL & Relational Database 101",
    issuer: "IBM Developer Skills Network",
    id: "DB0101EN",
    logo: "/images/ibm-sql-database.png",
    url: "https://courses.cognitiveclass.ai/certificates/5dcf1f5bb53840b58130ebdde572bbe0",
  },
  {
    title: "Docker Essential",
    issuer: "IBM Developer Skills Network",
    id: "CO0101EN",
    logo: "/images/ibm-docker-essential.png",
    url: "https://courses.cognitiveclass.ai/certificates/44de7bc0645041708503d3f5f413e8dd",
  },
  {
    title: "W140 Customization Projects 2023 R1",
    issuer: "Acumatica",
    id: "102578382",
    logo: "/images/acumatica-w140.png",
    url: "https://pubartifacts-bkt.s3.ap-south-1.amazonaws.com/W140+Customization+Projects+2023+R1.pdf",
  },
  {
    title: "Windows Server 2012: Installation and Configuration",
    issuer: "Microsoft",
    id: "AblMOmVoa0Ce-sxunXUINjY_alr4",
    logo: "/images/microsoft-windows-server.png",
    url: "https://pubartifacts-bkt.s3.ap-south-1.amazonaws.com/Windows+Server+2012+Installation+and.pdf",
  },
];

const projects = projectData.map((p) => ({
  title: p.title,
  blurb: p.subtitle,
  href: `/projects/${p.slug}`,
  tags: p.tags.slice(0, 4),
}));

export default function Home() {
  return (
    <>
      <ResetScrollOnLoad />
      <TopToolbar />

      <FlowArt aria-label="Nikhil Singh — portfolio">
        {/* 01 — About */}
        <FlowSection
          aria-label="About"
          style={{
            backgroundColor: "var(--panel-1-bg)",
            color: "var(--panel-1-fg)",
          }}
        >
          <div id="about" />
          <p className="text-xs font-bold uppercase tracking-[0.2em]">
            01 — About
          </p>
          <hr className="border-none border-t border-black opacity-100" />
          <div className="grid min-h-0 flex-1 grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16 lg:pt-[calc(clamp(2.5rem,5vw,5rem)+20px)]">
            {/* Left column: NIKHIL + tagline + character bound as one unit.
                The container's font-size is the clamp() — NIKHIL inherits it,
                and the character's height/right/bottom are em-based so they're
                always an exact ratio of NIKHIL's *current rendered* size. No
                clamp boundaries to misalign — the whole composition scales
                identically at any viewport width or zoom level. */}
            <div>
              {/* Em-lock container: inline-block hugs NIKHIL's actual text width.
                  The image's em-offsets now resolve against NIKHIL's right edge,
                  not the column edge — so they lean on the L letter. */}
              <div
                className="relative inline-block"
                style={{ fontSize: "clamp(3.5rem, 12vw, 14rem)" }}
              >
                <h1
                  className="font-bold uppercase leading-[0.85] tracking-tight"
                  style={{
                    textShadow:
                      "0 7px 20px rgba(0,0,0,0.31), 0 3px 7px rgba(0,0,0,0.20)",
                  }}
                >
                  <span className="text-[1.08em]">
                    <NameHighlight />
                  </span>
                  <br />
                  Singh
                </h1>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/leaning_model.png"
                  alt=""
                  aria-hidden
                  className="pointer-events-none absolute hidden select-none lg:block"
                  style={{
                    right: "-1.2em",
                    bottom: "-0.48em",
                    height: "2.1em",
                    width: "auto",
                    filter:
                    "drop-shadow(0 14px 20px rgba(0,0,0,0.42)) drop-shadow(0 42px 76px rgba(0,0,0,0.77))",
                  }}
                />
              </div>
              <p
                className="mt-10 ml-[100px] font-medium uppercase tracking-[0.15em]"
                style={{ fontSize: "clamp(0.85rem, 1.5vw, 1.2rem)" }}
              >
                Cloud Engineer · AWS Specialist · India
              </p>
            </div>
            {/* Right: summary */}
            <div className="border-t border-black/30 pt-8 lg:border-t-0 lg:pt-0 lg:pl-12">
              <p className="text-[clamp(1.15rem,1.95vw,1.7rem)] leading-relaxed">
                Cloud engineer, mostly AWS. I build the unglamorous plumbing —
                auth platforms, infrastructure-as-code, deploy pipelines — and
                obsess over making it boring enough that the rest of the team
                forgets it&apos;s there.
              </p>
              <p className="mt-6 text-[clamp(1rem,1.55vw,1.35rem)] leading-relaxed opacity-80">
                Big fan of Terraform plans that read like prose, deploys nobody
                has to babysit, and observability that catches things before
                the customer does. Less excited about 3am pages, manual
                rollbacks, and untested YAML.
              </p>
            </div>
          </div>
        </FlowSection>

        {/* 02 — Experience */}
        <FlowSection
          aria-label="Experience"
          style={{
            backgroundColor: "var(--panel-2-bg)",
            color: "var(--panel-2-fg)",
          }}
        >
          <div id="experience" />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em]">
              02 — Experience
            </p>
            <h2 className="mt-8 text-[clamp(3rem,8vw,7rem)] font-bold uppercase leading-[0.9] tracking-tight">
              <ThemedHighlight
                baseVar="--panel-2-fg"
                lightColor="#fd5200"
                darkColor="#fd5200"
                highlight="Where"
              />
              <br />
              I&apos;ve Built
            </h2>
          </div>
          <hr className="border-none border-t border-current opacity-30" />
          <div className="flex min-h-0 flex-1 items-center">
            <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              <GlassCard href="/enetro">
                <div className="mb-[1.1em] flex h-[3.1em] items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/Enetro_logo.svg"
                    alt="Enetro AI"
                    className="max-h-full w-auto object-contain"
                  />
                </div>
                <p className="text-[0.82em] font-semibold uppercase tracking-[0.2em] opacity-60">
                  2026 — Present
                </p>
                <h3 className="mt-[0.7em] text-[1.55em] font-bold leading-tight underline-offset-4 group-hover:underline">Cloud Engineer</h3>
                <p className="mt-[0.5em] text-[1.02em] opacity-90">Enetro AI</p>
                <p className="mt-[0.7em] text-[0.85em] opacity-60">India</p>
              </GlassCard>
              <GlassCard href="/readywire">
                <div className="mb-[1.1em] flex h-[3.1em] items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/Readywire_full_logo.png"
                    alt="Readywire"
                    className="max-h-full w-auto object-contain"
                  />
                </div>
                <p className="text-[0.82em] font-semibold uppercase tracking-[0.2em] opacity-60">
                  June 2023 — 2026
                </p>
                <h3 className="mt-[0.7em] text-[1.55em] font-bold leading-tight underline-offset-4 group-hover:underline">
                  Associate Solutions Architect
                </h3>
                <p className="mt-[0.5em] text-[1.02em] opacity-90">Readywire Pvt. Ltd.</p>
                <p className="mt-[0.7em] text-[0.85em] opacity-60">India</p>
              </GlassCard>
              <GlassCard href="/tcs">
                <div className="mb-[1.1em] flex h-[3.1em] items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/TCS_new.png"
                    alt="TATA Consultancy Services"
                    className="max-h-full w-auto object-contain"
                  />
                </div>
                <p className="text-[0.82em] font-semibold uppercase tracking-[0.2em] opacity-60">
                  August 2021 — June 2023
                </p>
                <h3 className="mt-[0.7em] text-[1.55em] font-bold leading-tight underline-offset-4 group-hover:underline">Associate Engineer</h3>
                <p className="mt-[0.5em] text-[1.02em] opacity-90">
                  TATA Consultancy Services
                </p>
                <p className="mt-[0.7em] text-[0.85em] opacity-60">India</p>
              </GlassCard>
            </div>
          </div>
        </FlowSection>

        {/* 03 — Certifications */}
        <FlowSection
          aria-label="Certifications"
          style={{
            backgroundColor: "var(--panel-3-bg)",
            color: "var(--panel-3-fg)",
          }}
        >
          <div id="certs" />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em]">
              03 — Certifications
            </p>
            <h2 className="mt-8 text-[clamp(3rem,8vw,7rem)] font-bold uppercase leading-[0.9] tracking-tight">
              <ThemedHighlight
                baseVar="--panel-3-fg"
                lightColor="#0a0a0a"
                darkColor="#fbbf24"
                highlight="Credentials"
              />
            </h2>
          </div>
          <hr className="border-none border-t border-current opacity-30" />
          <div className="flex min-h-0 flex-1 items-center">
            {/* the old 182px logo tiles plus 115px row gaps could not fit six of
                anything on a laptop; the badge is now em-sized like everything else */}
            <div className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3">
              {certs.map((c) => (
                <div key={c.id} className={c.id === "ZQJZ42BKRMEE1P9N" ? "relative" : undefined}>
                  {/* stacked rather than side by side: a wide row leaves the badge
                      a thumbnail, and the badge is the thing worth looking at */}
                  <GlassCard href={c.url} className="items-center justify-center gap-[0.15em] text-center">
                    {/* the badges are full-colour artwork, so they keep a white
                        plate to sit on — they would disappear into the glass */}
                    <div className="flex aspect-square w-[62%] max-w-[11em] items-center justify-center rounded-[1em] bg-white p-[0.85em] ring-1 ring-black/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={c.logo}
                        alt={c.issuer}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <h3 className="mt-[1.05em] text-[0.98em] font-bold leading-snug underline-offset-4 group-hover:underline">
                      {c.title}
                    </h3>
                    <p className="mt-auto pt-[0.45em] text-[0.85em] font-medium opacity-70">
                      {c.issuer}
                    </p>
                  </GlassCard>
                  {c.id === "ZQJZ42BKRMEE1P9N" && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src="/images/cofeeguy.png"
                      alt=""
                      aria-hidden
                      className="pointer-events-none absolute hidden select-none xl:block"
                      style={{
                        right: "calc(100% + 10px)",
                        bottom: "-10px",
                        height: "min(260px, 30vh)",
                        width: "auto",
                        filter:
                          "drop-shadow(0 14px 20px rgba(0,0,0,0.42)) drop-shadow(0 42px 76px rgba(0,0,0,0.77))",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </FlowSection>

        {/* 04 — Projects */}
        <FlowSection
          aria-label="Projects"
          style={{
            backgroundColor: "var(--panel-4-bg)",
            color: "var(--panel-4-fg)",
          }}
        >
          <div id="projects" />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em]">
              04 — Projects
            </p>
            {/* Em-lock container: inline-block hugs the headline's text width.
                Focused-guy sits absolutely inside, sized + positioned in em
                so it's permanently locked to the headline's font-size. */}
            <div
              className="relative mt-8 inline-block"
              style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
            >
              <h2 className="font-bold uppercase leading-[0.9] tracking-tight">
                <ThemedHighlight
                  baseVar="--panel-4-fg"
                  lightColor="#0a0a0a"
                  darkColor="#ffffff"
                  highlight="What"
                />
                <br />
                I&apos;ve Built
              </h2>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/focused-guy.png"
                alt=""
                aria-hidden
                className="pointer-events-none absolute hidden select-none lg:block"
                style={{
                  right: "-3.5em",
                  top: "-0.2em",
                  height: "2.6em",
                  width: "auto",
                  filter:
                    "drop-shadow(0 14px 20px rgba(0,0,0,0.42)) drop-shadow(0 42px 76px rgba(0,0,0,0.77))",
                }}
              />
            </div>
          </div>
          <hr className="my-4 border-none border-t border-current opacity-30 lg:my-8" />
          <div className="flex min-h-0 flex-1 items-center pt-4 lg:pt-8">
            {/* gaps are tighter than before: the cards now carry their own padding,
                so the old 14-unit gutters would read as drifting apart */}
            <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <GlassCard key={p.title} href={p.href}>
                  <h3 className="text-[1.12em] font-bold uppercase leading-snug tracking-wider underline-offset-4 group-hover:underline">
                    {p.title}
                  </h3>
                  <p className="mt-[0.9em] text-[0.95em] leading-relaxed opacity-85">
                    {p.blurb}
                  </p>
                  {/* mt-auto pins the tags to the bottom, so cards of differing
                      blurb length still line their tag rows up across the grid */}
                  <div className="mt-auto flex flex-wrap gap-x-[0.5em] gap-y-[0.2em] pt-[1.3em] text-[0.82em] font-medium uppercase tracking-wider opacity-60">
                    {p.tags.map((t, i) => (
                      <span key={t}>
                        {t}
                        {i < p.tags.length - 1 ? " ·" : ""}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </FlowSection>

        {/* 05 — Contact */}
        <FlowSection
          aria-label="Contact"
          style={{
            backgroundColor: "var(--panel-5-bg)",
            color: "var(--panel-5-fg)",
            // Stack a dark overlay on top of the photo so the image stays
            // subtle and the text never has to fight it. Opacity behaviour:
            // black at 0.86 alpha = ~14% photo visible.
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.86), rgba(0,0,0,0.86)), url(/images/contact-bg.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div id="contact" />
          <p className="text-xs font-bold uppercase tracking-[0.2em]">
            05 — Let&apos;s connect
          </p>
          <hr className="border-none border-t border-current opacity-30" />
          <div className="grid min-h-0 flex-1 grid-cols-1 items-center gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-[clamp(3rem,9vw,9rem)] font-bold uppercase leading-[0.85] tracking-tight">
                Let&apos;s
                <br />
                <ThemedHighlight
                  baseVar="--panel-5-fg"
                  lightColor="#fd5200"
                  darkColor="#fd5200"
                  highlight="Connect"
                />
              </h2>
              <p className="mt-6 max-w-[40ch] text-base opacity-70 md:text-lg">
                Open to new opportunities and collaborations. Drop a line and
                I&apos;ll get back to you.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="https://github.com/0NikhilSingh5"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-current/20 bg-white/5 transition hover:bg-white/15"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/nikhilsingh08/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-current/20 bg-white/5 transition hover:bg-white/15"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="https://x.com/itsyournickkk"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-current/20 bg-white/5 transition hover:bg-white/15"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="https://www.instagram.com/itsyournickk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-current/20 bg-white/5 transition hover:bg-white/15"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
              {/* Download Resume — spans the row of social icons above */}
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex w-[228px] items-center justify-center gap-2 rounded-full border border-current/25 bg-white/5 py-3 text-xs font-semibold uppercase tracking-[0.15em] whitespace-nowrap transition hover:bg-white/15"
              >
                <Download className="h-3.5 w-3.5" />
                Download Resume
              </a>
            </div>
            <div className="flex w-full justify-center lg:justify-end">
              <ContactForm />
            </div>
          </div>
          {/* Slim footer strip — same panel, single subtle divider */}
          <MiniFooter />
        </FlowSection>
      </FlowArt>
    </>
  );
}
