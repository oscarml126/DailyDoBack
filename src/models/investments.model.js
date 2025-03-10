const db = require("../config/db");

exports.getAllInvestments = async (userId) => {
  const result = await db.query(
    'SELECT * FROM investments WHERE user_id = $1 ORDER BY purchase_date DESC',
    [userId]
  );
  return result.rows;
};

exports.createInvestment = async ({ user_id, type, asset_name, quantity, purchase_price, current_price, purchase_date }) => {
  const result = await db.query(
    'INSERT INTO investments (user_id, type, asset_name, quantity, purchase_price, current_price, purchase_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [user_id, type, asset_name, quantity, purchase_price, current_price, purchase_date]
  );
  return result.rows[0];
};

exports.updateInvestment = async (id, data) => {
  const { type, asset_name, quantity, purchase_price, current_price, purchase_date } = data;
  const result = await db.query(
    'UPDATE investments SET type = $1, asset_name = $2, quantity = $3, purchase_price = $4, current_price = $5, purchase_date = $6, last_update = NOW() WHERE id = $7 RETURNING *',
    [type, asset_name, quantity, purchase_price, current_price, purchase_date, id]
  );
  return result.rows[0];
};

exports.deleteInvestment = async (id) => {
  await db.query('DELETE FROM investments WHERE id = $1', [id]);
};
