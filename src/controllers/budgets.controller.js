const budgetsModel = require('../models/budgets.model');

exports.getBudgets = async (req, res) => {
  try {
    const userId = req.user.id;
    const budgets = await budgetsModel.getBudgets(userId);
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener presupuestos' });
  }
};

exports.createBudget = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { period, category, limit_amount } = req.body;
    const budget = await budgetsModel.createBudget({ user_id, period, category, limit_amount });
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear presupuesto' });
  }
};

exports.updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const budget = await budgetsModel.updateBudget(id, req.body);
    res.json(budget);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar presupuesto' });
  }
};

exports.deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    await budgetsModel.deleteBudget(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar presupuesto' });
  }
};
