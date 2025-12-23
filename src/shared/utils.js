/**
 * Utilidades compartidas del microservicio de validaciones
 * Funciones genéricas reutilizables en todo el sistema
 */

/**
 * Normaliza un valor para comparación (trim, lowercase, etc.)
 * @param {*} value - Valor a normalizar
 * @returns {string|*} Valor normalizado
 */
export const normalizeValue = (value) => {
  if (typeof value === 'string') {
    return value.trim().toLowerCase();
  }
  return value;
};

/**
 * Verifica si un valor está vacío (null, undefined, string vacío, array vacío)
 * @param {*} value - Valor a verificar
 * @returns {boolean} true si está vacío
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && Object.keys(value).length === 0) return true;
  return false;
};

/**
 * Obtiene un valor anidado de un objeto usando notación de punto
 * @param {object} obj - Objeto fuente
 * @param {string} path - Ruta al valor (ej: 'user.profile.name')
 * @param {*} defaultValue - Valor por defecto si no existe
 * @returns {*} Valor encontrado o defaultValue
 */
export const getNestedValue = (obj, path, defaultValue = undefined) => {
  if (!obj || !path) return defaultValue;
  
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined) return defaultValue;
    current = current[key];
  }
  
  return current !== undefined ? current : defaultValue;
};

/**
 * Crea un resultado de validación normalizado
 * @param {string} validationId - ID de la validación
 * @param {string} status - Estado (pass/fail/error/skip)
 * @param {string} [message] - Mensaje descriptivo
 * @param {object} [meta] - Metadatos adicionales
 * @param {boolean} [blocking] - Si es bloqueante
 * @returns {object} Resultado normalizado
 */
export const createValidationResult = (validationId, status, message = null, meta = null, blocking = false) => {
  return {
    validationId,
    status,
    message,
    meta,
    blocking,
    timestamp: new Date().toISOString()
  };
};

/**
 * Agrupa resultados de validación por estado
 * @param {Array} results - Array de resultados
 * @returns {object} Resultados agrupados por estado
 */
export const groupResultsByStatus = (results) => {
  return results.reduce((acc, result) => {
    const status = result.status || 'unknown';
    if (!acc[status]) acc[status] = [];
    acc[status].push(result);
    return acc;
  }, {});
};

