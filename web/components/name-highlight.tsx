"use client";

import { useEffect, useState } from "react";
import { InlineHighlight } from "@/components/inline-highlight";

/**
 * Theme-aware wrapper around InlineHighlight for the "Nikhil" word in the
 * About hero. framer-motion can't tween from "currentColor" or var(--...) to
 * concrete colors — it needs actual RGB strings on both sides — so we resolve
 * the panel-1 foreground and name-highlight CSS variables here and re-resolve
 * whenever the html `dark` class flips.
 */
export function NameHighlight() {
  const [colors, setColors] = useState({
    base: "#ffffff",
    highlight: "#0a0a0a",
  });

  useEffect(() => {
    const resolve = () => {
      const styles = getComputedStyle(document.documentElement);
      const base = styles.getPropertyValue("--panel-1-fg").trim() || "#ffffff";
      const highlight =
        styles.getPropertyValue("--name-highlight").trim() || "#0a0a0a";
      setColors({ base, highlight });
    };
    resolve();
    const observer = new MutationObserver(resolve);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <InlineHighlight
      before=""
      highlight="Nikhil"
      baseColor={colors.base}
      highlightColor={colors.highlight}
      duration={1.4}
      delay={0.4}
    />
  );
}
