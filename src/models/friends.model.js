const pool = require('../config/db');

const sendRequest = async (fromUserId, toUserEmail) => {
  const userQuery = `SELECT id FROM users WHERE email = $1 OR username = $1 LIMIT 1`;
  const { rows } = await pool.query(userQuery, [toUserEmail]);
  const user = rows[0];
  if (!user) throw new Error('Usuario no encontrado');
  if (user.id === fromUserId) throw new Error('No puedes agregarte a ti mismo');

  const checkQuery = `
    SELECT id, status FROM friends
    WHERE (from_user_id = $1 AND to_user_id = $2)
       OR (from_user_id = $2 AND to_user_id = $1)
    LIMIT 1`;
  const existing = await pool.query(checkQuery, [fromUserId, user.id]);

  if (existing.rows.length > 0) {
    const friend = existing.rows[0];

    if (friend.status === 'pending') {
      throw new Error('Ya existe una solicitud pendiente');
    }
    if (friend.status === 'accepted') {
      throw new Error('Ya son amigos');
    }
    if (friend.status === 'rejected') {
      // ⚠️ Si fue rechazada, actualizamos a pending
      await pool.query(`UPDATE friends SET status = 'pending' WHERE id = $1`, [friend.id]);
      return;
    }

    throw new Error('Estado de solicitud desconocido');
  }

  // 🆕 Si no existía relación, insertamos nueva solicitud
  await pool.query(`
    INSERT INTO friends (from_user_id, to_user_id, status)
    VALUES ($1, $2, 'pending')`, [fromUserId, user.id]);
};

const respondRequest = async (requestId, status) => {
  await pool.query(`UPDATE friends SET status = $1 WHERE id = $2`, [status, requestId]);
};

const getFriendsList = async (userId) => {
  const query = `
    SELECT 
      f.id, 
      u.username, 
      u.name, 
      u.lastname, 
      f.status,
      f.to_user_id
    FROM friends f
    JOIN users u 
      ON (
        (u.id = f.to_user_id AND f.from_user_id = $1)
        OR 
        (u.id = f.from_user_id AND f.to_user_id = $1)
      )
    WHERE f.status = 'accepted'
  `;
  const { rows } = await pool.query(query, [userId]);
   return rows;
};
const getPendingRequests = async (userId) => {
  const query = `
     SELECT 
      f.id, 
      u.username, 
      u.name, 
      u.lastname, 
      f.status
    FROM friends f
    JOIN users u ON u.id = f.from_user_id
    WHERE f.to_user_id = $1 AND f.status = 'pending'
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows;
};

module.exports = {
  sendRequest,
  respondRequest,
  getFriendsList,
  getPendingRequests
};