require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path'); // ← IMPORTANTE para servir el frontend
const serverConfig = require('./config/server');
const routes = require('./src/routes');
const { errorHandler } = require('./src/middlewares');
const { logger } = require('./src/utils');

const app = express();

// Middlewares globales
app.use(cors(serverConfig.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logs de peticiones HTTP
if (serverConfig.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

/**
 * Servir FRONTEND estático
 * Estructura esperada:
 *  - /backend/app.js   (este archivo)
 *  - /frontend/index.html
 */
app.use(express.static(path.join(__dirname, '../frontend')));

// Ruta raíz: devolver el index.html del frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Rutas principales de la API
app.use('/api', routes);

// Ruta informativa de la API (opcional)
app.get('/api/info', (req, res) => {
  res.json({
    success: true,
    message: 'Bienvenido a la API de E-commerce',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      products: '/api/products',
      categories: '/api/categories',
      orders: '/api/orders'
    }
  });
});

// Manejo de rutas no encontradas (principalmente para API)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Iniciar servidor
const PORT = serverConfig.port;
app.listen(PORT, () => {
  logger.info(`Servidor corriendo en puerto ${PORT}`);
  logger.info(`Entorno: ${serverConfig.nodeEnv}`);
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🎨 Frontend: http://localhost:${PORT}`);
  console.log(`📝 API health: http://localhost:${PORT}/api/health\n`);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection', { error: err.message, stack: err.stack });
  console.error('UNHANDLED REJECTION! 💥 Cerrando...');
  process.exit(1);
});

module.exports = app;

