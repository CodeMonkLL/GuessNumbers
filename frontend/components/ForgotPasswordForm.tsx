"use client";

import { useState } from "react";

export default function ForgotPasswordForm({
  initialUsername = "",
  onBack,
}: {
  initialUsername?: string;
  onBack: () => void;
}) {
  const [username, setUsername] = useState(initialUsername);
  const [recoveryCode, setRecoveryCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [newRecoveryCode, setNewRecoveryCode] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed || !recoveryCode || !newPassword) {
      setError("Please fill in all fields");
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: trimmed,
          recoveryCode,
          newPassword,
        }),
      });
      const body = await res.json();

      if (!res.ok) {
        setError(body?.error ?? "Something went wrong");
        return;
      }

      // Resetting issues a new recovery code -- the old one is now used up.
      setNewRecoveryCode(body.recoveryCode);
    } catch {
      setError("Server unreachable");
    } finally {
      setSubmitting(false);
    }
  }

  if (newRecoveryCode) {
    return (
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
        <p className="text-sm text-black dark:text-zinc-50">
          Password changed! Your new recovery code (visible only now,
          please write it down):
        </p>
        <p className="rounded-lg bg-zinc-100 p-3 text-center font-mono text-lg font-semibold text-black dark:bg-zinc-800 dark:text-zinc-50">
          {newRecoveryCode}
        </p>
        <button
          type="button"
          onClick={onBack}
          className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Go to login
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900"
    >
      <p className="text-sm font-medium text-black dark:text-zinc-50">
        Reset password
      </p>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="forgot-username"
          className="text-sm font-medium text-black dark:text-zinc-50"
        >
          Username
        </label>
        <input
          id="forgot-username"
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
          htmlFor="forgot-recovery-code"
          className="text-sm font-medium text-black dark:text-zinc-50"
        >
          Recovery code
        </label>
        <input
          id="forgot-recovery-code"
          value={recoveryCode}
          onChange={(e) => setRecoveryCode(e.target.value)}
          autoComplete="off"
          className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-black outline-none focus:border-black/30 dark:border-white/15 dark:text-zinc-50 dark:focus:border-white/40"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="forgot-new-password"
          className="text-sm font-medium text-black dark:text-zinc-50"
        >
          New password
        </label>
        <input
          id="forgot-new-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="new-password"
          className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-black outline-none focus:border-black/30 dark:border-white/15 dark:text-zinc-50 dark:focus:border-white/40"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
      >
        {submitting ? "…" : "Reset password"}
      </button>

      <button
        type="button"
        onClick={onBack}
        className="text-xs text-black/60 underline hover:text-black dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        Back
      </button>
    </form>
  );
}
