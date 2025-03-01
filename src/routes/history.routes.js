const express = require('express');
const router = express.Router();
const { createOrUpdateHistory, getHistoryHandler } = require('../controllers/history.controller');

router.post('/', createOrUpdateHistory);
router.get('/', getHistoryHandler);

module.exports = router;
