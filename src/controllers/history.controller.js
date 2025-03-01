const { upsertHistory, getHistoryByUsername } = require('../models/history.model');

const createOrUpdateHistory = async (req, res, next) => {
  try {
    const { username, date, tasks } = req.body;
    if (!username || !date || !tasks) {
      return res.status(400).json({ error: 'username, date y tasks son obligatorios.' });
    }
    const history = await upsertHistory({ username, date, tasks });
    res.status(200).json({ message: 'Historial guardado exitosamente.', history });
  } catch (error) {
    next(error);
  }
};

const getHistoryHandler = async (req, res, next) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ error: 'El username es obligatorio.' });
    }
    const historyDocs = await getHistoryByUsername(username);
    res.status(200).json({ history: historyDocs });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrUpdateHistory, getHistoryHandler };
