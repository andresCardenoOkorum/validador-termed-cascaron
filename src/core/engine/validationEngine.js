/**
 * Motor de validaciones
 * 
 * Motor puro y agnóstico que ejecuta reglas de validación basadas en configuración.
 * No tiene conocimiento de catálogos, colecciones, persistencia, correos u otros
 * sistemas externos. Su única responsabilidad es ejecutar reglas y retornar resultados.
 * 
 * Responsabilidad: Ejecutar reglas de validación y retornar resultados normalizados
 */

import { getRule } from '../rules/ruleRegistry.js';
import { VALIDATION_STATUS } from '../../shared/constants.js';
import { createValidationResult } from '../../shared/utils.js';

/**
 * Ejecuta una validación individual
 * @param {object} validationContext - Contexto de validación
 * @param {string} validationContext.validationId - ID de la validación
 * @param {string} validationContext.ruleType - Tipo de regla
 * @param {object} validationContext.input - Datos a validar
 * @param {object} validationContext.referenceData - Datos de referencia
 * @param {object} validationContext.params - Parámetros de la regla
 * @param {boolean} validationContext.blocking - Si es bloqueante
 * @returns {object} Resultado de la validación normalizado
 */
const executeSingleValidation = (validationContext) => {
  const { validationId, ruleType, input, referenceData, params, blocking } = validationContext;
  
  try {
    // Obtener la regla del registro
    const rule = getRule(ruleType);
    
    if (!rule) {
      return createValidationResult(
        validationId,
        VALIDATION_STATUS.ERROR,
        `Rule type '${ruleType}' not found`,
        { ruleType },
        blocking
      );
    }
    
    // Ejecutar la regla (función pura)
    const ruleResult = rule(input, referenceData, params);
    
    // Normalizar resultado
    return createValidationResult(
      validationId,
      ruleResult.status || VALIDATION_STATUS.ERROR,
      ruleResult.message || null,
      ruleResult.meta || null,
      blocking
    );
  } catch (error) {
    return createValidationResult(
      validationId,
      VALIDATION_STATUS.ERROR,
      `Validation error: ${error.message}`,
      { error: error.message, stack: error.stack },
      blocking
    );
  }
};

/**
 * Ejecuta múltiples validaciones sobre un input
 * @param {Array<object>} validationContexts - Array de contextos de validación
 * @param {object} input - Datos a validar
 * @param {object} referenceData - Datos de referencia
 * @returns {object} Resultado agregado con estado general y resultados por regla
 */
export const executeValidations = (validationContexts, input, referenceData) => {
  // TODO: Implementar lógica completa
  // 1. Filtrar validaciones habilitadas
  // 2. Ordenar por priority
  // 3. Ejecutar cada validación
  // 4. Determinar estado general (si hay blocking failures, es fail)
  // 5. Retornar resultado agregado
  
  if (!validationContexts || validationContexts.length === 0) {
    return {
      overallStatus: VALIDATION_STATUS.PASS,
      ruleResults: [],
      timestamp: new Date().toISOString()
    };
  }
  
  // Filtrar solo validaciones habilitadas
  const enabledContexts = validationContexts.filter(ctx => ctx.enabled !== false);
  
  // Ejecutar validaciones
  const ruleResults = enabledContexts.map(context => 
    executeSingleValidation({ ...context, input, referenceData })
  );
  
  // Determinar estado general
  const hasBlockingFailures = ruleResults.some(
    result => result.blocking && result.status === VALIDATION_STATUS.FAIL
  );
  const hasErrors = ruleResults.some(
    result => result.status === VALIDATION_STATUS.ERROR
  );
  
  let overallStatus = VALIDATION_STATUS.PASS;
  if (hasBlockingFailures || hasErrors) {
    overallStatus = VALIDATION_STATUS.FAIL;
  } else if (ruleResults.some(result => result.status === VALIDATION_STATUS.FAIL)) {
    overallStatus = VALIDATION_STATUS.FAIL;
  }
  
  return {
    overallStatus,
    ruleResults,
    timestamp: new Date().toISOString()
  };
};

