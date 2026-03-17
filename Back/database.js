require('dotenv').config();
const { Sequelize } = require('sequelize');

// Database connection using MySQL
const sequelize = new Sequelize(
  process.env.DB_NAME,     
  process.env.DB_USER,    
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST, 
    dialect: 'mysql',
    logging: false
  }
);

module.exports = sequelize;