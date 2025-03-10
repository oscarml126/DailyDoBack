const assetsModel = require('../models/assets.model');

exports.getAssets = async (req, res) => {
  try {
    const userId = req.user.id;
    const assets = await assetsModel.getAllAssets(userId);
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener activos' });
  }
};

exports.createAsset = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { type, description, value, acquisition_date } = req.body;
    const asset = await assetsModel.createAsset({ user_id, type, description, value, acquisition_date });
    res.status(201).json(asset);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear activo' });
  }
};

exports.updateAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const asset = await assetsModel.updateAsset(id, req.body);
    res.json(asset);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar activo' });
  }
};

exports.deleteAsset = async (req, res) => {
  try {
    const { id } = req.params;
    await assetsModel.deleteAsset(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar activo' });
  }
};
