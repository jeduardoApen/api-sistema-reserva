/**
 * Propósito: Controller de tipos de espacio. Administra la comunicación HTTP (req/res)
 *           y delega la lógica al Service.
 *
 * @warning No incluye SQL ni reglas de negocio.
 *
 * @example
 * // Se usa en tipoEspacio.routes.js: router.get('/obtener-tipos', obtenerTipos);
 *
 * Código Nativo/Framework: Express.js - res.json() para responder al cliente.
 */
import tipoEspacioService from '../services/tipoEspacio.service.js';

/**
 * GET /api/tipos-espacio/obtener-tipos
 * Responde con la lista completa de tipos de espacio.
 */
const obtenerTipos = async (req, res) => {
  const tipos = await tipoEspacioService.obtenerTipos();
  res.json({ success: true, data: tipos });
};

/**
 * GET /api/tipos-espacio/obtener-tipo/:id
 * Responde con un tipo de espacio según su id.
 */
const obtenerTipo = async (req, res) => {
  const id = Number(req.params.id);
  const tipo = await tipoEspacioService.obtenerTipo(id);
  res.json({ success: true, data: tipo });
};

/**
 * POST /api/tipos-espacio/crear-tipo
 * Crea un nuevo tipo de espacio a partir del body.
 */
const crearTipo = async (req, res) => {
  const tipo = await tipoEspacioService.crearTipo(req.body);
  res.status(201).json({ success: true, data: tipo });
};

/**
 * PUT /api/tipos-espacio/actualizar-tipo/:id
 * Actualiza un tipo de espacio a partir del body.
 */
const actualizarTipo = async (req, res) => {
  const id = Number(req.params.id);
  const tipo = await tipoEspacioService.actualizarTipo(id, req.body);
  res.json({ success: true, data: tipo });
};

/**
 * DELETE /api/tipos-espacio/eliminar-tipo/:id
 * Elimina físicamente un tipo de espacio.
 */
const eliminarTipo = async (req, res) => {
  const id = Number(req.params.id);
  await tipoEspacioService.eliminarTipo(id);
  res.json({ success: true, message: 'Tipo de espacio eliminado correctamente' });
};

/**
 * POST /api/tipos-espacio/desactivar-tipo/:id
 * Desactiva lógicamente un tipo de espacio (activo = 0).
 */
const desactivarTipo = async (req, res) => {
  const id = Number(req.params.id);
  await tipoEspacioService.desactivarTipo(id);
  res.json({ success: true, message: 'Tipo de espacio desactivado correctamente' });
};

export default { obtenerTipos, obtenerTipo, crearTipo, actualizarTipo, eliminarTipo, desactivarTipo };
