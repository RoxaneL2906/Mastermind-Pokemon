import { useState, useEffect } from "react";
import "./Leaderboard.css";

function Leaderboard({ onClose }) {
  const [list, setList] = useState([]);
  const [mode, setMode] = useState("hard");

  useEffect(() => {
    fetch(`http://localhost:3333/api/game/leaderboard/${mode}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setList(data);
        } else {
          setList([]);
        }
      })
      .catch((err) => console.error(err));
  }, [mode]);

  return (
    <div className="modal-overlay">
      <div className="modal-content leaderboard-content">
        <h2 className="crown-title">👑 TOP TRAINERS 👑</h2>

        <div className="leaderboard-tabs">
          <button
            className={mode === "easy" ? "active" : ""}
            onClick={() => setMode("easy")}
          >
            EASY
          </button>
          <button
            className={mode === "hard" ? "active" : ""}
            onClick={() => setMode("hard")}
          >
            HARD
          </button>
        </div>

        <div className="leaderboard-table">
          <div className="table-header">
            <span>RANK</span>
            <span>TRAINER</span>
            <span>TRIES</span>
            <span>DATE</span>
          </div>
          {list.map((entry, index) => (
            <div key={entry.id || index} className="table-row">
              <span className="rank">#{index + 1}</span>
              <span className="username">
                {entry.username ||
                  (entry.User && entry.User.username) ||
                  "Trainer"}
              </span>
              <span className="attempts">{entry.attempts}</span>
              <span className="date">
                {new Date(entry.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
          {list.length === 0 && <p className="no-data">No champions yet...</p>}
        </div>

        <button className="close-rules" onClick={onClose}>
          CLOSE
        </button>
      </div>
    </div>
  );
}

export default Leaderboard;
