const db = require('../config/db');

exports.getAllLists = async (userId) => {
  try {
    const query = `
      SELECT * FROM lists
      WHERE participants @> $1::int[]
      ORDER BY id DESC
    `;
    const { rows } = await db.query(query, [[parseInt(userId)]]); // importante: doble array y parseInt
    return rows;
  } catch (error) {
    console.error('Error al obtener listas por participante:', error.message || error);
    throw new Error('Error al obtener listas');
  }
};

exports.getListById = async (id) => {
  const listResult = await db.query('SELECT * FROM lists WHERE id = $1', [id]);
  if (listResult.rows.length === 0) throw new Error('Lista no encontrada');
  const itemsResult = await db.query('SELECT * FROM list_items WHERE list_id = $1 AND active = true ORDER BY id', [id]);
  return { ...listResult.rows[0], items: itemsResult.rows };
};

exports.createList = async ({ title, description, color, items, userId, participants, username }) => {
  const listResult = await db.query(
    'INSERT INTO lists (title, description, color, user_id, participants, username, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *',
    [title, description, color, userId, participants, username] // ✅ Ahora hay 6 valores para 6 placeholders
  );
  console.log("llega aqui")
  const list = listResult.rows[0];
  if (items && items.length > 0) {
    for (const item of items) {
      await db.query(
        'INSERT INTO list_items (list_id, option, is_checked) VALUES ($1, $2, $3)',
        [list.id, item.option, item.is_checked || false]
      );
    }
  }
  return list;
};

exports.updateList = async (id, { title, description, color, participants }) => {
  const result = await db.query(
    'UPDATE lists SET title = $1, description = $2, color = $3, participants = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
    [title, description, color, participants, id]
  );
  return result.rows[0];
};

exports.deleteList = async (id) => {
  await db.query('DELETE FROM lists WHERE id = $1', [id]);
};

exports.getActiveItems = async (listId) => {
  const itemsResult = await db.query('SELECT * FROM list_items WHERE list_id = $1 AND active = true ORDER BY id', [listId]);
  return itemsResult.rows;
};

exports.createListItem = async (listId, { option, is_checked }) => {
  const result = await db.query('INSERT INTO list_items (list_id, option, is_checked) VALUES ($1, $2, $3) RETURNING *', [listId, option, is_checked]);
  return result.rows[0];
};

exports.updateListItem = async (listId, itemId, { option, is_checked }) => {
  const result = await db.query(
    'UPDATE list_items SET option = COALESCE($1, option), is_checked = COALESCE($2, is_checked) WHERE id = $3 AND list_id = $4 RETURNING *',
    [option, is_checked, itemId, listId]
  );
  return result.rows[0];
};

exports.deleteListItem = async (listId, itemId) => {
  const result = await db.query('UPDATE list_items SET active = false WHERE id = $1 AND list_id = $2 RETURNING *', [itemId, listId]);
  return result.rows[0];
};
