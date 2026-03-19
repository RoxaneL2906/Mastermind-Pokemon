import { useState, useEffect } from "react";
import "./App.css";

// Import custom hook
import { useMastermind } from "./hooks/useMastermind";

import Auth from "./components/Auth";
import InfoScreen from "./components/InfoScreen";
import Board from "./components/Board";
import SelectionArea from "./components/SelectionArea";
import RulesModal from "./components/RulesModal";
import Leaderboard from "./components/Leaderboard";

const ALL_POKEMON = [
  "Evoli",
  "Aquali",
  "Voltali",
  "Pyroli",
  "Mentali",
  "Noctali",
  "Phyllali",
  "Givrali",
];

function App() {
  /* STATE MANAGEMENT */
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [formData, setFormData] = useState({ username: "", password: "" });

  /* NEW: STATS STATE */
  const [stats, setStats] = useState({ total: 0, wins: 0, lastAttempts: 0 });

  /* NEW: RULES STATE */
  const [showRules, setShowRules] = useState(true);

  /* NEW: LEADERBOARD STATE */
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Use our custom hook for game logic
  const game = useMastermind(ALL_POKEMON, (won, row, diff, code) =>
    saveGame(won, row, diff, code),
  );

  useEffect(() => {
    const savedUser = localStorage.getItem("pokedex_user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setIsOpen(true);
      fetchStats(parsedUser.token);
      game.resetGame();
    }
  }, []);

  /* STATS SERVICES */
  const fetchStats = async (token) => {
    if (!token) return;
    try {
      const response = await fetch(
        "http://localhost:3333/api/game/my-history",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        const wins = data.filter((g) => g.won).length;
        const lastGame = data.length > 0 ? data[0] : null;
        setStats({
          total: data.length,
          wins: wins,
          lastAttempts: lastGame ? lastGame.attempts : 0,
        });
      } else {
        setStats({ total: 0, wins: 0, lastAttempts: 0 });
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
      setStats({ total: 0, wins: 0, lastAttempts: 0 });
    }
  };

  /* AUTHENTICATION SERVICES */
  const auth = async () => {
    if (!formData.username || !formData.password) return;
    setStats({ total: 0, wins: 0, lastAttempts: 0 });
    game.resetGame();

    try {
      const endpoint = authMode === "login" ? "login" : "register";
      const response = await fetch(
        `http://localhost:3333/api/auth/${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );
      const data = await response.json();

      if (response.ok) {
        if (authMode === "register") {
          game.setStatusMessage("ACCOUNT CREATED! PLEASE LOGIN");
          setAuthMode("login");
          setTimeout(() => game.setStatusMessage("READY?"), 3000);
        } else {
          localStorage.setItem("pokedex_user", JSON.stringify(data));
          setUser(data);
          setIsOpen(true);
          if (data.token) await fetchStats(data.token);
        }
      } else {
        if (authMode === "login") {
          game.setStatusMessage("NAME OR PASSWORD INCORRECT");
        } else {
          game.setStatusMessage(data.error?.toUpperCase() || "AUTH FAILED");
        }
        setTimeout(() => game.setStatusMessage("READY?"), 3000);
      }
    } catch (err) {
      console.error("Server error:", err);
      game.setStatusMessage("SERVER ERROR");
      setTimeout(() => game.setStatusMessage("READY?"), 3000);
    }
  };

  const logout = () => {
    localStorage.removeItem("pokedex_user");
    setUser(null);
    setIsOpen(false);
    setStats({ total: 0, wins: 0, lastAttempts: 0 });
    setFormData({ username: "", password: "" });
    game.resetGame();
  };

  /* DATA PERSISTENCE */
  const saveGame = async (
    wonStatus,
    finalRow,
    currentDifficulty,
    secretCode,
  ) => {
    const currentUser =
      user || JSON.parse(localStorage.getItem("pokedex_user"));
    if (!currentUser || !currentUser.token) return;

    try {
      const response = await fetch("http://localhost:3333/api/game/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({
          attempts: finalRow + 1,
          won: wonStatus,
          secretCode: JSON.stringify(secretCode),
          difficulty: currentDifficulty,
          username: currentUser.username,
        }),
      });
      if (response.ok) fetchStats(currentUser.token);
    } catch (err) {
      console.error("Failed to save game history:", err);
    }
  };

  return (
    <div className={`pokedex-shell ${isOpen ? "open" : ""}`}>
      <div className="pokedex-top-decoration">
        <div
          className={`big-blue-button ${isOpen ? "clickable" : ""}`}
          onClick={isOpen ? logout : null}
        >
          {isOpen && <span className="logout-icon">⏻</span>}
        </div>
        <div className="small-leds">
          <div className="led red"></div>
          <div className="led yellow"></div>
          <div className="led green"></div>
          <div className="led info-btn" onClick={() => setShowRules(true)}>
            i
          </div>
        </div>
        <div
          className="leaderboard-trigger-big"
          onClick={() => setShowLeaderboard(true)}
        >
          👑
        </div>
      </div>

      {!isOpen ? (
        <Auth
          authMode={authMode}
          setAuthMode={setAuthMode}
          setFormData={setFormData}
          formData={formData}
          auth={auth}
          statusMessage={game.statusMessage}
        />
      ) : (
        <div className="app-container">
          <div className="pokedex-left">
            <InfoScreen
              user={user}
              isGameOver={game.isGameOver}
              stats={stats}
              statusMessage={game.statusMessage}
              secretCode={game.secretCode}
              difficulty={game.difficulty}
              setDifficulty={game.setDifficulty}
              generateSecret={game.generateSecret}
              attempts={game.attempts}
            />
            <button className="check-button" onClick={game.validateAttempt}>
              CHECK
            </button>
            <button className="reset-button" onClick={game.resetGame}>
              RESET
            </button>
          </div>
          <div className="hinge"></div>
          <div className="pokedex-right">
            <Board
              attempts={game.attempts}
              results={game.results}
              currentRow={game.currentRow}
              removePokemon={game.removePokemon}
            />
            <SelectionArea
              ALL_POKEMON={ALL_POKEMON}
              selectPokemon={game.selectPokemon}
            />
          </div>
        </div>
      )}
      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
      {showLeaderboard && (
        <Leaderboard onClose={() => setShowLeaderboard(false)} />
      )}
    </div>
  );
}

export default App;
