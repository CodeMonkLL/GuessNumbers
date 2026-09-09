"use client";

import { useState } from "react";
import type { User } from "@/lib/types";

export default function UsernameForm({
  onRegistered,
}: {
  onRegistered: (user: User) => void;
}) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) {
      setError("Please enter a username");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: trimmed }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body?.error ?? "Could not create user");
        return;
      }
      onRegistered({ id: body.id, username: body.username });
    } catch {
      setError("Could not reach the server");
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
          htmlFor="username"
          className="text-sm font-medium text-black dark:text-zinc-50"
        >
          Choose a username
        </label>
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="max_mustermann"
          className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-black outline-none focus:border-black/30 dark:border-white/15 dark:text-zinc-50 dark:focus:border-white/40"
          autoFocus
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
      >
        {submitting ? "Creating…" : "Start playing"}
      </button>
    </form>
  );
}
