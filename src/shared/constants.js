/**
 * Constantes compartidas del microservicio de validaciones
 * Define los valores constantes utilizados en todo el sistema
 */

/**
 * Tipos de reglas de validación disponibles
 */
export const RULE_TYPES = {
  BOOLEAN_CHECK: 'BOOLEAN_CHECK',
  EXISTENCE: 'EXISTENCE',
  ENUM_WHITELIST: 'ENUM_WHITELIST'
};

/**
 * Estados de resultado de validación
 */
export const VALIDATION_STATUS = {
  PASS: 'pass',
  FAIL: 'fail',
  ERROR: 'error',
  SKIP: 'skip'
};

/**
 * Estados generales de ejecución
 */
export const EXECUTION_STATUS = {
  SUCCESS: 'success',
  FAILED: 'failed',
  IN_PROGRESS: 'in_progress'
};

/**
 * Contextos de validación soportados
 */
export const VALIDATION_CONTEXTS = {
  CATALOGOS: 'CATALOGOS',
  MAESTRAS: 'MAESTRAS'
};

/**
 * Prioridades de validación
 */
export const PRIORITY = {
  LOW: 1,
  MEDIUM: 5,
  HIGH: 10,
  CRITICAL: 20
};

