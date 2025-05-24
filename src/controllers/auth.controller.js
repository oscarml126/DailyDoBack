// src/controllers/auth.controller.js
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const { createUser, setRecoveryCode,getUserByRecoveryCode,updatePassword } = require('../models/user.model');
const { sendRecoveryEmail } = require('../utils/mailer');

// Registro de usuario
const register = async (req, res, next) => {
  try {
    const { username, name, lastname, email, password, confirmPassword } = req.body;

    // Validar campos
    if (!username || !name || !lastname || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'Por favor, completa todos los campos.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Las contraseñas no coinciden.' });
    }

    // Validar que el username sea único
    const userCheck = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'El username ya está en uso.' });
    }
    // Validar que el email sea único
    const emailCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado.' });
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear el usuario en la base de datos
    const user = await createUser({
      username,
      name,
      lastname,
      email,
      password: hashedPassword
    });

    return res.status(201).json({ message: 'Usuario registrado exitosamente', user });
  } catch (error) {
    next(error);
  }
};

// Login de usuario (puede usar username o email)
const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: 'El identificador y la contraseña son obligatorios.' });
    }

    // Buscar el usuario por email o username
    const query = 'SELECT * FROM users WHERE email = $1 OR username = $1';
    const { rows } = await pool.query(query, [identifier]);
    
    if (rows.length === 0) {
      return res.status(400).json({ error: 'Usuario no encontrado.' });
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Credenciales inválidas.' });
    }

    // Opcional: Aquí podrías generar un token JWT para autenticación
    res.status(200).json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        created_at: user.created_at
      }
    });
  } catch (error) {
    next(error);
  }
};
function generateRecoveryCode(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
}

const requestPasswordRecovery = async (req, res) => {
  const { email } = req.body;
  const code = generateRecoveryCode();
  const expiresAt = new Date(Date.now() + 15 * 60000); // 15 minutos

  try {
      await setRecoveryCode(email, code, expiresAt);
      await sendRecoveryEmail(email, code);
      res.json({ message: 'Se ha enviado un correo con el código de recuperación.' });
  } catch (err) {
      res.status(500).json({ message: 'Error al procesar la solicitud.', error: err.message });
  }
};

const resetPassword = async (req, res) => {
  const { email, recoveryCode, newPassword } = req.body;

  try {
      const result = await getUserByRecoveryCode(email, recoveryCode);

      if (result.rowCount === 0) {
          return res.status(400).json({ message: 'Código de recuperación inválido.' });
      }

      const user = result.rows[0];
      if (new Date() > new Date(user.recovery_expires)) {
          return res.status(400).json({ message: 'El código ha expirado.' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await updatePassword(email, hashedPassword);

      return res.json({ message: 'Contraseña actualizada correctamente.' });
  } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al actualizar la contraseña.', error: err.message });
  }
};

module.exports = { register, login,requestPasswordRecovery, resetPassword };
