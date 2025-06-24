const express = require('express');
const router = express.Router();
const controller = require('../controllers/friends.controller');

router.post('/request', controller.sendRequest);
router.post('/respond', controller.respondRequest);
router.get('/list/:userId', controller.getFriends);
router.get('/pending/:userId', controller.getPending);

module.exports = router;
