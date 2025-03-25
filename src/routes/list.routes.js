const express = require('express');
const router = express.Router();
const {
  getLists,
  getListById,
  createList,
  updateList,
  deleteList,
  updateListItem,
  deleteListItem
} = require('../controllers/list.controller');

// Endpoints para listas
router.get('/', getLists);
router.get('/:id', getListById);
router.post('/', createList);
router.put('/:id', updateList);
router.delete('/:id', deleteList);

// Endpoints para items (actualizar y "eliminar" desactivando)
router.put('/:listId/items/:itemId', updateListItem);
router.delete('/:listId/items/:itemId', deleteListItem);

module.exports = router;
