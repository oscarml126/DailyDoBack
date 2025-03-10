const pool = require('../config/db');

const createTransaction = async ({ user_id, amount, type, category, description, date, imported }) => {
  const query = `
    INSERT INTO transactions (user_id, amount, type, category, description, date, imported)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;
  const values = [user_id, amount, type, category, description, date, imported];
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
      ORDER BY date DESC;
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
        imported = COALESCE($6, imported),
        updated_date = COALESCE($7, updated_date)
    WHERE id = $8
    RETURNING *
  `;
  const values = [
    updateData.amount,
    updateData.type,
    updateData.category,
    updateData.description,
    updateData.date,
    updateData.imported,
    updateData.updated_date,
    id
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const deleteTransaction = async (id) => {
  await pool.query('DELETE FROM transactions WHERE id = $1', [id]);
};

module.exports = { 
  createTransaction, 
  getTransactionsByUserId, 
  updateTransaction, 
  deleteTransaction 
};
