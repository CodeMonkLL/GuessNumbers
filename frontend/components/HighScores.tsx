"use client";

import { useEffect, useState } from "react";
import type { HighScoreEntry } from "@/lib/types";

export default function HighScores({ refreshKey }: { refreshKey: number }) {
  const [scores, setScores] = useState<HighScoreEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/highscores")
      .then(async (res) => {
        const body = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setScores(null);
          setError(body?.error ?? "Could not load high scores");
          return;
        }
        setScores(body as HighScoreEntry[]);
        setError(null);
      })
      .catch(() => {
        if (!cancelled) setError("Could not reach the server");
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return (
    <div className="w-full max-w-sm rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
      <h2 className="mb-4 text-lg font-semibold text-black dark:text-zinc-50">
        High Scores
      </h2>
      {error && <p className="text-sm text-zinc-500 dark:text-zinc-400">{error}</p>}
      {!error && !scores && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading…</p>
      )}
      {scores && scores.length === 0 && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No high scores yet — be the first!
        </p>
      )}
      {scores && scores.length > 0 && (
        <ol className="flex flex-col gap-2">
          {scores.map((entry) => (
            <li
              key={`${entry.place}-${entry.userName}`}
              className="flex items-center justify-between text-sm text-black dark:text-zinc-50"
            >
              <span className="font-medium">
                #{entry.place} {entry.userName}
              </span>
              <span className="text-zinc-500 dark:text-zinc-400">
                {entry.attempts} {entry.attempts === 1 ? "attempt" : "attempts"}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
