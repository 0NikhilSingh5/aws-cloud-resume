"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export interface MarkerHighlightProps {
  before?: string;
  highlight: string;
  after?: string;
  markerColor?: string;
  highlightedTextColor?: string;
  delay?: number;
  className?: string;
}

/**
 * Drop-in API-compatible replacement for the Remotion-based marker-highlight.
 * A bar scales from left to right behind the highlight; text color shifts
 * once the bar has covered the text.
 *
 * The animation re-plays whenever:
 *   - the page loads / reloads (initial mount),
 *   - the highlight scrolls back into the viewport,
 *   - the user clicks anywhere on the page.
 */
export function MarkerHighlight({
  before = "",
  highlight,
  after = "",
  markerColor = "#0a0a0a",
  highlightedTextColor = "#ffffff",
  delay = 0.4,
  className,
}: MarkerHighlightProps) {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const [playKey, setPlayKey] = useState(0);

  // Replay when the element scrolls into view
  useEffect(() => {
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
  }, []);

  // Replay on any click on the page
  useEffect(() => {
    const onClick = () => setPlayKey((k) => k + 1);
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <span ref={wrapperRef} className={className}>
      {before}
      <span style={{ position: "relative", display: "inline-block" }}>
        <motion.span
          key={`bar-${playKey}`}
          aria-hidden
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            type: "spring",
            stiffness: 110,
            damping: 14,
            delay,
          }}
          style={{
            position: "absolute",
            inset: "-0.12em -0.1em",
            background: markerColor,
            transformOrigin: "left center",
            zIndex: 0,
            borderRadius: "0.05em",
          }}
        />
        <motion.span
          key={`text-${playKey}`}
          initial={{ color: "inherit" }}
          animate={{ color: highlightedTextColor }}
          transition={{ duration: 0.35, delay: delay + 0.45 }}
          style={{ position: "relative", zIndex: 1 }}
        >
          {highlight}
        </motion.span>
      </span>
      {after}
    </span>
  );
}
