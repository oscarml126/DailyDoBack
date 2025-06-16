const { 
    createTransaction, 
    getTransactionsByUserId, 
    updateTransaction, 
    deleteTransaction,
    getTransactionsByUserIdAndDateRange,
    getTransactionById
  } = require('../models/transactions.model');
  
  const createTransactionHandler = async (req, res, next) => {
    try {
      const { amount, type, category, description, date, imported, user_id, payment_method } = req.body;
      // Se obtiene el user_id del objeto req.user (asumiendo que el middleware de autenticación lo coloca)
      // Validar campos obligatorios (puedes agregar más validaciones si es necesario)
      if (amount === undefined || !type || !category) {
        return res.status(400).json({ error: 'Faltan campos obligatorios.' });
      }
      const transactionData = {
        user_id,
        amount,
        type,
        category,
        description,
        date,
        imported: imported || false,
        payment_method
      };
      const transaction = await createTransaction(transactionData);
      res.status(201).json({ message: 'Transacción creada exitosamente.', transaction });
    } catch (error) {
      next(error);
    }
  };
  
  const getTransactionsHandler = async (req, res, next) => {
    try {
        const user_id = req.query.user_id;
      const transactions = await getTransactionsByUserId(user_id);
      res.status(200).json({ transactions });
    } catch (error) {
      next(error);
    }
  };
  
  const updateTransactionHandler = async (req, res, next) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      // Se agrega la fecha de actualización
      updateData.updated_date = new Date().toISOString();
      const updatedTransaction = await updateTransaction(id, updateData);
      if (!updatedTransaction) {
        return res.status(404).json({ error: 'Transacción no encontrada.' });
      }
      res.status(200).json({ message: 'Transacción actualizada.', transaction: updatedTransaction });
    } catch (error) {
      next(error);
    }
  };
  
  const deleteTransactionHandler = async (req, res, next) => {
    try {
      const { id } = req.params;
      await deleteTransaction(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
  const getFilteredTransactionsHandler = async (req, res, next) => {
    try {
      const { user_id, start_date, end_date } = req.query;
      if (!user_id || !start_date || !end_date) {
        return res.status(400).json({ error: 'Se requieren user_id, start_date y end_date en la query.' });
      }
      const transactions = await getTransactionsByUserIdAndDateRange(user_id, start_date, end_date);
      res.status(200).json({ transactions });
    } catch (error) {
      next(error);
    }
  };
  const getTransactionByIdHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const transaction = await getTransactionById(id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transacción no encontrada.' });
    }
    res.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
};

  module.exports = { 
    createTransactionHandler, 
    getTransactionsHandler, 
    updateTransactionHandler, 
    deleteTransactionHandler,
    getFilteredTransactionsHandler,
    getTransactionByIdHandler 
  };
  