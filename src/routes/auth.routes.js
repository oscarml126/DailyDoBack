// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { register, login, requestPasswordRecovery,resetPassword  } = require('../controllers/auth.controller');

// Ruta para registro
router.post('/register', register);

// Ruta para login
router.post('/login', login);

router.post('/request-recovery', requestPasswordRecovery);
router.post('/reset-password', resetPassword);

module.exports = router;
