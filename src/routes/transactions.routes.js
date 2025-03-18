const express = require('express');
const router = express.Router();
const { 
  createTransactionHandler, 
  getTransactionsHandler, 
  updateTransactionHandler,
  deleteTransactionHandler,
  getFilteredTransactionsHandler
} = require('../controllers/transactions.controller');

router.post('/', createTransactionHandler);
router.get('/', getTransactionsHandler);
router.put('/:id', updateTransactionHandler);
router.delete('/:id', deleteTransactionHandler);
router.get('/filter', getFilteredTransactionsHandler);

module.exports = router;
