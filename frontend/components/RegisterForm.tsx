"use client";

import { useEffect, useRef, useState } from "react";
import type { User } from "@/lib/types";
import {
  cardClass,
  errorClass,
  inputClass,
  labelClass,
  linkButtonClass,
  primaryButtonClass,
} from "@/components/formStyles";

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
  const [invalid, setInvalid] = useState({ username: false, password: false });
  const [submitting, setSubmitting] = useState(false);

  // After a successful registration, the recovery code is held here so it can be
  // shown to the user AND confirmed before continuing -- this is the only chance
  // they get to see it in plain text.
  const [recoveryCode, setRecoveryCode] = useState<string | null>(null);
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  // The form disappears on success; move focus to the new content so keyboard
  // and screen reader users aren't left on a removed element.
  useEffect(() => {
    if (recoveryCode) successHeadingRef.current?.focus();
  }, [recoveryCode]);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = username.trim();
    const missing = { username: !trimmed, password: !password };
    setInvalid(missing);
    if (missing.username || missing.password) {
      const names = [
        missing.username && "Username",
        missing.password && "Password",
      ].filter(Boolean);
      setError(`Please fill in: ${names.join(", ")}`);
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
      <section aria-labelledby="register-success-heading" className={cardClass}>
        <h2
          id="register-success-heading"
          ref={successHeadingRef}
          tabIndex={-1}
          className="text-lg text-center font-bold"
        >
          Account created!
        </h2>
        <p className="text-sm text-black dark:text-zinc-50">
          Your recovery code (visible only now, please write it down):
        </p>
        <p className="rounded-lg bg-zinc-100 p-3 text-center font-mono text-lg font-semibold text-black dark:bg-zinc-800 dark:text-zinc-50">
          {recoveryCode}
        </p>
        <button
          type="button"
          onClick={() => onRegistered(pendingUser)}
          className={primaryButtonClass}
        >
          Continue playing
        </button>
      </section>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby="register-heading"
      aria-busy={submitting}
      className={cardClass}
    >
      <h2 id="register-heading" className="text-lg text-center font-bold">
        Registration
      </h2>
      <div className="flex flex-col gap-1">
        <label htmlFor="register-username" className={labelClass}>
          Username
        </label>
        <input
          id="register-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="max_mustermann"
          autoComplete="username"
          required
          aria-invalid={invalid.username}
          aria-describedby={invalid.username ? "register-error" : undefined}
          className={inputClass}
          autoFocus
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="register-password" className={labelClass}>
          Password
        </label>
        <input
          id="register-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
          aria-invalid={invalid.password}
          aria-describedby={invalid.password ? "register-error" : undefined}
          className={inputClass}
        />
        <button
          type="button"
          onClick={() => onForgotPassword(username)}
          className={`self-start ${linkButtonClass}`}
        >
          Forgot password?
        </button>
      </div>

      <p id="register-error" role="alert" className={errorClass}>
        {error}
      </p>

      <button type="submit" disabled={submitting} className={primaryButtonClass}>
        {submitting ? "Registering…" : "Register"}
      </button>

      <button type="button" onClick={onSwitchToLogin} className={linkButtonClass}>
        Already registered? Log in
      </button>
    </form>
  );
}
