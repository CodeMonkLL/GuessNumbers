"use client";

import { useState } from "react";
import type { User } from "@/lib/types";
import RegisterForm from "@/components/RegisterForm";
import LoginForm from "@/components/LoginForm";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";

type View = "register" | "login" | "forgot";

export default function AuthForm({
  onAuthenticated,
}: {
  onAuthenticated: (user: User) => void;
}) {
  const [view, setView] = useState<View>("register");
  // Remembers which view "Forgot password?" was opened from, so "Back"
  // returns there instead of always going to the register view.
  const [previousView, setPreviousView] = useState<"register" | "login">(
    "register"
  );
  const [forgotUsername, setForgotUsername] = useState("");

  function handleForgotPassword(from: "register" | "login", username: string) {
    setPreviousView(from);
    setForgotUsername(username);
    setView("forgot");
  }

  if (view === "forgot") {
    return (
      <ForgotPasswordForm
        initialUsername={forgotUsername}
        onBack={() => setView(previousView)}
      />
    );
  }

  if (view === "login") {
    return (
      <LoginForm
        onLoggedIn={onAuthenticated}
        onSwitchToRegister={() => setView("register")}
        onForgotPassword={(username) => handleForgotPassword("login", username)}
      />
    );
  }

  return (
    <RegisterForm
      onRegistered={onAuthenticated}
      onSwitchToLogin={() => setView("login")}
      onForgotPassword={(username) => handleForgotPassword("register", username)}
    />
  );
}
