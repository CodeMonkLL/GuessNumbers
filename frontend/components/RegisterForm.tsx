"use client";

import { useState } from "react";
import type { User } from "@/lib/types";

export default function RegisterForm({
  onRegistered,
  onSwitchToLogin,
  onForgotPassword,
}: {
  onRegistered: (user: User) => void;
  onSwitchToLogin: () => void;
  onForgotPassword: (username: string) => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // After a successful registration, the recovery code is held here so it can be
  // shown to the user AND confirmed before continuing -- this is the only chance
  // they get to see it in plain text.
  const [recoveryCode, setRecoveryCode] = useState<string | null>(null);
  const [pendingUser, setPendingUser] = useState<User | null>(null);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed || !password) {
      setError("Please enter a username and password");
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: trimmed, password }),
      });
      const body = await res.json();

      if (!res.ok) {
        setError(body?.error ?? "Something went wrong");
        return;
      }

      // Show the confirmation view with the recovery code first --
      // onRegistered() only fires once the user clicks "Continue playing" there.
      setRecoveryCode(body.recoveryCode);
      setPendingUser({ id: body.id, username: body.username });
    } catch {
      setError("Server unreachable");
    } finally {
      setSubmitting(false);
    }
  }

  if (recoveryCode && pendingUser) {
    return (
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
        <p className="text-sm text-black dark:text-zinc-50">
          Account created! Your recovery code (visible only now,
          please write it down):
        </p>
        <p className="rounded-lg bg-zinc-100 p-3 text-center font-mono text-lg font-semibold text-black dark:bg-zinc-800 dark:text-zinc-50">
          {recoveryCode}
        </p>
        <button
          type="button"
          onClick={() => onRegistered(pendingUser)}
          className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Continue playing
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900"
    >
      <div className="flex flex-col gap-1">
        <label
          htmlFor="register-username"
          className="text-sm font-medium text-black dark:text-zinc-50"
        >
          Username
        </label>
        <input
          id="register-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="max_mustermann"
          autoComplete="off"
          className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-black outline-none focus:border-black/30 dark:border-white/15 dark:text-zinc-50 dark:focus:border-white/40"
          autoFocus
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="register-password"
          className="text-sm font-medium text-black dark:text-zinc-50"
        >
          Password
        </label>
        <input
          id="register-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-black outline-none focus:border-black/30 dark:border-white/15 dark:text-zinc-50 dark:focus:border-white/40"
        />
        <button
          type="button"
          onClick={() => onForgotPassword(username)}
          className="self-start text-xs text-black/60 underline hover:text-black dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          Forgot password?
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
      >
        {submitting ? "…" : "Register"}
      </button>

      <button
        type="button"
        onClick={onSwitchToLogin}
        className="text-xs text-black/60 underline hover:text-black dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        Already registered? Log in
      </button>
    </form>
  );
}
