const alertsModel = require('../models/alerts.model');

exports.getAlerts = async (req, res) => {
  try {
    const userId = req.user.id;
    const alerts = await alertsModel.getAlerts(userId);
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener alertas' });
  }
};

exports.createAlert = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { type, message } = req.body;
    const alert = await alertsModel.createAlert({ user_id, type, message });
    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear alerta' });
  }
};

exports.updateAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const alert = await alertsModel.updateAlert(id, req.body);
    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar alerta' });
  }
};
