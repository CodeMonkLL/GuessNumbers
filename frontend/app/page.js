"use client";

import { useState } from "react";

export default function Page() {
  const [scores, setScores] = useState(null);
  const [error, setError] = useState(null);

  async function loadHighscores() {
    setError(null);
    setScores(null);
    try {
      const response = await fetch("/api/highscores");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setScores(await response.json());
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <main>
      <h1>Zahlenraten</h1>
      <button onClick={loadHighscores}>Highscores laden</button>
      {error && <p>Fehler: {error}</p>}
      {scores && (
        <ol>
          {scores.map((score) => (
            <li key={score.place}>
              {score.userName} - {score.attempts} Versuche
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
