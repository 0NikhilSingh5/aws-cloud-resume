"use client";

import { useEffect } from "react";

/**
 * One moving light source for every glass card on the page.
 *
 * This is deliberately NOT per-card cursor tracking. Cards each spotlighting
 * their own cursor position looks like six separate torches. What iOS does is
 * one light: move the pointer (or tilt the phone) and every pane's edge catches
 * it from the same side at once, because there is only one light in the room.
 *
 * So the direction the pointer is *travelling* becomes a single --sheen angle on
 * :root, which every .glass reads. Nothing is written per element, and one
 * listener serves any number of cards.
 */
export function EdgeLight() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    // unit vector of travel, smoothed — raw movementX/Y is far too jittery to
    // drive a highlight directly
    let vx = -0.7;
    let vy = -0.7;
    let raf = 0;
    let targetX = vx;
    let targetY = vy;

    const commit = () => {
      raf = 0;
      // ease toward the travel direction so the light glides instead of snapping
      vx += (targetX - vx) * 0.18;
      vy += (targetY - vy) * 0.18;
      // atan2 gives the direction of travel; +90 converts it to the CSS gradient
      // angle whose bright end sits on the leading edge
      const deg = (Math.atan2(vy, vx) * 180) / Math.PI + 90;
      root.style.setProperty("--sheen", `${deg.toFixed(1)}deg`);
      if (Math.hypot(targetX - vx, targetY - vy) > 0.01) raf = requestAnimationFrame(commit);
    };

    const aim = (dx: number, dy: number) => {
      const len = Math.hypot(dx, dy);
      if (len < 2) return;   // ignore sub-pixel jitter and idle micro-moves
      targetX = dx / len;
      targetY = dy / len;
      if (!raf) raf = requestAnimationFrame(commit);
    };

    let lastX: number | null = null;
    let lastY: number | null = null;
    const onMove = (e: PointerEvent) => {
      // movementX/Y is unreliable across browsers and zero on some touch stacks,
      // so derive the delta from successive positions instead
      if (lastX !== null && lastY !== null) aim(e.clientX - lastX, e.clientY - lastY);
      lastX = e.clientX;
      lastY = e.clientY;
    };

    // touch has no pointer to move, so scrolling supplies the direction
    let lastScroll = window.scrollY;
    const onScroll = () => {
      const dy = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      aim(dy * 0.35, dy);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
