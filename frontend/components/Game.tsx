"use client";

import { useState } from "react";
import type { PlayRoundResponse, User } from "@/lib/types";

type Guess = {
  attemptNumber: number;
  responseMessage: string;
};

export default function Game({
  user,
  onSwitchUser,
  onWin,
}: {
  user: User;
  onSwitchUser: () => void;
  onWin: () => void;
}) {
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [guessValue, setGuessValue] = useState("");
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [won, setWon] = useState<{ attempts: number; winningNumber: number } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function startRound() {
    setLoading(true);
    setError(null);
    setGuesses([]);
    setWon(null);
    try {
      const res = await fetch("/api/start-round", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body?.error ?? "Could not start a round");
        return;
      }
      setSessionId(body.sessionId);
    } catch {
      setError("Could not reach the server");
    } finally {
      setLoading(false);
    }
  }

  async function submitGuess(e: React.SubmitEvent) {
    e.preventDefault();
    if (sessionId === null) return;
    const attemptNumber = Number(guessValue);
    if (!Number.isInteger(attemptNumber) || attemptNumber < 1 || attemptNumber > 100) {
      setError("Enter a whole number between 1 and 100");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/play-round", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          sessionId,
          attemptNumber,
        }),
      });
      const body: PlayRoundResponse = await res.json();
      if (!res.ok) {
        setError((body as unknown as { error: string })?.error ?? "Could not submit guess");
        return;
      }
      setGuesses((prev) => [
        { attemptNumber: body.attemptNumber, responseMessage: body.responseMessage },
        ...prev,
      ]);
      setGuessValue("");
      if (body.isAttemptSuccessful && body.winningNumber !== null) {
        setWon({ attempts: guesses.length + 1, winningNumber: body.winningNumber });
        onWin();
      }
    } catch {
      setError("Could not reach the server");
    } finally {
      setLoading(false);
    }
  }

  if (sessionId === null) {
    return (
      <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
        <p className="text-center text-black dark:text-zinc-50">
          Hi <span className="font-semibold">{user.username}</span>! Ready to guess a
          number between 1 and 100?
        </p>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          onClick={startRound}
          disabled={loading}
          className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
        >
          {loading ? "Starting…" : "Start round"}
        </button>
        <button
          onClick={onSwitchUser}
          className="text-xs text-zinc-500 underline hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          Not you? Switch user
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
      <p className="text-black dark:text-zinc-50">
        Playing as <span className="font-semibold">{user.username}</span>
      </p>

      {won ? (
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-lg font-semibold text-black dark:text-zinc-50">
            🎉 You got it! The number was {won.winningNumber}.
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {won.attempts} {won.attempts === 1 ? "attempt" : "attempts"}
          </p>
          <button
            onClick={startRound}
            className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Play again
          </button>
        </div>
      ) : (
        <form onSubmit={submitGuess} className="flex flex-col gap-3">
          <input
            type="number"
            min={1}
            max={100}
            value={guessValue}
            onChange={(e) => setGuessValue(e.target.value)}
            placeholder="Your guess (1-100)"
            className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-black outline-none focus:border-black/30 dark:border-white/15 dark:text-zinc-50 dark:focus:border-white/40"
            autoFocus
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
          >
            {loading ? "Checking…" : "Guess"}
          </button>
        </form>
      )}

      {guesses.length > 0 && (
        <ul className="flex flex-col gap-1 border-t border-black/10 pt-3 dark:border-white/10">
          {guesses.map((g, i) => (
            <li
              key={i}
              className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400"
            >
              <span>{g.attemptNumber}</span>
              <span>{g.responseMessage}</span>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={onSwitchUser}
        className="text-xs text-zinc-500 underline hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        Not you? Switch user
      </button>
    </div>
  );
}
