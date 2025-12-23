/**
 * Regla de validación: Existence
 * 
 * Valida que un valor exista en una fuente de referencia.
 * 
 * Responsabilidad: Verificar existencia de un valor en datos de referencia
 * 
 * @param {object} input - Objeto a validar
 * @param {object} referenceData - Datos de referencia donde buscar
 * @param {object} params - Parámetros de la regla
 * @param {string} params.sourceAttribute - Atributo del input a validar
 * @param {string} params.referenceKey - Clave en referenceData donde buscar
 * @param {Array<string>} [params.targetAttributes] - Atributos objetivo en referenceData
 * @returns {object} Resultado de la validación { status, message, meta }
 */
export const existenceRule = (input, referenceData, params) => {
  // TODO: Implementar lógica de validación de existencia
  // 1. Extraer valor de input[params.sourceAttribute]
  // 2. Buscar en referenceData usando params.referenceKey
  // 3. Si params.targetAttributes existe, validar que esos atributos estén presentes
  // 4. Retornar { status: 'pass'|'fail', message: string, meta: object }
  
  throw new Error('existenceRule not implemented');
};

