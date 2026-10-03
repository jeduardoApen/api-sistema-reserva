/**
 * Propósito: Middleware central de manejo de errores que envía una respuesta JSON
 *           consistente con el código de estado adecuado.
 *
 * @warning Debe declarar 4 parámetros (err, req, res, next); de lo contrario Express
 *          no lo identificará como manejador de errores.
 * @note Los errores 5xx se registran en consola para facilitar el diagnóstico.
 *
 * @example
 * app.use(errorHandler);
 *
 * Código Nativo/Framework: Express.js - middleware de errores registrado como última
 * capa de la aplicación.
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;
