/**
 * Controlador de validaciones
 * 
 * Maneja las peticiones HTTP relacionadas con validaciones.
 * 
 * Responsabilidad: Procesar requests HTTP y delegar a la orquestación
 */

import { executeSync, executeAsync } from '../../orchestrators/validationOrchestrator.js';

/**
 * Ejecuta validaciones
 * POST /validations/execute
 * 
 * Body esperado:
 * {
 *   context: string,        // 'CATALOGOS', 'MAESTRAS', etc.
 *   targetType: string,     // Tipo de entidad a validar
 *   dataSource: {           // Fuente de datos
 *     catalogoId?: string,  // ID de catálogo
 *     query?: object,       // Query para filtrar
 *     document?: object     // Documento directo
 *   },
 *   sync: boolean          // true para ejecución sincrónica, false para asincrónica
 * }
 */
export const executeValidations = async (req, res, next) => {
  try {
    const { context, targetType, dataSource, sync } = req.body;
    
    // Validar parámetros requeridos
    if (!context) {
      return res.status(400).json({
        error: 'Missing required parameter: context'
      });
    }
    
    if (!targetType) {
      return res.status(400).json({
        error: 'Missing required parameter: targetType'
      });
    }
    
    if (!dataSource) {
      return res.status(400).json({
        error: 'Missing required parameter: dataSource'
      });
    }
    
    // Ejecutar validaciones (sincrónica o asincrónica)
    if (sync === true) {
      // Ejecución sincrónica: retornar resultados
      const results = await executeSync({
        context,
        targetType,
        dataSource
      });
      
      return res.status(200).json({
        success: true,
        data: results
      });
    } else {
      // Ejecución asincrónica: retornar confirmación
      const job = await executeAsync({
        context,
        targetType,
        dataSource
      });
      
      return res.status(202).json({
        success: true,
        data: job
      });
    }
  } catch (error) {
    next(error);
  }
};

