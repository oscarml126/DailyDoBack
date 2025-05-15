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
const setRecoveryCode = async (email, code, expiresAt) => {
  return db.query('UPDATE users SET recovery_code = $1, recovery_expires = $2 WHERE email = $3', 
      [code, expiresAt, email]);
};

const getUserByRecoveryCode = async (email, code) => {
  return db.query('SELECT * FROM users WHERE email = $1 AND recovery_code = $2', [email, code]);
};

const updatePassword = async (email, hashedPassword) => {
  return db.query('UPDATE users SET password = $1, recovery_code = NULL, recovery_expires = NULL WHERE email = $2', 
      [hashedPassword, email]);
};

module.exports = { createUser,setRecoveryCode,getUserByRecoveryCode,updatePassword };
