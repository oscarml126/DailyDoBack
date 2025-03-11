const express = require('express');
const router = express.Router();
const listsController = require('../controllers/lists.controller');
const { getLists, getListById, createList, updateList, deleteList, updateListItem, deleteListItem } = require('../controllers/lists.controller');

// Endpoints para listas
router.get('/', getLists);
router.get('/:id', getListById);
router.post('/', createList);
router.put('/:id', updateList);
router.delete('/:id', deleteList);

// Endpoint para actualizar un item (checkbox) de una lista
router.put('/:listId/items/:itemId', updateListItem);

// Endpoint para "eliminar" (desactivar) un item de una lista
router.delete('/:listId/items/:itemId', deleteListItem);

module.exports = router;
