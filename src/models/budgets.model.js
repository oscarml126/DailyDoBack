const db = require("../config/db");

exports.getBudgets = async (userId) => {
  const result = await db.query('SELECT * FROM budgets WHERE user_id = $1', [userId]);
  return result.rows;
};

exports.createBudget = async ({ user_id, period, category, limit_amount }) => {
  const result = await db.query(
    'INSERT INTO budgets (user_id, period, category, limit_amount) VALUES ($1, $2, $3, $4) RETURNING *',
    [user_id, period, category, limit_amount]
  );
  return result.rows[0];
};

exports.updateBudget = async (id, data) => {
  const { period, category, limit_amount } = data;
  const result = await db.query(
    'UPDATE budgets SET period = $1, category = $2, limit_amount = $3 WHERE id = $4 RETURNING *',
    [period, category, limit_amount, id]
  );
  return result.rows[0];
};

exports.deleteBudget = async (id) => {
  await db.query('DELETE FROM budgets WHERE id = $1', [id]);
};
