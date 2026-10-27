/**
 * Propósito: Controller de espacios. Administra la comunicación HTTP (req/res)
 *           y delega la lógica al Service.
 *
 * @warning No incluye SQL ni reglas de negocio.
 *
 * @example
 * // Se usa en espacio.routes.js: router.get('/obtener-espacios', obtenerEspacios);
 *
 * Código Nativo/Framework: Express.js - res.json() para responder al cliente.
 */
import espacioService from '../services/espacio.service.js';

/**
 * GET /api/espacios/obtener-espacios
 * Responde con la lista completa de espacios.
 */
const obtenerEspacios = async (req, res) => {
  const espacios = await espacioService.obtenerEspacios();
  res.json({ success: true, data: espacios });
};

/**
 * GET /api/espacios/obtener-espacio/:id
 * Responde con un espacio según su id.
 */
const obtenerEspacio = async (req, res) => {
  const id = Number(req.params.id);
  const espacio = await espacioService.obtenerEspacio(id);
  res.json({ success: true, data: espacio });
};

/**
 * POST /api/espacios/crear-espacio
 * Crea un nuevo espacio a partir del body.
 */
const crearEspacio = async (req, res) => {
  const espacio = await espacioService.crearEspacio(req.body);
  res.status(201).json({ success: true, data: espacio });
};

/**
 * PUT /api/espacios/actualizar-espacio/:id
 * Actualiza un espacio a partir del body.
 */
const actualizarEspacio = async (req, res) => {
  const id = Number(req.params.id);
  const espacio = await espacioService.actualizarEspacio(id, req.body);
  res.json({ success: true, data: espacio });
};

/**
 * DELETE /api/espacios/eliminar-espacio/:id
 * Elimina físicamente un espacio.
 */
const eliminarEspacio = async (req, res) => {
  const id = Number(req.params.id);
  await espacioService.eliminarEspacio(id);
  res.json({ success: true, message: 'Espacio eliminado correctamente' });
};

/**
 * POST /api/espacios/desactivar-espacio/:id
 * Desactiva lógicamente un espacio (activo = 0).
 */
const desactivarEspacio = async (req, res) => {
  const id = Number(req.params.id);
  await espacioService.desactivarEspacio(id);
  res.json({ success: true, message: 'Espacio desactivado correctamente' });
};

/**
 * GET /api/espacios/obtener-disponibles
 * Responde con los espacios libres en una fecha y rango horario (query params).
 */
const obtenerDisponibles = async (req, res) => {
  const { fecha, hora_inicio, hora_fin } = req.query;
  const espacios = await espacioService.obtenerEspaciosDisponibles(fecha, hora_inicio, hora_fin);
  res.json({ success: true, data: espacios });
};

export default {
  obtenerEspacios,
  obtenerEspacio,
  crearEspacio,
  actualizarEspacio,
  eliminarEspacio,
  desactivarEspacio,
  obtenerDisponibles,
};
