"use client";

import { useEffect, useState } from "react";

const ENDPOINT =
  "https://3u40preuk1.execute-api.ap-south-1.amazonaws.com/prod/visits";

export function VisitorCounter() {
  const [count, setCount] = useState<string>("…");

  useEffect(() => {
    let alive = true;
    fetch(ENDPOINT)
      .then((r) => r.json())
      .then((data: { visits?: number }) => {
        if (alive && typeof data.visits === "number") {
          setCount(data.visits.toLocaleString());
        }
      })
      .catch(() => {
        if (alive) setCount("—");
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <span className="rounded-full border border-black/20 bg-white/60 px-3 py-1 text-xs font-medium text-black backdrop-blur dark:border-white/20 dark:bg-black/40 dark:text-white">
      Visitors: {count}
    </span>
  );
}
