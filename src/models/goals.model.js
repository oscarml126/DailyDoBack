const db = require("../config/db");

exports.getGoals = async (userId) => {
  const result = await db.query('SELECT * FROM goals WHERE user_id = $1', [userId]);
  return result.rows;
};

exports.createGoal = async ({ user_id, description, target_amount, due_date }) => {
  const result = await db.query(
    'INSERT INTO goals (user_id, description, target_amount, due_date) VALUES ($1, $2, $3, $4) RETURNING *',
    [user_id, description, target_amount, due_date]
  );
  return result.rows[0];
};

exports.updateGoal = async (id, data) => {
  const { description, target_amount, current_progress, due_date } = data;
  const result = await db.query(
    'UPDATE goals SET description = $1, target_amount = $2, current_progress = $3, due_date = $4 WHERE id = $5 RETURNING *',
    [description, target_amount, current_progress, due_date, id]
  );
  return result.rows[0];
};

exports.deleteGoal = async (id) => {
  await db.query('DELETE FROM goals WHERE id = $1', [id]);
};
