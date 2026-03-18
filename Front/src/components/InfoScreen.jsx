import "./InfoScreen.css";

function InfoScreen({
  user,
  isGameOver,
  stats,
  statusMessage,
  secretCode,
  difficulty,
  setDifficulty,
  generateSecret,
  attempts,
}) {
  // Check if any pokemon has been placed in the first row
  const gameStarted = attempts[0].some((slot) => slot !== null);

  const handleDifficultyChange = (mode) => {
    if (isGameOver || gameStarted) return;
    setDifficulty(mode);
    generateSecret(mode);
  };

  return (
    <div className="info-screen">
      <h3>{user?.username ? user.username.toUpperCase() : "TRAINER"}</h3>
      {!isGameOver ? (
        <>
          <div className="stats-display">
            <p>
              WINS: {stats.wins} / {stats.total}
            </p>
            <p>
              RATIO:{" "}
              {stats.total > 0
                ? Math.round((stats.wins / stats.total) * 100)
                : 0}
              %
            </p>
            <p>
              LAST:{" "}
              {stats.lastAttempts > 0
                ? `${stats.lastAttempts} ATTEMPTS`
                : "N/A"}
            </p>
          </div>

          <div className="difficulty-zone">
            <p className="select-label">
              {gameStarted ? "MODE LOCKED" : "CHOOSE DIFFICULTY"}
            </p>
            <div className="difficulty-selector">
              <button
                className={`diff-btn ${difficulty === "easy" ? "active" : ""} ${
                  gameStarted ? "disabled" : ""
                }`}
                onClick={() => handleDifficultyChange("easy")}
                disabled={gameStarted}
              >
                EASY
              </button>
              <button
                className={`diff-btn ${difficulty === "hard" ? "active" : ""} ${
                  gameStarted ? "disabled" : ""
                }`}
                onClick={() => handleDifficultyChange("hard")}
                disabled={gameStarted}
              >
                HARD
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="game-over-zone">
          <div className="status-big">{statusMessage}</div>
          <div className="reveal-box">
            <p>THE CODE WAS:</p>
            <div className="solution-icons">
              {secretCode.map((p, i) => (
                <img key={i} src={`/${p}.png`} alt={p} className="mini-poke" />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InfoScreen;
