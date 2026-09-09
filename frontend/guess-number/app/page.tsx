"use client";

import { useEffect, useState } from "react";
import Game from "@/components/Game";
import HighScores from "@/components/HighScores";
import UsernameForm from "@/components/UsernameForm";
import type { User } from "@/lib/types";

const STORAGE_KEY = "guess-number.user";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [highScoreRefreshKey, setHighScoreRefreshKey] = useState(0);

  useEffect(() => {
    let stored: User | null = null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) stored = JSON.parse(raw);
    } catch {
      // ignore malformed/unavailable storage
    }
    // Synchronizes client-only localStorage (unavailable during SSR) into state on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setUser(stored);
    setReady(true);
  }, []);

  function handleRegistered(newUser: User) {
    setUser(newUser);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    } catch {
      // ignore unavailable storage
    }
  }

  function handleSwitchUser() {
    setUser(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore unavailable storage
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-8 bg-zinc-50 px-4 py-16 font-sans dark:bg-black">
      <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
        🎱 Guess the Number
      </h1>

      {ready && (
        <>
          {user ? (
            <Game
              user={user}
              onSwitchUser={handleSwitchUser}
              onWin={() => setHighScoreRefreshKey((k) => k + 1)}
            />
          ) : (
            <UsernameForm onRegistered={handleRegistered} />
          )}
          <HighScores refreshKey={highScoreRefreshKey} />
        </>
      )}
    </div>
  );
}
