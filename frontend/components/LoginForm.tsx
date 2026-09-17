"use client";

import { useState } from "react";
import type { User } from "@/lib/types";

export default function LoginForm({
  onLoggedIn,
  onSwitchToRegister,
  onForgotPassword,
}: {
  onLoggedIn: (user: User) => void;
  onSwitchToRegister: () => void;
  onForgotPassword: (username: string) => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: trimmed, password }),
      });
      const body = await res.json();

      if (!res.ok) {
        setError(body?.error ?? "Something went wrong");
        return;
      }

      onLoggedIn({ id: body.id, username: body.username });
    } catch {
      setError("Server unreachable");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900"
    >
      <div className="flex flex-col gap-1">
        <label
          htmlFor="login-username"
          className="text-sm font-medium text-black dark:text-zinc-50"
        >
          Username
        </label>
        <input
          id="login-username"
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
          htmlFor="login-password"
          className="text-sm font-medium text-black dark:text-zinc-50"
        >
          Password
        </label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
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
        {submitting ? "…" : "Login"}
      </button>

      <button
        type="button"
        onClick={onSwitchToRegister}
        className="text-xs text-black/60 underline hover:text-black dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        No account yet? Register
      </button>
    </form>
  );
}
