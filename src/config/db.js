// src/config/db.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://oscardailydo:12345@134.209.222.171:5432/dailydo',
  // Puedes agregar opciones adicionales, por ejemplo, ssl: { rejectUnauthorized: false } para producción.
});

module.exports = pool;
