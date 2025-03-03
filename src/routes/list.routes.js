// routes/lists.routes.js
const express = require('express');
const router = express.Router();
const listsController = require('../controllers/list.controller');
const { getLists, getListById, createList,updateList,deleteList } = require('../controllers/list.controller');

// Endpoints para listas
router.get('/', getLists);
router.get('/:id',getListById);
router.post('/', createList);
router.put('/:id', updateList);
router.delete('/:id', deleteList);

// Endpoint para actualizar un item (checkbox) de una lista
router.put('/:listId/items/:itemId', listsController.updateListItem);

module.exports = router;
