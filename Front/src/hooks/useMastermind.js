import { useState } from "react";
import confetti from "canvas-confetti";

export const useMastermind = (ALL_POKEMON, saveGameCallback) => {
  const [secretCode, setSecretCode] = useState([]);
  const [attempts, setAttempts] = useState(Array(10).fill([null, null, null, null, null]));
  const [results, setResults] = useState(Array(10).fill([null, null, null, null, null]));
  const [currentRow, setCurrentRow] = useState(0);
  const [statusMessage, setStatusMessage] = useState("READY?");
  const [isGameOver, setIsGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState(null);

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
      // We pass secretCode to the callback so the API can save it
      saveGameCallback(true, currentRow, difficulty, secretCode);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        zIndex: 999,
      });
    } else if (currentRow === 9) {
      setStatusMessage("LOST!");
      setIsGameOver(true);
      saveGameCallback(false, currentRow, difficulty, secretCode);
    } else {
      setCurrentRow(currentRow + 1);
    }
  };

  return {
    secretCode, attempts, results, currentRow, statusMessage, 
    isGameOver, difficulty, setDifficulty, setStatusMessage,
    generateSecret, resetGame, selectPokemon, removePokemon, validateAttempt
  };
};