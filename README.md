# Validation Service

Microservicio de validaciones genérico, reutilizable y altamente configurable. Diseñado con un enfoque de programación funcional y arquitectura desacoplada, donde el motor de validaciones es completamente agnóstico y la orquestación vive fuera del motor.

## Propósito

Este microservicio proporciona un motor de validaciones desacoplado que puede ser reutilizado por distintos módulos de la aplicación (catálogos, maestras u otros). El motor puede ejecutarse de forma sincrónica o asincrónica dependiendo del contexto recibido.

### Principios de Diseño

- **Motor Agnóstico**: El motor de validaciones no conoce catálogos, colecciones, correos, ni persistencia. Su única responsabilidad es ejecutar reglas de validación a partir de una configuración y un input, retornando un resultado normalizado.

- **Separación de Responsabilidades**: 
  - **Motor**: Ejecuta reglas de validación (funciones puras)
  - **Orquestación**: Coordina lectura de configuración, obtención de datos, ejecución, persistencia, CSV y email
  - **Persistencia**: Abstracción para leer/escribir configuraciones y resultados
  - **Reporting**: Generación de CSV y envío de correos

- **Configuración Externa**: Las validaciones se definen por configuración, no en código. Cada validación tiene:
  - `ruleType`: Tipo de regla (BOOLEAN_CHECK, EXISTENCE, ENUM_WHITELIST)
  - `referenceSource`: Fuente de referencia
  - `targetAttributes`: Atributos objetivo
  - `sourceAttribute`: Atributo fuente a validar
  - `params`: Parámetros opcionales (valores esperados, listas permitidas, etc.)
  - `priority`: Prioridad de ejecución
  - `blocking`: Bandera de bloqueo

## Estructura del Proyecto

```
validation-service/
├── src/
│   ├── api/                    # Capa de API
│   │   ├── routes/            # Definición de rutas HTTP
│   │   └── controllers/       # Controladores HTTP
│   │
│   ├── core/                   # Motor de validaciones (agnóstico)
│   │   ├── engine/            # Motor principal
│   │   ├── rules/             # Registro e implementaciones de reglas
│   │   └── context/           # Constructor de contexto
│   │
│   ├── orchestrators/         # Orquestación (fuera del motor)
│   │
│   ├── persistence/           # Abstracciones de persistencia
│   │
│   ├── reporting/             # Generación de CSV y envío de emails
│   │
│   ├── shared/                # Utilidades compartidas
│   │
│   ├── app.js                 # Configuración Express
│   └── server.js              # Punto de entrada
│
├── package.json
└── README.md
```

## Flujo General

```
1. Request HTTP → Controller
2. Controller → Orchestrator
3. Orchestrator → Config Repository (lee configuración)
4. Orchestrator → Obtiene datos a validar (desde dataSource)
5. Orchestrator → Obtiene datos de referencia
6. Orchestrator → Build Validation Context
7. Orchestrator → Validation Engine
8. Validation Engine → Rule Registry → Ejecuta reglas
9. Validation Engine → Retorna resultados normalizados
10. Orchestrator → Results Repository (persiste resultados)
11. Orchestrator → CSV Builder (genera CSV si aplica)
12. Orchestrator → Email Sender (envía email si aplica)
13. Controller → Response HTTP
```

## Endpoints

### POST /validations/execute

Ejecuta validaciones de forma sincrónica o asincrónica.

**Request Body:**
```json
{
  "context": "CATALOGOS",
  "targetType": "medicamento",
  "dataSource": {
    "catalogoId": "catalogo_123",
    "query": { "status": "active" }
  },
  "sync": true
}
```

**Parámetros:**
- `context` (required): Contexto de validación (CATALOGOS, MAESTRAS, etc.)
- `targetType` (required): Tipo de entidad a validar
- `dataSource` (required): Fuente de datos
  - `catalogoId` + `query`: Para obtener datos desde un catálogo
  - `document`: Para validar un documento directo
- `sync` (required): `true` para ejecución sincrónica, `false` para asincrónica

**Response (Sincrónico - 200):**
```json
{
  "success": true,
  "data": {
    "overallStatus": "pass",
    "itemsProcessed": 10,
    "results": [...]
  }
}
```

**Response (Asincrónico - 202):**
```json
{
  "success": true,
  "data": {
    "jobId": "job_1234567890",
    "status": "queued",
    "message": "Validation job queued for execution"
  }
}
```

### GET /health

Health check del servicio.

**Response:**
```json
{
  "status": "ok",
  "service": "validation-service",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Extensión de Validaciones

### Agregar una Nueva Regla de Validación

1. **Crear implementación de regla** en `src/core/rules/implementations/`:
   ```javascript
   // miNuevaRegla.rule.js
   export const miNuevaRegla = (input, referenceData, params) => {
     // Lógica de validación
     return {
       status: 'pass' | 'fail' | 'error',
       message: 'Mensaje descriptivo',
       meta: { /* metadatos adicionales */ }
     };
   };
   ```

2. **Registrar la regla** en `src/core/rules/ruleRegistry.js`:
   ```javascript
   import { miNuevaRegla } from './implementations/miNuevaRegla.rule.js';
   
   const ruleRegistry = {
     // ...
     [RULE_TYPES.MI_NUEVA_REGLA]: miNuevaRegla
   };
   ```

3. **Agregar constante** en `src/shared/constants.js`:
   ```javascript
   export const RULE_TYPES = {
     // ...
     MI_NUEVA_REGLA: 'MI_NUEVA_REGLA'
   };
   ```

4. **Usar en configuración**: La nueva regla estará disponible para usar en configuraciones de validación con `ruleType: 'MI_NUEVA_REGLA'`.

### Configurar Persistencia

Implementar las funciones en:
- `src/persistence/validationConfig.repository.js`: Para leer configuraciones
- `src/persistence/validationResults.repository.js`: Para persistir resultados

Estas abstracciones permiten cambiar la fuente de datos (archivos, base de datos, API) sin modificar el motor.

### Configurar Reporting

Implementar las funciones en:
- `src/reporting/csvBuilder.js`: Para generar CSVs personalizados
- `src/reporting/emailSender.js`: Para integrar con servicios de email

## Instalación

```bash
npm install
```

## Ejecución

```bash
# Desarrollo
npm run start:dev

# Producción
npm start
```

## Variables de Entorno

```env
PORT=3000
NODE_ENV=development
```

## Notas de Implementación

Este proyecto contiene la **estructura inicial** con implementaciones mínimas (stubs). Las siguientes funcionalidades requieren implementación completa:

- Implementación de reglas de validación (booleanCheck, existence, enumWhitelist)
- Lectura de configuraciones desde fuente de datos
- Obtención de datos a validar desde dataSource
- Obtención de datos de referencia
- Persistencia de resultados
- Generación de CSV
- Envío de correos electrónicos
- Ejecución asincrónica con cola de trabajos

Cada archivo contiene comentarios JSDoc y TODOs indicando qué debe implementarse.

## Arquitectura

El diseño sigue principios de:
- **Programación Funcional**: Funciones puras, sin clases innecesarias
- **Separación de Concerns**: Motor vs Orquestación vs Persistencia
- **Inversión de Dependencias**: El motor no depende de implementaciones concretas
- **Configuración Externa**: Validaciones definidas por configuración, no código

