/**
 * Registro de reglas de validación
 * 
 * Este módulo mantiene el registro de todas las reglas de validación disponibles.
 * Las reglas son funciones puras que no tienen dependencias externas.
 * 
 * Responsabilidad: Registrar y proporcionar acceso a las reglas de validación
 */

import { RULE_TYPES } from '../../shared/constants.js';
import { booleanCheckRule } from './implementations/booleanCheck.rule.js';
import { existenceRule } from './implementations/existence.rule.js';
import { enumWhitelistRule } from './implementations/enumWhitelist.rule.js';

/**
 * Registro de reglas por tipo
 * Cada regla es una función pura que recibe (input, referenceData, params) y retorna un resultado
 */
const ruleRegistry = {
  [RULE_TYPES.BOOLEAN_CHECK]: booleanCheckRule,
  [RULE_TYPES.EXISTENCE]: existenceRule,
  [RULE_TYPES.ENUM_WHITELIST]: enumWhitelistRule
};

/**
 * Obtiene una regla de validación por su tipo
 * @param {string} ruleType - Tipo de regla (ej: 'BOOLEAN_CHECK')
 * @returns {Function|null} Función de regla o null si no existe
 */
export const getRule = (ruleType) => {
  return ruleRegistry[ruleType] || null;
};

/**
 * Verifica si un tipo de regla está registrado
 * @param {string} ruleType - Tipo de regla a verificar
 * @returns {boolean} true si está registrado
 */
export const hasRule = (ruleType) => {
  return ruleType in ruleRegistry;
};

/**
 * Registra una nueva regla de validación
 * @param {string} ruleType - Tipo de regla
 * @param {Function} ruleFunction - Función de validación
 */
export const registerRule = (ruleType, ruleFunction) => {
  if (typeof ruleFunction !== 'function') {
    throw new Error(`Rule function must be a function for type: ${ruleType}`);
  }
  ruleRegistry[ruleType] = ruleFunction;
};

/**
 * Obtiene todos los tipos de reglas registrados
 * @returns {Array<string>} Array de tipos de reglas
 */
export const getRegisteredRuleTypes = () => {
  return Object.keys(ruleRegistry);
};

