"use client";

import { useState } from "react";
import type { User } from "@/lib/types";

type Mode = "register" | "login";

export default function UsernameForm({
  onRegistered,
}: {
  onRegistered: (user: User) => void;
}) {
  const [mode, setMode] = useState<Mode>("register");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Nach erfolgreicher Registrierung wird der Recovery-Code hier zwischengehalten,
  // damit er dem User erst gezeigt UND bestaetigt werden muss, bevor es weitergeht --
  // das ist die einzige Chance, ihn im Klartext zu sehen.
  const [recoveryCode, setRecoveryCode] = useState<string | null>(null);
  const [pendingUser, setPendingUser] = useState<User | null>(null);

  const [showReset, setShowReset] = useState(false);
  const [resetRecoveryCode, setResetRecoveryCode] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [resetSubmitting, setResetSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed || !password) {
      setError("Bitte Benutzername und Passwort angeben");
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const endpoint = mode === "register" ? "/api/user" : "/api/login";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: trimmed, password }),
      });
      const body = await res.json();

      if (!res.ok) {
        setError(body?.error ?? "Es ist ein Fehler aufgetreten");
        return;
      }

      if (mode === "login") {
        onRegistered({ id: body.id, username: body.username });
      } else {
        // Erst die Bestaetigungs-Ansicht mit dem Recovery-Code zeigen --
        // onRegistered() erst, wenn der User dort auf "Weiter spielen" klickt.
        setRecoveryCode(body.recoveryCode);
        setPendingUser({ id: body.id, username: body.username });
      }
    } catch {
      setError("Server nicht erreichbar");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResetSubmit() {
    setResetSubmitting(true);
    setResetError(null);
    setResetMessage(null);

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          recoveryCode: resetRecoveryCode,
          newPassword: resetNewPassword,
        }),
      });
      const body = await res.json();

      if (!res.ok) {
        setResetError(body?.error ?? "Es ist ein Fehler aufgetreten");
        return;
      }

      setResetMessage(
        `Passwort geaendert. Neuer Wiederherstellungscode (nur jetzt sichtbar): ${body.recoveryCode}`
      );
    } catch {
      setResetError("Server nicht erreichbar");
    } finally {
      setResetSubmitting(false);
    }
  }

  if (recoveryCode && pendingUser) {
    return (
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
        <p className="text-sm text-black dark:text-zinc-50">
          Konto erstellt! Dein Wiederherstellungscode (nur jetzt sichtbar,
          bitte notieren):
        </p>
        <p className="rounded-lg bg-zinc-100 p-3 text-center font-mono text-lg font-semibold text-black dark:bg-zinc-800 dark:text-zinc-50">
          {recoveryCode}
        </p>
        <button
          type="button"
          onClick={() => onRegistered(pendingUser)}
          className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Weiter spielen
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
          htmlFor="username"
          className="text-sm font-medium text-black dark:text-zinc-50"
        >
          Benutzername
        </label>
        <input
          id="username"
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
          htmlFor="password"
          className="text-sm font-medium text-black dark:text-zinc-50"
        >
          Passwort
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="off"
          className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-black outline-none focus:border-black/30 dark:border-white/15 dark:text-zinc-50 dark:focus:border-white/40"
        />
        {/* Mini-Link direkt unter dem Passwortfeld, klappt das Reset-Mini-Formular auf/zu.
            Ein eigenes <form> geht hier nicht (kein Nesting von <form> in HTML erlaubt) --
            deshalb type="button" + eigener onClick-Handler statt Submit. */}
        <button
          type="button"
          onClick={() => setShowReset((v) => !v)}
          className="self-start text-xs text-black/60 underline hover:text-black dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          Passwort vergessen?
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
      >
        {submitting ? "…" : mode === "register" ? "Registrieren" : "Login"}
      </button>

      <button
        type="button"
        onClick={() => setMode(mode === "register" ? "login" : "register")}
        className="text-xs text-black/60 underline hover:text-black dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        {mode === "register"
          ? "Schon registriert? Einloggen"
          : "Noch kein Konto? Registrieren"}
      </button>

      {showReset && (
        <div className="flex flex-col gap-3 border-t border-black/10 pt-4 dark:border-white/10">
          <p className="text-sm font-medium text-black dark:text-zinc-50">
            Passwort zuruecksetzen
          </p>
          <input
            value={resetRecoveryCode}
            onChange={(e) => setResetRecoveryCode(e.target.value)}
            placeholder="Wiederherstellungscode"
            className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-black outline-none focus:border-black/30 dark:border-white/15 dark:text-zinc-50 dark:focus:border-white/40"
          />
          <input
            type="password"
            value={resetNewPassword}
            onChange={(e) => setResetNewPassword(e.target.value)}
            placeholder="Neues Passwort"
            className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-black outline-none focus:border-black/30 dark:border-white/15 dark:text-zinc-50 dark:focus:border-white/40"
          />
          {resetError && <p className="text-sm text-red-500">{resetError}</p>}
          {resetMessage && (
            <p className="text-sm text-green-600 dark:text-green-400">
              {resetMessage}
            </p>
          )}
          <button
            type="button"
            onClick={handleResetSubmit}
            disabled={resetSubmitting}
            className="rounded-full border border-black/10 px-5 py-2 text-sm font-medium text-black transition-colors hover:bg-black/5 disabled:opacity-50 dark:border-white/15 dark:text-zinc-50 dark:hover:bg-white/10"
          >
            {resetSubmitting ? "…" : "Passwort zuruecksetzen"}
          </button>
        </div>
      )}
    </form>
  );
}
