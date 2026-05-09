"use client";

import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import AnimatedThemeToggler from "@/components/animated-theme-toggler";

const ENDPOINT =
  "https://3u40preuk1.execute-api.ap-south-1.amazonaws.com/prod/visits";

// The Lambda increments the counter on every GET, so we only fetch once per
// browser session. Subsequent route changes / refreshes within the same tab
// reuse the cached value instead of re-incrementing.
const CACHE_KEY = "visits-count";

export function TopToolbar() {
  const [count, setCount] = useState<string>("…");

  useEffect(() => {
    const cached =
      typeof window !== "undefined" ? sessionStorage.getItem(CACHE_KEY) : null;
    if (cached) {
      setCount(cached);
      return;
    }

    let alive = true;
    fetch(ENDPOINT)
      .then((r) => r.json())
      .then((data: { visits?: number }) => {
        if (!alive || typeof data.visits !== "number") return;
        const formatted = data.visits.toLocaleString();
        sessionStorage.setItem(CACHE_KEY, formatted);
        setCount(formatted);
      })
      .catch(() => {
        if (alive) setCount("—");
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div
      className="
        fixed top-5 right-5 z-[10000]
        flex items-stretch gap-1
        rounded-2xl border border-black/10 bg-white/80
        px-1.5 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl
        dark:border-white/10 dark:bg-black/50 dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
      "
    >
      <div className="flex items-center gap-2.5 px-3 py-1.5">
        <Eye
          className="h-4 w-4 text-zinc-500 dark:text-zinc-400"
          strokeWidth={2}
        />
        <div className="flex flex-col leading-tight">
          <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-500">
            Visitors
          </span>
          <span className="font-mono text-sm font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
            {count}
          </span>
        </div>
      </div>

      <div className="my-1.5 w-px bg-black/10 dark:bg-white/10" aria-hidden />

      <div className="flex items-center pl-1 pr-1">
        <AnimatedThemeToggler sound />
      </div>
    </div>
  );
}
