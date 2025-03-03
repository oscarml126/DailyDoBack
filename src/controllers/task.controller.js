const { createTask, getTasksByUsername, updateTask, getAllTasksByUsername } = require('../models/task.model');

// Helper para obtener fecha local en formato YYYY-MM-DD
function getLocalDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Helper para obtener nombre del día en español
function getCurrentDayName() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const dayMap = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
  return { dayName: dayMap[dayOfWeek], dayIndex: dayOfWeek };
}

const createTaskHandler = async (req, res, next) => {
  try {
    const {
      username,
      name,
      category,
      description,
      duration,
      repetitive,
      repetition_type,
      custom_days,
      date,
    } = req.body;

    if (!username || !name || !category || !description || duration === undefined) {
      return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }
    if (!repetitive && !date) {
      return res.status(400).json({ error: 'La fecha es obligatoria para tareas no repetitivas.' });
    }
    if (repetitive && !repetition_type) {
      return res.status(400).json({ error: 'El tipo de repetición es obligatorio para tareas repetitivas.' });
    }
    if (repetitive && repetition_type === 'custom') {
      if (!Array.isArray(custom_days) || custom_days.length === 0) {
        return res.status(400).json({ error: 'Debe seleccionar al menos un día para la repetición personalizada.' });
      }
    }

    const taskData = {
      username,
      name,
      category,
      description,
      duration,
      repetitive,
      repetition_type: repetitive ? repetition_type : null,
      custom_days: repetitive && repetition_type === 'custom' ? custom_days : null,
      date: !repetitive ? date : null,
    };

    const task = await createTask(taskData);
    res.status(201).json({ message: 'Tarea creada exitosamente.', task });
  } catch (error) {
    next(error);
  }
};

const getTasksHandler = async (req, res, next) => {
  try {
    const { username,date } = req.query;
    if (!username) {
      return res.status(400).json({ error: "El username es obligatorio." });
    }
    const tasks = await getTasksByUsername(username);
    let currentDate;
    if(!date){
       currentDate = date;
    }else{
       currentDate = date;
    }
    
    const { dayName, dayIndex } = getCurrentDayName();

    const filteredTasks = tasks.filter(task => {
      if (!task.repetitive) {
        return task.date === currentDate;
      } else {
        if (task.repetition_type === "weekdays") {
          return dayIndex >= 1 && dayIndex <= 5;
        } else if (task.repetition_type === "weekends") {
          return dayIndex === 0 || dayIndex === 6;
        } else if (task.repetition_type === "alldays") {
          return true;
        } else if (task.repetition_type === "custom") {
          return (
            task.custom_days &&
            Array.isArray(task.custom_days) &&
            task.custom_days.includes(dayName)
          );
        }
      }
      return false;
    });
    res.status(200).json({ tasks: filteredTasks, valores: dayName, valores2: dayIndex });
  } catch (error) {
    next(error);
  }
};

const updateTaskHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    updateData.updated_date = new Date().toISOString();
    const updatedTask = await updateTask(id, updateData);
    if (!updatedTask) {
      return res.status(404).json({ error: "Tarea no encontrada." });
    }
    res.status(200).json({ message: "Tarea actualizada.", task: updatedTask });
  } catch (error) {
    next(error);
  }
};
const getAllTasksHandler = async (req, res, next) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ error: "El username es obligatorio." });
    }
    const tasks = await getAllTasksByUsername(username);
    res.status(200).json({ tasks });
  } catch (error) {
    next(error);
  }
};
module.exports = { createTaskHandler, getTasksHandler, updateTaskHandler, getAllTasksHandler };
