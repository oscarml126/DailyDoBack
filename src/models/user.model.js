const pool = require("../config/db");

const createUser = async (userData) => {
  const { username, name, lastname, email, password } = userData;
  const query = `
    INSERT INTO users (username, name, lastname, email, password)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, username, name, lastname, email, created_at
  `;
  const values = [username, name, lastname, email, password];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

module.exports = { createUser };
