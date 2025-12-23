/**
 * Rutas de validaciones
 * 
 * Define las rutas HTTP para el microservicio de validaciones.
 * 
 * Responsabilidad: Mapear endpoints HTTP a controladores
 */

import express from 'express';
import { executeValidations } from '../controllers/validations.controller.js';

const router = express.Router();

/**
 * POST /validations/execute
 * Ejecuta validaciones de forma sincrónica o asincrónica
 */
router.post('/execute', executeValidations);

export default router;

