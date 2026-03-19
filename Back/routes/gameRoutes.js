const express = require("express");
const router = express.Router();
const GameHistory = require("../models/GameHistory");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");
const { Op } = require("sequelize");

/* SAVE A NEW GAME RESULT */
router.post("/save", auth, async (req, res) => {
  try {
    const { attempts, won, secretCode, difficulty, username } = req.body;

    const newEntry = await GameHistory.create({
      attempts,
      won,
      secretCode,
      difficulty: difficulty ? difficulty.toLowerCase() : "easy",
      username,
      userId: req.auth.userId,
    });

    res.status(201).json({ message: "Game saved!", data: newEntry });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* GET USER HISTORY */
router.get("/my-history", auth, async (req, res) => {
  try {
    const history = await GameHistory.findAll({
      where: { userId: req.auth.userId },
      order: [["createdAt", "DESC"]],
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* GET LEADERBOARD */
router.get("/leaderboard/:difficulty", async (req, res) => {
  try {
    const { difficulty } = req.params;

    const winners = await GameHistory.findAll({
      where: {
        won: true,
        difficulty: difficulty.toLowerCase(),
      },
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
      order: [
        ["attempts", "ASC"],
        ["createdAt", "ASC"],
      ],
      limit: 10,
    });

    res.json(winners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
