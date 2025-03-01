const pool = require('../config/db');

const createTask = async (taskData) => {
  const {
    username,
    name,
    category,
    description,
    duration,
    repetitive,
    repetition_type,
    custom_days,
    date
  } = taskData;

  // La base de datos asignará isChecked = false por defecto.
  const query = `
    INSERT INTO tasks (username, name, category, description, duration, repetitive, repetition_type, custom_days, date)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;
  const values = [
    username,
    name,
    category,
    description,
    duration,
    repetitive,
    repetition_type,
    custom_days,
    date
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getTasksByUsername = async (username) => {
  const query = 'SELECT * FROM tasks WHERE username = $1';
  const { rows } = await pool.query(query, [username]);
  return rows;
};

const updateTask = async (id, updateData) => {
  const query = `
    UPDATE tasks
    SET isChecked = $1,
        updated_date = $2,
        description = COALESCE($3, description),
        duration = COALESCE($4, duration),
        category = COALESCE($5, category),
        repetitive = COALESCE($6, repetitive),
        repetition_type = COALESCE($7, repetition_type),
        custom_days = COALESCE($8, custom_days),
        active = COALESCE($9, active)
    WHERE id = $10
    RETURNING *
  `;
  const values = [
    updateData.isChecked,
    updateData.updated_date,
    updateData.description,
    updateData.duration,
    updateData.category,
    updateData.repetitive,
    updateData.repetition_type,
    updateData.custom_days,
    updateData.active,
    id
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

module.exports = { createTask, getTasksByUsername, updateTask };
