/**
 * Propósito: Representa un error operacional de la API asociado a un código de estado HTTP.
 *
 * @warning Lánzalo siempre con `throw`; nunca lo retornes como valor de una función.
 * @note Códigos previstos: 400 Bad Request, 404 Not Found, 409 Conflict, 500 Internal Server Error.
 *
 * @example
 * throw new ApiError(404, 'Espacio no encontrado');
 *
 * Código Nativo: Node.js - extiende la clase nativa `Error` para añadir la
 * propiedad `statusCode` utilizada por el middleware de errores.
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode - Código de estado HTTP del error.
   * @param {string} message - Mensaje descriptivo del error.
   */
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
