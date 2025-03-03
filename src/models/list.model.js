// models/lists.model.js
const db = require('../config/db');

exports.getAllLists = async () => {
  const result = await db.query('SELECT * FROM lists ORDER BY id');
  return result.rows;
};

exports.getListById = async (id) => {
  const listResult = await db.query('SELECT * FROM lists WHERE id = $1', [id]);
  if (listResult.rows.length === 0) {
    throw new Error('Lista no encontrada');
  }
  const itemsResult = await db.query('SELECT * FROM list_items WHERE list_id = $1 ORDER BY id', [id]);
  return { ...listResult.rows[0], items: itemsResult.rows };
};

exports.createList = async ({ title, description, color, items }) => {
  const listResult = await db.query(
    'INSERT INTO lists (title, description, color) VALUES ($1, $2, $3) RETURNING *',
    [title, description, color]
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

exports.updateListItem = async (listId, itemId, { is_checked }) => {
  const result = await db.query(
    'UPDATE list_items SET is_checked = $1 WHERE id = $2 AND list_id = $3 RETURNING *',
    [is_checked, itemId, listId]
  );
  return result.rows[0];
};
