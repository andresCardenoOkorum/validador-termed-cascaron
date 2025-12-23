/**
 * Punto de entrada del servidor
 * 
 * Inicia el servidor HTTP del microservicio de validaciones.
 * 
 * Responsabilidad: Inicializar y levantar el servidor
 */

import dotenv from 'dotenv';
import app from './app.js';

// Cargar variables de entorno
dotenv.config();

const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Validation Service running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

