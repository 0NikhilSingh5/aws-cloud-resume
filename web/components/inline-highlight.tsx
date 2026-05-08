"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export interface InlineHighlightProps {
  before: string;
  highlight: string;
  after?: string;
  baseColor?: string;
  highlightColor?: string;
  fontSize?: number | string;
  fontWeight?: number;
  delay?: number;
  duration?: number;
  replayOnView?: boolean;
  replayOnClick?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Color-cross-fade highlight, drop-in replacement for the Remotion-based
 * inline-highlight (which requires a <Player>/<Composition>). Same visual,
 * no Remotion bundle. Optionally replays whenever the highlight scrolls
 * back into view or whenever the page is clicked.
 */
export function InlineHighlight({
  before,
  highlight,
  after = "",
  baseColor = "currentColor",
  highlightColor = "#ff5e3a",
  fontSize,
  fontWeight = 700,
  delay = 0.3,
  duration = 1.4,
  replayOnView = true,
  replayOnClick = true,
  className,
  style,
}: InlineHighlightProps) {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const [playKey, setPlayKey] = useState(0);

  useEffect(() => {
    if (!replayOnView) return;
    const el = wrapperRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setPlayKey((k) => k + 1);
          }
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [replayOnView]);

  useEffect(() => {
    if (!replayOnClick) return;
    const onClick = () => setPlayKey((k) => k + 1);
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [replayOnClick]);

  return (
    <span
      ref={wrapperRef}
      className={className}
      style={{
        fontSize,
        fontWeight,
        color: baseColor,
        letterSpacing: "-0.03em",
        ...style,
      }}
    >
      {before}
      <motion.span
        key={playKey}
        initial={{ color: baseColor }}
        animate={{ color: highlightColor }}
        transition={{ duration, delay, ease: "easeOut" }}
      >
        {highlight}
      </motion.span>
      {after}
    </span>
  );
}
