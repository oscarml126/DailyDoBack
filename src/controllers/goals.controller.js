const goalsModel = require('../models/goals.model');

exports.getGoals = async (req, res) => {
  try {
    const userId = req.user.id;
    const goals = await goalsModel.getGoals(userId);
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener metas' });
  }
};

exports.createGoal = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { description, target_amount, due_date } = req.body;
    const goal = await goalsModel.createGoal({ user_id, description, target_amount, due_date });
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear meta' });
  }
};

exports.updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const goal = await goalsModel.updateGoal(id, req.body);
    res.json(goal);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar meta' });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    await goalsModel.deleteGoal(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar meta' });
  }
};
