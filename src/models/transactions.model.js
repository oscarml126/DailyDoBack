const pool = require('../config/db');

const createTransaction = async ({ user_id, amount, type, category, description, date, imported, payment_method }) => {
  const query = `
    INSERT INTO transactions (user_id, amount, type, category, description, date, imported, payment_method)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;
  const values = [user_id, amount, type, category, description, date, imported, payment_method];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getTransactionsByUserId = async (user_id) => {
    const query = `
      SELECT *
      FROM transactions
      WHERE user_id = $1
        AND date >= date_trunc('month', CURRENT_DATE)
        AND date < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
      ORDER BY date DESC, id DESC;
    `;
    const { rows } = await pool.query(query, [user_id]);
    return rows;
  };  

const updateTransaction = async (id, updateData) => {
  const query = `
    UPDATE transactions
    SET amount = COALESCE($1, amount),
        type = COALESCE($2, type),
        category = COALESCE($3, category),
        description = COALESCE($4, description),
        date = COALESCE($5, date),
        payment_method = COALESCE($6, payment_method)
    WHERE id = $7
    RETURNING *
  `;
  const values = [
    updateData.amount,
    updateData.type,
    updateData.category,
    updateData.description,
    updateData.date,
    updateData.payment_method,
    id
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const deleteTransaction = async (id) => {
  await pool.query('DELETE FROM transactions WHERE id = $1', [id]);
};
const getTransactionsByUserIdAndDateRange = async (user_id, start_date, end_date) => {
  const query = `
    SELECT *
    FROM transactions
    WHERE user_id = $1
      AND date >= $2
      AND date <= $3
    ORDER BY date DESC;
  `;
  const { rows } = await pool.query(query, [user_id, start_date, end_date]);
  return rows;
};

const getTransactionById = async (id) => {
  const query = `SELECT * FROM transactions WHERE id = $1`;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

module.exports = { 
  createTransaction, 
  getTransactionsByUserId, 
  updateTransaction, 
  deleteTransaction,
  getTransactionsByUserIdAndDateRange,
  getTransactionById
};
