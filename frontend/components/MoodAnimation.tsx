"use client";

import { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// Decorative looping animation. Looping motion longer than 5 seconds must be
// pausable (WCAG 2.2.2), and users who asked the OS for reduced motion get a
// still image by default (WCAG 2.3.3).
export default function MoodAnimation({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Client-only media query, unavailable during SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (query.matches) setPlaying(false);
  }, []);

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      {/* Purely decorative: the mood carries no information the text doesn't. */}
      <div className="h-24 w-24" aria-hidden="true">
        <DotLottieReact
          key={`${src}-${playing}`}
          src={src}
          loop={playing}
          autoplay={playing}
        />
      </div>
      <button
        type="button"
        onClick={() => setPlaying((p) => !p)}
        aria-pressed={!playing}
        className="min-h-6 px-2 text-sm text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        {playing ? "Pause animation" : "Play animation"}
      </button>
    </div>
  );
}
