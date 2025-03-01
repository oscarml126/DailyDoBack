// server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Importar rutas (asegúrate de tener implementadas las rutas de auth si es necesario)
const authRoutes = require('./src/routes/auth.routes'); // Por ejemplo, para login y registro
const taskRoutes = require('./src/routes/task.routes');
const historyRoutes = require('./src/routes/history.routes');

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/history', historyRoutes);

// Middleware para manejo de errores (opcional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
