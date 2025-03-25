const express = require('express');
const router = express.Router();
const {
  createTaskHandler,
  getTasksHandler,
  updateTaskHandler,
  getAllTasksHandler
} = require('../controllers/task.controller');

router.post('/', createTaskHandler);
router.get('/', getTasksHandler);
router.put('/:id', updateTaskHandler);
router.get('/all', getAllTasksHandler);

module.exports = router;
