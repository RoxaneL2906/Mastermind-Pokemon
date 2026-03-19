const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const GameHistory = sequelize.define("GameHistory", {
  // Number of attempts used (1 to 10)
  attempts: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  won: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  secretCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  difficulty: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "easy",
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = GameHistory;
