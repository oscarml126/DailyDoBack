const express = require('express');
const router = express.Router();
const { 
  createTransactionHandler, 
  getTransactionsHandler, 
  updateTransactionHandler,
  deleteTransactionHandler,
  getFilteredTransactionsHandler,
  getTransactionByIdHandler
} = require('../controllers/transactions.controller');

router.post('/', createTransactionHandler);
router.get('/', getTransactionsHandler);
router.put('/:id', updateTransactionHandler);
router.delete('/:id', deleteTransactionHandler);
router.get('/filter', getFilteredTransactionsHandler);
router.get('/:id', getTransactionByIdHandler);

module.exports = router;
