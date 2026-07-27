import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** internal route, or an absolute URL — absolute ones open in a new tab */
  href?: string;
  className?: string;
};

/**
 * A frosted glass surface. All the material lives in .glass in globals.css, and
 * the edge light is a single shared --sheen angle set by <EdgeLight />, so this
 * needs no client JS at all — it stays a server component.
 */
export function GlassCard({ children, href, className = "" }: Props) {
  const cls = `glass group flex h-full flex-col ${className}`;

  if (!href) return <div className={cls}>{children}</div>;

  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
