const express = require('express');
const router = express.Router();
const { getLists, getListById, createList, updateList, deleteList, updateListItem, deleteListItem } = require('../controllers/lists.controller');

// Endpoints para listas
router.get('/', getLists);
router.get('/:id', getListById);
router.post('/', createList);
router.put('/:id', updateList);
router.delete('/:id', deleteList);
router.put('/:listId/items/:itemId', updateListItem);
router.delete('/:listId/items/:itemId', deleteListItem);

module.exports = router;
