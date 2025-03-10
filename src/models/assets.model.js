const db = require('../config/db');

exports.getAllAssets = async (userId) => {
  const result = await db.query(
    'SELECT * FROM assets WHERE user_id = $1 ORDER BY acquisition_date DESC',
    [userId]
  );
  return result.rows;
};

exports.createAsset = async ({ user_id, type, description, value, acquisition_date }) => {
  const result = await db.query(
    'INSERT INTO assets (user_id, type, description, value, acquisition_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [user_id, type, description, value, acquisition_date]
  );
  return result.rows[0];
};

exports.updateAsset = async (id, data) => {
  const { type, description, value, acquisition_date } = data;
  const result = await db.query(
    'UPDATE assets SET type = $1, description = $2, value = $3, acquisition_date = $4 WHERE id = $5 RETURNING *',
    [type, description, value, acquisition_date, id]
  );
  return result.rows[0];
};

exports.deleteAsset = async (id) => {
  await db.query('DELETE FROM assets WHERE id = $1', [id]);
};
