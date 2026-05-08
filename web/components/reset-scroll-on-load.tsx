"use client";

import { useEffect } from "react";

/**
 * Disables the browser's scroll-restoration on the home page so a reload
 * always lands the user at the top of the story-scroll, with all GSAP
 * animations replayed from frame 0.
 *
 * Project / role pages keep default scroll restoration — readers shouldn't
 * lose their place mid-article.
 */
export function ResetScrollOnLoad() {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  return null;
}
