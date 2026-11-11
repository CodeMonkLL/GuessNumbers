"use client";

import { useState } from "react";
import type { User } from "@/lib/types";
import {
  cardClass,
  errorClass,
  inputClass,
  labelClass,
  linkButtonClass,
  primaryButtonClass,
} from "@/components/formStyles";

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
  const [invalid, setInvalid] = useState({ username: false, password: false });
  const [submitting, setSubmitting] = useState(false);

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
      noValidate
      aria-labelledby="login-heading"
      aria-busy={submitting}
      className={cardClass}
    >
      <h2 id="login-heading" className="text-lg text-center font-bold">
        Login
      </h2>
      <div className="flex flex-col gap-1">
        <label htmlFor="login-username" className={labelClass}>
          Username
        </label>
        <input
          id="login-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="max_mustermann"
          autoComplete="username"
          required
          aria-invalid={invalid.username}
          aria-describedby={invalid.username ? "login-error" : undefined}
          className={inputClass}
          autoFocus
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="login-password" className={labelClass}>
          Password
        </label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          aria-invalid={invalid.password}
          aria-describedby={invalid.password ? "login-error" : undefined}
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

      <p id="login-error" role="alert" className={errorClass}>
        {error}
      </p>

      <button type="submit" disabled={submitting} className={primaryButtonClass}>
        {submitting ? "Logging in…" : "Login"}
      </button>

      <button type="button" onClick={onSwitchToRegister} className={linkButtonClass}>
        No account yet? Register
      </button>
    </form>
  );
}
