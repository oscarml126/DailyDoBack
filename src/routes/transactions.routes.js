const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactions.controller');

router.get('/', transactionsController.getTransactions);
router.post('/', transactionsController.createTransaction);
router.put('/:id', transactionsController.updateTransaction);
router.delete('/:id', transactionsController.deleteTransaction);

module.exports = router;
