const investmentsModel = require('../models/investments.model');

exports.getInvestments = async (req, res) => {
  try {
    const userId = req.user.id;
    const investments = await investmentsModel.getAllInvestments(userId);
    res.json(investments);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener inversiones' });
  }
};

exports.createInvestment = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { type, asset_name, quantity, purchase_price, current_price, purchase_date } = req.body;
    const investment = await investmentsModel.createInvestment({ user_id, type, asset_name, quantity, purchase_price, current_price, purchase_date });
    res.status(201).json(investment);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear inversión' });
  }
};

exports.updateInvestment = async (req, res) => {
  try {
    const { id } = req.params;
    const investment = await investmentsModel.updateInvestment(id, req.body);
    res.json(investment);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar inversión' });
  }
};

exports.deleteInvestment = async (req, res) => {
  try {
    const { id } = req.params;
    await investmentsModel.deleteInvestment(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar inversión' });
  }
};
