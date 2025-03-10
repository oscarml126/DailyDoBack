const db = require('../config/db');

exports.getAllTransactions = async (userId) => {
  const result = await db.query(
    'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC',
    [userId]
  );
  return result.rows;
};

exports.createTransaction = async ({ user_id, amount, type, category, description, date, imported }) => {
  const result = await db.query(
    'INSERT INTO transactions (user_id, amount, type, category, description, date, imported) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [user_id, amount, type, category, description, date, imported]
  );
  return result.rows[0];
};

exports.updateTransaction = async (id, data) => {
  const { amount, type, category, description, date, imported } = data;
  const result = await db.query(
    'UPDATE transactions SET amount = $1, type = $2, category = $3, description = $4, date = $5, imported = $6 WHERE id = $7 RETURNING *',
    [amount, type, category, description, date, imported, id]
  );
  return result.rows[0];
};

exports.deleteTransaction = async (id) => {
  await db.query('DELETE FROM transactions WHERE id = $1', [id]);
};
