const express = require('express');
const cors = require('cors');
const database = require('./src/database');
const routes = require('./src/routes');
const config = require('./config');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api', routes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'API de Tareas funcionando correctamente',
    version: '1.0.0',
    endpoints: {
      'GET /api/tasks': 'Obtener todas las tareas',
      'GET /api/tasks/:id': 'Obtener una tarea por ID',
      'POST /api/tasks': 'Crear una nueva tarea',
      'PUT /api/tasks/:id': 'Actualizar una tarea',
      'PATCH /api/tasks/:id/toggle': 'Cambiar estado de completado',
      'DELETE /api/tasks/:id': 'Eliminar una tarea'
    }
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
  });
});

// Ruta 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Inicializar servidor
async function startServer() {
  try {
    // Conectar a la base de datos
    await database.connect();
    
    // Iniciar servidor
    const PORT = config.server.port;
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
      console.log('Base de datos MySQL conectada');
    });
  } catch (error) {
    console.error('Error iniciando servidor:', error);
    process.exit(1);
  }
}

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('\nCerrando servidor...');
  await database.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nCerrando servidor...');
  await database.disconnect();
  process.exit(0);
});

startServer();
