/**
 * Configuración de la aplicación Express
 * 
 * Configura middleware, rutas y manejo de errores.
 * 
 * Responsabilidad: Configurar la aplicación Express
 */

import express from 'express';
import validationsRoutes from './api/routes/validations.routes.js';

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Middleware para parsear URL encoded
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'validation-service',
    timestamp: new Date().toISOString()
  });
});

// Rutas de validaciones
app.use('/validations', validationsRoutes);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Middleware para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path
  });
});

export default app;

