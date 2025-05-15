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
  const query = `
    UPDATE users 
    SET recovery_code = $1, recovery_expires = $2 
    WHERE email = $3 
    RETURNING id, email, recovery_code, recovery_expires;
  `;
  const values = [code, expiresAt, email];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getUserByRecoveryCode = async (email, code) => {
  const query = `
    SELECT id, username, name, lastname, email, recovery_expires 
    FROM users 
    WHERE email = $1 AND recovery_code = $2;
  `;
  const values = [email, code];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const updatePassword = async (email, hashedPassword) => {
  const query = `
    UPDATE users 
    SET password = $1, recovery_code = NULL, recovery_expires = NULL 
    WHERE email = $2 
    RETURNING id, email, updated_at;
  `;
  const values = [hashedPassword, email];
  const { rows } = await pool.query(query, values);
  return rows[0];
};


module.exports = { createUser,setRecoveryCode,getUserByRecoveryCode,updatePassword };
