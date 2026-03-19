const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: "username"
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = User;