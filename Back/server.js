const express = require('express');
const cors = require('cors');
const sequelize = require('./database');

/* ROUTES IMPORTS */
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');

/* MODELS IMPORTS */
const User = require('./models/User');
const GameHistory = require('./models/GameHistory');

const app = express();

/* DATABASE RELATIONS */
User.hasMany(GameHistory, { foreignKey: 'userId', onDelete: 'CASCADE' });
GameHistory.belongsTo(User, { foreignKey: 'userId' });

/* MIDDLEWARES */
app.use(cors());
app.use(express.json()); 

/* ROUTES MOUNTING */
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes); 

/* HEALTH CHECK */
app.get('/', (req, res) => {
    res.send("The Pokémon Server is ready and connected to MySQL!");
});

/* SERVER CONFIGURATION */
const PORT = process.env.PORT || 3333;

/**
 * DATABASE SYNC & START
 * { alter: true } will update your MySQL tables if you change your models
 * without deleting existing data.
 */
sequelize.sync({ alter: true })
    .then(() => {
        console.log("Database synchronized with MySQL.");
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Unable to connect to MySQL:", err.message);
    });