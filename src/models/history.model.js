const pool = require('../config/db');

const upsertHistory = async (historyData) => {
  const { username, date, tasks } = historyData;
  const query = `
    INSERT INTO history (username, date, tasks)
    VALUES ($1, $2, $3::jsonb)
    ON CONFLICT (username, date)
    DO UPDATE SET tasks = $3::jsonb
    RETURNING *
  `;
  const values = [username, date, JSON.stringify(tasks)];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getHistoryByUsername = async (username) => {
  const query = `SELECT * FROM history WHERE username = $1 ORDER BY date DESC`;
  const { rows } = await pool.query(query, [username]);
  return rows;
};

module.exports = { upsertHistory, getHistoryByUsername };
