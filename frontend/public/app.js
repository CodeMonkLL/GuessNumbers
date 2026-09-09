const button = document.getElementById("load");
const scores = document.getElementById("scores");
const error = document.getElementById("error");

button.addEventListener("click", async () => {
  scores.innerHTML = "";
  error.textContent = "";

  try {
    const response = await fetch("/api/highscores");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    for (const score of await response.json()) {
      const item = document.createElement("li");
      item.textContent = `${score.userName} - ${score.attempts} Versuche`;
      scores.appendChild(item);
    }
  } catch (e) {
    error.textContent = `Fehler: ${e.message}`;
  }
});
