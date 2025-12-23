/**
 * Constructor de CSV desde resultados de validación
 * 
 * Genera archivos CSV a partir de resultados de validación para reportes.
 * Esta funcionalidad vive fuera del motor de validaciones.
 * 
 * Responsabilidad: Transformar resultados de validación en formato CSV
 */

/**
 * Construye un CSV a partir de resultados de validación
 * @param {Array<object>} results - Array de resultados de validación
 * @param {object} [options] - Opciones de construcción
 * @param {Array<string>} [options.columns] - Columnas a incluir
 * @param {string} [options.delimiter] - Delimitador (default: ',')
 * @returns {string} Contenido del CSV
 */
export const buildCSV = (results, options = {}) => {
  // TODO: Implementar construcción de CSV
  // 1. Definir headers según options.columns o estructura de results
  // 2. Iterar sobre results y construir filas
  // 3. Escapar valores especiales (comas, comillas, saltos de línea)
  // 4. Retornar string CSV completo
  
  if (!results || results.length === 0) {
    return '';
  }
  
  const delimiter = options.delimiter || ',';
  const columns = options.columns || ['itemId', 'overallStatus', 'validationId', 'status', 'message'];
  
  // Stub: retornar CSV básico
  const headers = columns.join(delimiter);
  const rows = results.map(result => {
    return columns.map(col => {
      const value = result[col] || '';
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(delimiter);
  });
  
  return [headers, ...rows].join('\n');
};

/**
 * Construye un CSV detallado con información de todas las reglas
 * @param {Array<object>} results - Array de resultados de validación
 * @returns {string} Contenido del CSV detallado
 */
export const buildDetailedCSV = (results) => {
  // TODO: Implementar CSV detallado con información expandida de ruleResults
  
  return buildCSV(results, {
    columns: ['itemId', 'overallStatus', 'validationId', 'status', 'message', 'blocking', 'timestamp']
  });
};

