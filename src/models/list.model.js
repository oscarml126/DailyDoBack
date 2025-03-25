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
  // Obtener la lista y solo los items activos
  const listResult = await db.query('SELECT * FROM lists WHERE id = $1', [id]);
  if (listResult.rows.length === 0) {
    throw new Error('Lista no encontrada');
  }
  const itemsResult = await db.query(
    'SELECT * FROM list_items WHERE list_id = $1 AND active = true ORDER BY id',
    [id]
  );
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

// Obtener únicamente los items activos para una lista
exports.getActiveItems = async (listId) => {
  const itemsResult = await db.query(
    'SELECT * FROM list_items WHERE list_id = $1 AND active = true ORDER BY id',
    [listId]
  );
  return itemsResult.rows;
};

// Crear un nuevo item para una lista
exports.createListItem = async (listId, { option, is_checked }) => {
  const result = await db.query(
    'INSERT INTO list_items (list_id, option, is_checked) VALUES ($1, $2, $3) RETURNING *',
    [listId, option, is_checked]
  );
  return result.rows[0];
};

// Actualizar un item (modificar la opción y/o is_checked)
exports.updateListItem = async (listId, itemId, { option, is_checked }) => {
  const result = await db.query(
    'UPDATE list_items SET option = COALESCE($1, option), is_checked = COALESCE($2, is_checked) WHERE id = $3 AND list_id = $4 RETURNING *',
    [option, is_checked, itemId, listId]
  );
  return result.rows[0];
};

// "Eliminar" un item: desactivarlo (active = false)
exports.deleteListItem = async (listId, itemId) => {
  const result = await db.query(
    'UPDATE list_items SET active = false WHERE id = $1 AND list_id = $2 RETURNING *',
    [itemId, listId]
  );
  return result.rows[0];
};
