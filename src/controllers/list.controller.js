// controllers/lists.controller.js
const listsModel = require('../models/list.model');

const getLists = async (req, res) => {
  try {
    const lists = await listsModel.getAllLists();
    res.json(lists);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener listas' });
  }
};

const getListById = async (req, res) => {
  try {
    const { id } = req.params;
    const list = await listsModel.getListById(id);
    res.json(list);
  } catch (error) {
    if (error.message === 'Lista no encontrada') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error al obtener la lista' });
    }
  }
};

const createList = async (req, res) => {
  try {
    const { title, description, color, items } = req.body;
    const newList = await listsModel.createList({ title, description, color, items });
    res.status(201).json(newList);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la lista' });
  }
};

const updateList = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, color } = req.body;
    const updatedList = await listsModel.updateList(id, { title, description, color });
    res.json(updatedList);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la lista' });
  }
};

const deleteList = async (req, res) => {
  try {
    const { id } = req.params;
    await listsModel.deleteList(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la lista' });
  }
};

const updateListItem = async (req, res) => {
  try {
    const { listId, itemId } = req.params;
    const { is_checked } = req.body;
    const updatedItem = await listsModel.updateListItem(listId, itemId, { is_checked });
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el item' });
  }
};
module.exports = { updateListItem, deleteList, updateList, createList, getListById, getLists };
