const Sequelize = require('sequelize');
require('dotenv').config();

// Determine if we are in production
const isProduction = process.env.NODE_ENV === 'production';

const sequelize = new Sequelize(
  process.env.DB_NAME,      // Database Name
  process.env.DB_USERNAME,  // Username
  process.env.DB_PASSWORD,  // Password
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false, // Turn off SQL logs to keep Railway logs clean
    dialectOptions: isProduction ? {
      ssl: {
        require: true,
        rejectUnauthorized: false // Required for Railway/Cloud DBs
      }
    } : {} // No SSL for localhost
  }
);

module.exports = sequelize;