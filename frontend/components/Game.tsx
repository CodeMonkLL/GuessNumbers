"use client";

import { useEffect, useRef, useState } from "react";
import MoodAnimation from "@/components/MoodAnimation";
import type { PlayRoundResponse, User } from "@/lib/types";
import {
  cardClass,
  errorClass,
  hintClass,
  inputClass,
  labelClass,
  linkButtonClass,
  primaryButtonClass,
} from "@/components/formStyles";

type Guess = {
  attemptNumber: number;
  responseMessage: string;
};

type Mood = "thinking" | "diagonalMouth" | "yawn" | "angry" | "smiley";

const MOOD_ANIMATIONS: Record<Mood, string> = {
  thinking: "/thinking.lottie",
  diagonalMouth: "/diagonal_mouth.lottie",
  yawn: "/yawn.lottie",
  angry: "/angry.lottie",
  smiley: "/smiley.lottie",
};

// Purely cosmetic mood indicator based on missed attempts -- the backend has
// no attempt limit and the round keeps going regardless.
function getMood(missedAttempts: number, won: boolean): Mood {
  if (won) return "smiley";
  if (missedAttempts >= 10) return "angry";
  if (missedAttempts >= 3) return "yawn";
  if (missedAttempts >= 1) return "diagonalMouth";
  return "thinking";
}

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
  const winHeadingRef = useRef<HTMLHeadingElement>(null);

  // The guess form is removed on a win; move focus to the result so keyboard
  // and screen reader users land on it instead of on <body>.
  useEffect(() => {
    if (won) winHeadingRef.current?.focus();
  }, [won]);

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
    if (
      guessValue.trim() === "" ||
      !Number.isInteger(attemptNumber) ||
      attemptNumber < 1 ||
      attemptNumber > 100
    ) {
      setError("Your guess must be a whole number between 1 and 100");
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

  const mood = getMood(guesses.length, won !== null);
  const lastGuess = guesses[0];

  if (sessionId === null) {
    return (
      <section aria-labelledby="game-heading" className={`items-center ${cardClass}`}>
        <h2 id="game-heading" className="sr-only">
          Game
        </h2>
        <MoodAnimation src={MOOD_ANIMATIONS[mood]} />
        <p className="text-center text-black dark:text-zinc-50">
          Hi <span className="font-semibold">{user.username}</span>! Ready to guess a
          number between 1 and 100?
        </p>
        <p role="alert" className={errorClass}>
          {error}
        </p>
        <button onClick={startRound} disabled={loading} className={primaryButtonClass}>
          {loading ? "Starting…" : "Start round"}
        </button>
        <button onClick={onSwitchUser} className={linkButtonClass}>
          Not you? Switch user
        </button>
      </section>
    );
  }

  return (
    <section aria-labelledby="game-heading" className={cardClass}>
      <h2 id="game-heading" className="sr-only">
        Game
      </h2>
      <MoodAnimation src={MOOD_ANIMATIONS[mood]} className="self-center" />
      <p className="text-black dark:text-zinc-50">
        Playing as <span className="font-semibold">{user.username}</span>
      </p>

      {/* Announces each guess result to screen readers without moving focus. */}
      <p role="status" className="sr-only">
        {lastGuess && !won
          ? `${lastGuess.attemptNumber}: ${lastGuess.responseMessage}`
          : ""}
      </p>

      {won ? (
        <div className="flex flex-col items-center gap-3 text-center">
          <h3
            ref={winHeadingRef}
            tabIndex={-1}
            className="text-lg font-semibold text-black dark:text-zinc-50"
          >
            <span aria-hidden="true">🎉 </span>You got it! The number was{" "}
            {won.winningNumber}.
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {won.attempts} {won.attempts === 1 ? "attempt" : "attempts"}
          </p>
          <button onClick={startRound} className={primaryButtonClass}>
            Play again
          </button>
        </div>
      ) : (
        <form
          onSubmit={submitGuess}
          noValidate
          aria-busy={loading}
          className="flex flex-col gap-3"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="guess-input" className={labelClass}>
              Your guess
            </label>
            <input
              id="guess-input"
              type="number"
              inputMode="numeric"
              min={1}
              max={100}
              value={guessValue}
              onChange={(e) => setGuessValue(e.target.value)}
              required
              aria-invalid={error !== null}
              aria-describedby={error ? "guess-hint guess-error" : "guess-hint"}
              className={inputClass}
              autoFocus
            />
            <p id="guess-hint" className={hintClass}>
              A whole number from 1 to 100.
            </p>
          </div>
          <p id="guess-error" role="alert" className={errorClass}>
            {error}
          </p>
          <button type="submit" disabled={loading} className={primaryButtonClass}>
            {loading ? "Checking…" : "Guess"}
          </button>
        </form>
      )}

      {guesses.length > 0 && (
        <div className="border-t border-black/10 pt-3 dark:border-white/10">
          <h3 id="guesses-heading" className="mb-2 text-sm font-semibold text-black dark:text-zinc-50">
            Your guesses (newest first)
          </h3>
          <ul aria-labelledby="guesses-heading" className="flex flex-col gap-1">
            {guesses.map((g, i) => (
              <li
                key={guesses.length - i}
                className="flex items-center justify-between text-sm text-zinc-700 dark:text-zinc-300"
              >
                <span>{g.attemptNumber}</span>
                <span>{g.responseMessage}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={onSwitchUser} className={linkButtonClass}>
        Not you? Switch user
      </button>
    </section>
  );
}
