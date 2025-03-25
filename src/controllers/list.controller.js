const listsModel = require('../models/list.model');

const getLists = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ error: "El username es obligatorio." });
    }
    const lists = await listsModel.getAllLists(username);
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
    const { title, description, color, items, username } = req.body;
    const newList = await listsModel.createList({ title, description, color, items, username });
    res.status(201).json(newList);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la lista' });
  }
};

const updateList = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, color, items } = req.body;
    
    // Actualiza los datos principales de la lista
    const updatedList = await listsModel.updateList(id, { title, description, color });
    
    // Obtener los items activos actuales de la lista
    const currentItems = await listsModel.getActiveItems(id);
    // IDs actuales en la base de datos
    const currentIds = currentItems.map(item => item.id);
    // IDs de los ítems enviados en el payload (los que tienen id)
    const payloadIds = items.filter(item => item.id).map(item => item.id);
    
    // Procesar cada ítem del payload: si tiene id, se actualiza; si es nuevo se crea.
    for (const item of items) {
      if (item.id) {
        await listsModel.updateListItem(id, item.id, { option: item.option });
      } else {
        await listsModel.createListItem(id, { option: item.option, is_checked: false });
      }
    }
    
    // Desactivar (eliminar) los ítems que existían y ya no se envían (active = false)
    for (const currentItem of currentItems) {
      if (!payloadIds.includes(currentItem.id)) {
        await listsModel.deleteListItem(id, currentItem.id);
      }
    }
    
    res.json(updatedList);
  } catch (error) {
    console.error("Error en updateList:", error);
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

const deleteListItem = async (req, res) => {
  try {
    const { listId, itemId } = req.params;
    const deactivatedItem = await listsModel.deleteListItem(listId, itemId);
    res.json(deactivatedItem);
  } catch (error) {
    res.status(500).json({ error: 'Error al desactivar el item' });
  }
};

module.exports = { 
  getLists, 
  getListById, 
  createList, 
  updateList, 
  deleteList, 
  updateListItem, 
  deleteListItem 
};
