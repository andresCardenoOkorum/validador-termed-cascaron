/**
 * Orquestador de validaciones
 * 
 * Coordina todo el flujo de validación fuera del motor:
 * - Lectura de configuración
 * - Obtención de datos a validar
 * - Ejecución sincrónica o asincrónica
 * - Persistencia de resultados
 * - Generación de CSV
 * - Envío de correos
 * 
 * El motor de validaciones es completamente agnóstico y solo se encarga
 * de ejecutar reglas. Esta orquestación vive fuera del motor.
 * 
 * Responsabilidad: Coordinar el flujo completo de validación
 */

import { getValidationConfig } from '../persistence/validationConfig.repository.js';
import { saveValidationResults } from '../persistence/validationResults.repository.js';
import { buildValidationContext } from '../core/context/buildValidationContext.js';
import { executeValidations } from '../core/engine/validationEngine.js';
import { buildCSV } from '../reporting/csvBuilder.js';
import { sendValidationEmail } from '../reporting/emailSender.js';

/**
 * Obtiene datos a validar desde una fuente de datos
 * @param {object} dataSource - Fuente de datos
 * @param {string} [dataSource.catalogoId] - ID de catálogo
 * @param {object} [dataSource.query] - Query para filtrar
 * @param {object} [dataSource.document] - Documento directo
 * @returns {Promise<Array<object>>} Array de items a validar
 */
const getDataToValidate = async (dataSource) => {
  // TODO: Implementar obtención de datos
  // Puede obtener desde:
  // - Base de datos usando catalogoId + query
  // - Documento directo si viene en dataSource.document
  // - API externa
  // - Sistema de archivos
  
  if (dataSource.document) {
    return Array.isArray(dataSource.document) ? dataSource.document : [dataSource.document];
  }
  
  // Stub: retornar array vacío
  return [];
};

/**
 * Obtiene datos de referencia para las validaciones
 * @param {string} referenceSource - Fuente de referencia (ej: 'MST_CUM')
 * @returns {Promise<object>} Datos de referencia
 */
const getReferenceData = async (referenceSource) => {
  // TODO: Implementar obtención de datos de referencia
  // Puede obtener desde:
  // - Base de datos
  // - API externa
  // - Sistema de archivos
  // - Cache
  
  // Stub: retornar objeto vacío
  return {};
};

/**
 * Ejecuta validaciones de forma sincrónica
 * @param {object} params - Parámetros de ejecución
 * @param {string} params.context - Contexto de validación
 * @param {string} params.targetType - Tipo de objetivo
 * @param {object} params.dataSource - Fuente de datos
 * @returns {Promise<object>} Resultados de validación
 */
export const executeSync = async (params) => {
  const { context, targetType, dataSource } = params;
  
  try {
    // 1. Obtener configuración de validaciones
    const validationConfig = await getValidationConfig(context, targetType);
    
    if (!validationConfig || !validationConfig.enabled) {
      throw new Error(`No validation config found for context: ${context}, targetType: ${targetType}`);
    }
    
    // 2. Obtener datos a validar
    const itemsToValidate = await getDataToValidate(dataSource);
    
    if (itemsToValidate.length === 0) {
      return {
        overallStatus: 'pass',
        itemsProcessed: 0,
        results: []
      };
    }
    
    // 3. Obtener datos de referencia (agrupar por referenceSource)
    const referenceSources = new Set(
      validationConfig.validations
        .map(v => v.referenceSource)
        .filter(Boolean)
    );
    
    const referenceDataMap = {};
    for (const source of referenceSources) {
      referenceDataMap[source] = await getReferenceData(source);
    }
    
    // 4. Ejecutar validaciones para cada item
    const allResults = [];
    
    for (const item of itemsToValidate) {
      // Construir contexto de validación
      const validationContexts = buildValidationContext(validationConfig, item, referenceDataMap);
      
      // Ejecutar validaciones
      const result = executeValidations(validationContexts, item, referenceDataMap);
      
      // Agregar metadatos del item
      const itemResult = {
        ...result,
        context,
        targetType,
        itemId: item._id || item.id || `item_${Date.now()}`,
        item: item
      };
      
      allResults.push(itemResult);
    }
    
    // 5. Persistir resultados
    await saveValidationResults(allResults);
    
    // 6. Generar CSV (opcional, según configuración)
    // const csv = buildCSV(allResults);
    
    // 7. Enviar correo (opcional, según configuración)
    // await sendValidationEmail({ ... });
    
    return {
      overallStatus: allResults.every(r => r.overallStatus === 'pass') ? 'pass' : 'fail',
      itemsProcessed: allResults.length,
      results: allResults
    };
  } catch (error) {
    throw new Error(`Validation execution failed: ${error.message}`);
  }
};

/**
 * Ejecuta validaciones de forma asincrónica
 * @param {object} params - Parámetros de ejecución
 * @param {string} params.context - Contexto de validación
 * @param {string} params.targetType - Tipo de objetivo
 * @param {object} params.dataSource - Fuente de datos
 * @returns {Promise<object>} Confirmación de ejecución con jobId
 */
export const executeAsync = async (params) => {
  // TODO: Implementar ejecución asincrónica
  // Puede usar:
  // - BullMQ / Bull
  // - Cola de mensajes
  // - Workers en background
  
  // Por ahora, ejecutar de forma sincrónica pero retornar jobId
  const jobId = `job_${Date.now()}`;
  
  // En producción, esto debería encolar el trabajo
  // Por ahora, ejecutar en background (simulado)
  setImmediate(async () => {
    try {
      await executeSync(params);
    } catch (error) {
      console.error('Async validation execution failed:', error);
    }
  });
  
  return {
    jobId,
    status: 'queued',
    message: 'Validation job queued for execution'
  };
};

