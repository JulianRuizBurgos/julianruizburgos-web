"use client";

import { useState } from "react";
import { nowListening } from "@/lib/listening";

// Animated bars — the classic "music playing" indicator
function Bars() {
  return (
    <span className="flex items-end gap-[2px] h-3" aria-hidden>
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className="w-[2px] h-3 rounded-sm bg-terracotta-400 animate-listening-bar origin-bottom"
          style={{ animationDelay: `${(i - 1) * 0.15}s` }}
        />
      ))}
    </span>
  );
}

export default function NowListening() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const { artist, track, album, url } = nowListening;

  return (
    <div className="fixed bottom-11 left-0 right-0 z-40 flex justify-center pointer-events-none">
      <div className="pointer-events-auto mb-4 flex items-center gap-3 rounded-full bg-earth-900/90 backdrop-blur-sm px-4 py-2.5 shadow-lg border border-white/5">
        {/* Animated bars */}
        <Bars />

        {/* Text */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-xs font-medium uppercase tracking-[0.15em] text-earth-300">
            Listening
          </span>
          <span className="text-xs text-earth-400">—</span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-earth-200 hover:text-terracotta-300 transition-colors"
          >
            {artist}
            <span className="text-earth-400">,</span>{" "}
            <span className="italic text-earth-400">{track}</span>
          </a>
          <span className="hidden sm:inline text-xs text-earth-600">
            · {album}
          </span>
        </div>

        {/* Dismiss */}
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="ml-1 text-earth-600 hover:text-earth-300 transition-colors text-xs leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
}
