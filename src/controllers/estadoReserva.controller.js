/**
 * Propósito: Controller de estados de reserva. Administra la comunicación HTTP (req/res)
 *           y delega la lógica al Service.
 *
 * @warning No incluye SQL ni reglas de negocio.
 *
 * @example
 * // Se usa en estadoReserva.routes.js: router.get('/obtener-estados', obtenerEstados);
 *
 * Código Nativo/Framework: Express.js - res.json() para responder al cliente.
 */
import estadoReservaService from '../services/estadoReserva.service.js';

/**
 * GET /api/estados-reserva/obtener-estados
 * Responde con la lista completa de estados de reserva.
 */
const obtenerEstados = async (req, res) => {
  const estados = await estadoReservaService.obtenerEstados();
  res.json({ success: true, data: estados });
};

/**
 * GET /api/estados-reserva/obtener-estado/:id
 * Responde con un estado según su id.
 */
const obtenerEstado = async (req, res) => {
  const id = Number(req.params.id);
  const estado = await estadoReservaService.obtenerEstado(id);
  res.json({ success: true, data: estado });
};

/**
 * POST /api/estados-reserva/crear-estado
 * Crea un nuevo estado de reserva a partir del body.
 */
const crearEstado = async (req, res) => {
  const estado = await estadoReservaService.crearEstado(req.body);
  res.status(201).json({ success: true, data: estado });
};

/**
 * PUT /api/estados-reserva/actualizar-estado/:id
 * Actualiza un estado de reserva a partir del body.
 */
const actualizarEstado = async (req, res) => {
  const id = Number(req.params.id);
  const estado = await estadoReservaService.actualizarEstado(id, req.body);
  res.json({ success: true, data: estado });
};

/**
 * DELETE /api/estados-reserva/eliminar-estado/:id
 * Elimina físicamente un estado de reserva.
 */
const eliminarEstado = async (req, res) => {
  const id = Number(req.params.id);
  await estadoReservaService.eliminarEstado(id);
  res.json({ success: true, message: 'Estado de reserva eliminado correctamente' });
};

export default { obtenerEstados, obtenerEstado, crearEstado, actualizarEstado, eliminarEstado };
