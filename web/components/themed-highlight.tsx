"use client";

import { useEffect, useState } from "react";
import { InlineHighlight } from "@/components/inline-highlight";

export interface ThemedHighlightProps {
  /** CSS var that holds the panel's foreground color, e.g. "--panel-2-fg". */
  baseVar: string;
  /** Light-mode highlight color (concrete RGB / hex). */
  lightColor: string;
  /** Dark-mode highlight color (concrete RGB / hex). */
  darkColor: string;
  before?: string;
  highlight: string;
  after?: string;
  delay?: number;
  duration?: number;
}

/**
 * Theme-aware wrapper around InlineHighlight. Resolves the panel's
 * foreground CSS variable to a concrete color (so motion can tween from
 * it) and switches the highlight color based on the html `dark` class.
 */
export function ThemedHighlight({
  baseVar,
  lightColor,
  darkColor,
  before = "",
  highlight,
  after = "",
  delay = 0.4,
  duration = 1.4,
}: ThemedHighlightProps) {
  const [colors, setColors] = useState({
    base: "#ffffff",
    highlight: lightColor,
  });

  useEffect(() => {
    const resolve = () => {
      const styles = getComputedStyle(document.documentElement);
      const base = styles.getPropertyValue(baseVar).trim() || "#ffffff";
      const isDark = document.documentElement.classList.contains("dark");
      setColors({ base, highlight: isDark ? darkColor : lightColor });
    };
    resolve();
    const observer = new MutationObserver(resolve);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, [baseVar, lightColor, darkColor]);

  return (
    <InlineHighlight
      before={before}
      highlight={highlight}
      after={after}
      baseColor={colors.base}
      highlightColor={colors.highlight}
      delay={delay}
      duration={duration}
    />
  );
}
