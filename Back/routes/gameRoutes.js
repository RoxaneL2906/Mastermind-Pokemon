const express = require('express');
const router = express.Router();
const GameHistory = require('../models/GameHistory');
const auth = require('../middleware/authMiddleware'); 

/* SAVE A NEW GAME RESULT */
router.post('/save', auth, async (req, res) => {
  try {
    const { attempts, won, secretCode } = req.body;
    
    const newEntry = await GameHistory.create({
      attempts,
      won,
      secretCode,
      userId: req.auth.userId
    });

    res.status(201).json({ message: "Game saved!", data: newEntry });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* GET USER HISTORY */
router.get('/my-history', auth, async (req, res) => {
  try {
    const history = await GameHistory.findAll({
      where: { userId: req.auth.userId },
      order: [['createdAt', 'DESC']] 
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;