const db = require('../config/db');

exports.getAllLists = async (username) => {
  try {
    const query = 'SELECT * FROM lists WHERE username = $1 ORDER BY id DESC';
    const { rows } = await db.query(query, [username]);
    return rows;
  } catch (error) {
    console.error('Error al obtener las listas para username:', username, error);
    throw error;
  }
};


exports.getListById = async (id) => {
  // Traer solo los items activos
  const listResult = await db.query('SELECT * FROM lists WHERE id = $1', [id]);
  if (listResult.rows.length === 0) {
    throw new Error('Lista no encontrada');
  }
  const itemsResult = await db.query('SELECT * FROM list_items WHERE list_id = $1 AND active = true ORDER BY id', [id]);
  return { ...listResult.rows[0], items: itemsResult.rows };
};

exports.createList = async ({ title, description, color, items, username }) => {
  const listResult = await db.query(
    'INSERT INTO lists (title, description, color, username) VALUES ($1, $2, $3, $4) RETURNING *',
    [title, description, color, username]
  );
  const list = listResult.rows[0];
  if (items && items.length > 0) {
    for (const item of items) {
      await db.query(
        'INSERT INTO list_items (list_id, option, is_checked) VALUES ($1, $2, $3)',
        [list.id, item.option, item.is_checked]
      );
    }
  }
  return list;
};

exports.updateList = async (id, { title, description, color }) => {
  const result = await db.query(
    'UPDATE lists SET title = $1, description = $2, color = $3 WHERE id = $4 RETURNING *',
    [title, description, color, id]
  );
  return result.rows[0];
};

exports.deleteList = async (id) => {
  await db.query('DELETE FROM lists WHERE id = $1', [id]);
};

// Actualiza un item (checkbox)
exports.updateListItem = async (listId, itemId, { is_checked }) => {
  const result = await db.query(
    'UPDATE list_items SET is_checked = $1 WHERE id = $2 AND list_id = $3 RETURNING *',
    [is_checked, itemId, listId]
  );
  return result.rows[0];
};

// Nuevo: "Eliminar" (desactivar) un item: actualizar active a false
exports.deleteListItem = async (listId, itemId) => {
  const result = await db.query(
    'UPDATE list_items SET active = false WHERE id = $1 AND list_id = $2 RETURNING *',
    [itemId, listId]
  );
  return result.rows[0];
};
