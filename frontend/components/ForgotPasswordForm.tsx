"use client";

import { useEffect, useRef, useState } from "react";
import {
  cardClass,
  errorClass,
  hintClass,
  inputClass,
  labelClass,
  linkButtonClass,
  primaryButtonClass,
} from "@/components/formStyles";

type Field = "username" | "recoveryCode" | "newPassword";

const FIELD_LABELS: Record<Field, string> = {
  username: "Username",
  recoveryCode: "Recovery code",
  newPassword: "New password",
};

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
  const [invalid, setInvalid] = useState<Record<Field, boolean>>({
    username: false,
    recoveryCode: false,
    newPassword: false,
  });
  const [newRecoveryCode, setNewRecoveryCode] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (newRecoveryCode) successHeadingRef.current?.focus();
  }, [newRecoveryCode]);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = username.trim();
    const missing: Record<Field, boolean> = {
      username: !trimmed,
      recoveryCode: !recoveryCode,
      newPassword: !newPassword,
    };
    setInvalid(missing);
    const missingNames = (Object.keys(missing) as Field[])
      .filter((f) => missing[f])
      .map((f) => FIELD_LABELS[f]);
    if (missingNames.length > 0) {
      setError(`Please fill in: ${missingNames.join(", ")}`);
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

  function describedBy(field: Field, extra?: string) {
    const ids = [extra, invalid[field] ? "forgot-error" : undefined].filter(Boolean);
    return ids.length ? ids.join(" ") : undefined;
  }

  if (newRecoveryCode) {
    return (
      <section aria-labelledby="forgot-success-heading" className={cardClass}>
        <h2
          id="forgot-success-heading"
          ref={successHeadingRef}
          tabIndex={-1}
          className="text-lg text-center font-bold"
        >
          Password changed!
        </h2>
        <p className="text-sm text-black dark:text-zinc-50">
          Your new recovery code (visible only now, please write it down):
        </p>
        <p className="rounded-lg bg-zinc-100 p-3 text-center font-mono text-lg font-semibold text-black dark:bg-zinc-800 dark:text-zinc-50">
          {newRecoveryCode}
        </p>
        <button type="button" onClick={onBack} className={primaryButtonClass}>
          Go to login
        </button>
      </section>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby="forgot-heading"
      aria-busy={submitting}
      className={cardClass}
    >
      <h2 id="forgot-heading" className="text-lg text-center font-bold">
        Reset password
      </h2>

      <div className="flex flex-col gap-1">
        <label htmlFor="forgot-username" className={labelClass}>
          Username
        </label>
        <input
          id="forgot-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="max_mustermann"
          autoComplete="username"
          required
          aria-invalid={invalid.username}
          aria-describedby={describedBy("username")}
          className={inputClass}
          autoFocus
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="forgot-recovery-code" className={labelClass}>
          Recovery code
        </label>
        <input
          id="forgot-recovery-code"
          value={recoveryCode}
          onChange={(e) => setRecoveryCode(e.target.value)}
          autoComplete="off"
          spellCheck={false}
          required
          aria-invalid={invalid.recoveryCode}
          aria-describedby={describedBy("recoveryCode", "forgot-recovery-hint")}
          className={inputClass}
        />
        <p id="forgot-recovery-hint" className={hintClass}>
          The code you were shown when you registered or last reset your password.
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="forgot-new-password" className={labelClass}>
          New password
        </label>
        <input
          id="forgot-new-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="new-password"
          required
          aria-invalid={invalid.newPassword}
          aria-describedby={describedBy("newPassword")}
          className={inputClass}
        />
      </div>

      <p id="forgot-error" role="alert" className={errorClass}>
        {error}
      </p>

      <button type="submit" disabled={submitting} className={primaryButtonClass}>
        {submitting ? "Resetting…" : "Reset password"}
      </button>

      <button type="button" onClick={onBack} className={linkButtonClass}>
        Back
      </button>
    </form>
  );
}
