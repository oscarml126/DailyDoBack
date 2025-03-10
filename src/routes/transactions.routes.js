const express = require('express');
const router = express.Router();
const { 
  createTransactionHandler, 
  getTransactionsHandler, 
  updateTransactionHandler,
  deleteTransactionHandler 
} = require('../controllers/transactions.controller');

router.post('/', createTransactionHandler);
router.get('/', getTransactionsHandler);
router.put('/:id', updateTransactionHandler);
router.delete('/:id', deleteTransactionHandler);

module.exports = router;
