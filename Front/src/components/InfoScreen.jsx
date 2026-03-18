import './InfoScreen.css';

function InfoScreen({ user, isGameOver, stats, statusMessage, secretCode }) {
  return (
    <div className="info-screen">
      <h3>{user?.username ? user.username.toUpperCase() : "TRAINER"}</h3>
      {!isGameOver ? (
        <div className="stats-display">
          <p>
            WINS: {stats.wins} / {stats.total}
          </p>
          <p>
            RATIO:{" "}
            {stats.total > 0 ? Math.round((stats.wins / stats.total) * 100) : 0}
            %
          </p>
          <p>
            LAST:{" "}
            {stats.lastAttempts > 0 ? `${stats.lastAttempts} ATTEMPTS` : "N/A"}
          </p>
        </div>
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
