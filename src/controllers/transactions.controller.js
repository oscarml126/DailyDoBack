const transactionsModel = require('../models/transactions.model');

exports.getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await transactionsModel.getAllTransactions(userId);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener transacciones' });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { amount, type, category, description, date, imported } = req.body;
    const transaction = await transactionsModel.createTransaction({ user_id, amount, type, category, description, date, imported });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear transacción' });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await transactionsModel.updateTransaction(id, req.body);
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar transacción' });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    await transactionsModel.deleteTransaction(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar transacción' });
  }
};
