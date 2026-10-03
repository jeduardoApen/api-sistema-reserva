/**
 * Propósito: Middleware que responde 404 cuando ninguna ruta registrada coincide
 *           con la solicitud entrante.
 *
 * @warning Debe registrarse después de todas las rutas; si se coloca antes,
 *          interceptará todas las peticiones.
 *
 * @example
 * app.use(notFound);
 *
 * Código Nativo/Framework: Express.js - middleware final que delega al manejador
 * de errores un ApiError con código 404.
 */
import ApiError from '../utils/ApiError.js';

const notFound = (req, res, next) => {
  next(new ApiError(404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`));
};

export default notFound;
