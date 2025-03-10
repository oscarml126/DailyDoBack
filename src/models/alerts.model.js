const db = require("../config/db");

exports.getAlerts = async (userId) => {
  const result = await db.query(
    'SELECT * FROM alerts WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
};

exports.createAlert = async ({ user_id, type, message }) => {
  const result = await db.query(
    'INSERT INTO alerts (user_id, type, message) VALUES ($1, $2, $3) RETURNING *',
    [user_id, type, message]
  );
  return result.rows[0];
};

exports.updateAlert = async (id, data) => {
  const { read } = data;
  const result = await db.query(
    'UPDATE alerts SET read = $1 WHERE id = $2 RETURNING *',
    [read, id]
  );
  return result.rows[0];
};
