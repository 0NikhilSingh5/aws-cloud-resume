"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export interface CodeBlockProps {
  title?: string;
  language?: string;
  code: string;
  note?: string;
}

export function CodeBlock({ title, language, code, note }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <figure className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
      {(title || language) && (
        <figcaption className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
          <div className="flex items-baseline gap-3">
            {title && (
              <span className="text-sm font-semibold text-zinc-100">
                {title}
              </span>
            )}
            {language && (
              <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                {language}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={copy}
            aria-label="Copy code"
            className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition hover:bg-white/5 hover:text-zinc-100"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </figcaption>
      )}
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-relaxed text-zinc-100">
        <code>{code}</code>
      </pre>
      {note && (
        <p className="border-t border-white/10 bg-white/[0.02] px-4 py-2 text-xs italic text-zinc-500">
          {note}
        </p>
      )}
    </figure>
  );
}
