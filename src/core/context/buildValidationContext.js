/**
 * Constructor de contexto de validación
 * 
 * Construye el contexto necesario para ejecutar validaciones a partir de
 * una configuración de validación y los datos a validar.
 * 
 * Responsabilidad: Transformar configuración y datos en un contexto ejecutable
 */

/**
 * Construye el contexto de validación desde una configuración
 * @param {object} validationConfig - Configuración de validación
 * @param {object} validationConfig.validations - Array de definiciones de validación
 * @param {object} input - Datos a validar
 * @param {object} referenceData - Datos de referencia para las validaciones
 * @returns {Array<object>} Array de contextos de validación listos para ejecutar
 */
export const buildValidationContext = (validationConfig, input, referenceData) => {
  // TODO: Implementar construcción de contexto
  // 1. Iterar sobre validationConfig.validations
  // 2. Para cada validación, construir un contexto con:
  //    - validationId
  //    - ruleType
  //    - input (o parte del input según targetAttributes)
  //    - referenceData (filtrado según referenceSource)
  //    - params
  //    - priority
  //    - blocking
  // 3. Retornar array de contextos ordenados por priority
  
  if (!validationConfig || !validationConfig.validations) {
    return [];
  }
  
  // Stub: retornar estructura básica
  return validationConfig.validations.map(validation => ({
    validationId: validation.validationId,
    ruleType: validation.ruleType,
    input,
    referenceData,
    params: validation.params || {},
    priority: validation.priority || 0,
    blocking: validation.blocking || false,
    enabled: validation.enabled !== false
  }));
};

