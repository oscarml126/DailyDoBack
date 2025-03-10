const express = require('express');
const router = express.Router();
const alertsController = require('../controllers/alerts.controller');

router.get('/', alertsController.getAlerts);
router.post('/', alertsController.createAlert);
router.put('/:id', alertsController.updateAlert);

module.exports = router;
