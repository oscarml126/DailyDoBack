// server.js
const express = require('express');
const cors = require('cors');
const app = express();

// Configuración de CORS
// Permitir solicitudes desde 'https://dailydoaplication.com', 'http://localhost:8100' y 'https://localhost'
const allowedOrigins = [
  'https://dailydoaplication.com',
  'http://localhost:8100',
  'https://localhost'
];

app.use(cors({
  origin: (origin, callback) => {
    // Si no se envía origin (por ejemplo, en llamadas desde herramientas o dispositivos móviles), lo permitimos.
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'Acceso denegado por la política CORS';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

// Permite el uso de JSON en las solicitudes
app.use(express.json());

// Importar rutas
const authRoutes = require('./src/routes/auth.routes');
const taskRoutes = require('./src/routes/task.routes');
const historyRoutes = require('./src/routes/history.routes');
const listRoutes = require('./src/routes/list.routes');

const transactionsRoutes = require('./src/routes/transactions.routes');
const investmentsRoutes = require('./src/routes/investments.routes');
const assetsRoutes = require('./src/routes/assets.routes');
const budgetsRoutes = require('./src/routes/budgets.routes');
const goalsRoutes = require('./src/routes/goals.routes');
const alertsRoutes = require('./src/routes/alerts.routes');
const friendsRoutes = require('./src/routes/friends.routes');


app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/lists', listRoutes);

app.use('/api/transactions', transactionsRoutes);
app.use('/api/investments', investmentsRoutes);
app.use('/api/assets', assetsRoutes);
app.use('/api/budgets', budgetsRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/friends', friendsRoutes);

// Middleware para manejo de errores (opcional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
});

// Puerto
const PORT = process.env.PORT || 3000;

// Escuchar en '0.0.0.0' para aceptar conexiones externas
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
