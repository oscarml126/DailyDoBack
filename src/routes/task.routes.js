const express = require('express');
const router = express.Router();
const { createTaskHandler, getTasksHandler, updateTaskHandler } = require('../controllers/task.controller');

router.post('/', createTaskHandler);
router.get('/', getTasksHandler);
router.put('/:id', updateTaskHandler);

module.exports = router;
