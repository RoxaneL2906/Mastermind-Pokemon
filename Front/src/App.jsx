import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import "./App.css";

import Auth from "./components/Auth";
import InfoScreen from "./components/InfoScreen";
import Board from "./components/Board";
import SelectionArea from "./components/SelectionArea";
import RulesModal from "./components/RulesModal";

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
  const [secretCode, setSecretCode] = useState([]);
  const [attempts, setAttempts] = useState(
    Array(10).fill([null, null, null, null, null]),
  );
  const [results, setResults] = useState(
    Array(10).fill([null, null, null, null, null]),
  );
  const [currentRow, setCurrentRow] = useState(0);
  const [statusMessage, setStatusMessage] = useState("READY?");
  const [isGameOver, setIsGameOver] = useState(false);

  /* NEW: STATS STATE */
  const [stats, setStats] = useState({ total: 0, wins: 0, lastAttempts: 0 });

  /* NEW: DIFFICULTY STATE */
  const [difficulty, setDifficulty] = useState(null);

  /* NEW: RULES STATE */
  const [showRules, setShowRules] = useState(true);

  /* GAME INITIALIZATION */
  const generateSecret = (mode = difficulty) => {
    // Allows duplicates in the secret code if hard, unique if easy
    if (!mode) return;
    let newSecret = [];
    if (mode === "easy") {
      newSecret = [...ALL_POKEMON].sort(() => Math.random() - 0.5).slice(0, 5);
    } else {
      newSecret = Array(5)
        .fill(null)
        .map(() => ALL_POKEMON[Math.floor(Math.random() * ALL_POKEMON.length)]);
    }
    setSecretCode(newSecret);
  };

  useEffect(() => {
    generateSecret();
    const savedUser = localStorage.getItem("pokedex_user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setIsOpen(true);
      fetchStats(parsedUser.token);
      resetGame();
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

    // Reset states immediately to avoid bleeding between accounts
    setStats({ total: 0, wins: 0, lastAttempts: 0 });
    resetGame();

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
          setStatusMessage("ACCOUNT CREATED! PLEASE LOGIN");
          setAuthMode("login");
          // Clear message after 3 seconds
          setTimeout(() => setStatusMessage("READY?"), 3000);
        } else {
          // Important: we use 'data' directly because 'user' state isn't updated yet
          localStorage.setItem("pokedex_user", JSON.stringify(data));
          setUser(data);
          setIsOpen(true);

          if (data.token) {
            await fetchStats(data.token);
          }
        }
      } else {
        // Handle incorrect credentials or existing user
        if (authMode === "login") {
          setStatusMessage("NAME OR PASSWORD INCORRECT");
        } else {
          setStatusMessage(data.error?.toUpperCase() || "AUTH FAILED");
        }
        // Clear error message after 3 seconds
        setTimeout(() => setStatusMessage("READY?"), 3000);
      }
    } catch (err) {
      console.error("Server error:", err);
      setStatusMessage("SERVER ERROR");
      setTimeout(() => setStatusMessage("READY?"), 3000);
    }
  };

  const logout = () => {
    localStorage.removeItem("pokedex_user");
    setUser(null);
    setIsOpen(false);
    setStats({ total: 0, wins: 0, lastAttempts: 0 });
    setFormData({ username: "", password: "" });
    resetGame();
  };

  /* DATA PERSISTENCE */
  const saveGame = async (wonStatus, finalRow) => {
    // Check local storage if state is not ready
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
        }),
      });
      if (response.ok) fetchStats(currentUser.token);
    } catch (err) {
      console.error("Failed to save game history:", err);
    }
  };

  /* GAMEPLAY LOGIC AND ACTIONS */
  const resetGame = () => {
    setDifficulty(null); // Reset difficulty selection
    setAttempts(Array(10).fill([null, null, null, null, null]));
    setResults(Array(10).fill([null, null, null, null, null]));
    setCurrentRow(0);
    setStatusMessage("READY?");
    setIsGameOver(false);
  };

  const selectPokemon = (name) => {
    if (isGameOver || !difficulty) return;
    const updated = [...attempts];
    const row = [...updated[currentRow]];
    const index = row.indexOf(null);
    if (index !== -1) {
      row[index] = name;
      updated[currentRow] = row;
      setAttempts(updated);
    }
  };

  const removePokemon = (slotIndex) => {
    if (isGameOver) return;
    const updated = [...attempts];
    const row = [...updated[currentRow]];
    row[slotIndex] = null;
    updated[currentRow] = row;
    setAttempts(updated);
  };

  const validateAttempt = () => {
    if (!difficulty) return;
    const current = attempts[currentRow];
    if (current.includes(null)) return;

    let remainingSecret = [...secretCode];
    let feedback = Array(5).fill("faux");

    current.forEach((p, i) => {
      if (p === secretCode[i]) {
        feedback[i] = "correct";
        remainingSecret[i] = null;
      }
    });

    current.forEach((p, i) => {
      if (feedback[i] !== "correct") {
        const foundIndex = remainingSecret.indexOf(p);
        if (foundIndex !== -1) {
          feedback[i] = "deplace";
          remainingSecret[foundIndex] = null;
        }
      }
    });

    const updatedResults = [...results];
    updatedResults[currentRow] = feedback;
    setResults(updatedResults);

    if (feedback.every((s) => s === "correct")) {
      setStatusMessage("WINNER!");
      setIsGameOver(true);
      saveGame(true, currentRow);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        zIndex: 999,
      });
    } else if (currentRow === 9) {
      setStatusMessage("LOST!");
      setIsGameOver(true);
      saveGame(false, currentRow);
    } else {
      setCurrentRow(currentRow + 1);
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
      </div>

      {!isOpen ? (
        <Auth
          authMode={authMode}
          setAuthMode={setAuthMode}
          setFormData={setFormData}
          formData={formData}
          auth={auth}
          statusMessage={statusMessage}
        />
      ) : (
        <div className="app-container">
          <div className="pokedex-left">
            <InfoScreen
              user={user}
              isGameOver={isGameOver}
              stats={stats}
              statusMessage={statusMessage}
              secretCode={secretCode}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              generateSecret={generateSecret}
              attempts={attempts}
            />
            <button className="check-button" onClick={validateAttempt}>
              CHECK
            </button>
            <button className="reset-button" onClick={resetGame}>
              RESET
            </button>
          </div>
          <div className="hinge"></div>
          <div className="pokedex-right">
            <Board
              attempts={attempts}
              results={results}
              currentRow={currentRow}
              removePokemon={removePokemon}
            />
            <SelectionArea
              ALL_POKEMON={ALL_POKEMON}
              selectPokemon={selectPokemon}
            />
          </div>
        </div>
      )}
      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
    </div>
  );
}

export default App;
