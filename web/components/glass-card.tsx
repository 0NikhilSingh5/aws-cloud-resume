"use client";

import Link from "next/link";
import { useCallback, type PointerEvent, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** internal route, or an absolute URL — absolute ones open in a new tab */
  href?: string;
  className?: string;
};

/**
 * A frosted glass surface whose rim and specular highlight follow the pointer,
 * the way a sheet of glass catches light.
 *
 * The tracking is two CSS custom properties rather than React state on purpose:
 * a pointermove handler that called setState would re-render the card on every
 * mouse sample. Writing --mx/--my straight onto the node keeps it off the React
 * render path entirely, and the styling all lives in .glass in globals.css.
 */
export function GlassCard({ children, href, className = "" }: Props) {
  const track = useCallback((e: PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  }, []);

  // back to centre so the next hover starts neutral instead of snapping from
  // wherever the pointer happened to leave
  const reset = useCallback((e: PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty("--mx", "50%");
    e.currentTarget.style.setProperty("--my", "50%");
  }, []);

  const cls = `glass group flex h-full flex-col ${className}`;
  const handlers = { onPointerMove: track, onPointerLeave: reset };

  if (!href) {
    return (
      <div className={cls} {...handlers}>
        {children}
      </div>
    );
  }

  if (href.startsWith("http")) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        {...handlers}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cls} {...handlers}>
      {children}
    </Link>
  );
}
