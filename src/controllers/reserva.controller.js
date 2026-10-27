/**
 * Propósito: Controller de reservas. Administra la comunicación HTTP (req/res)
 *           y delega la lógica al Service.
 *
 * @warning No incluye SQL ni reglas de negocio.
 *
 * @example
 * // Se usa en reserva.routes.js: router.get('/obtener-reservas', obtenerReservas);
 *
 * Código Nativo/Framework: Express.js - res.json() para responder al cliente.
 */
import reservaService from '../services/reserva.service.js';

/**
 * GET /api/reservas/obtener-reservas
 * Responde con la lista completa de reservas.
 */
const obtenerReservas = async (req, res) => {
  const reservas = await reservaService.obtenerReservas();
  res.json({ success: true, data: reservas });
};

/**
 * GET /api/reservas/obtener-reserva/:id
 * Responde con una reserva según su id.
 */
const obtenerReserva = async (req, res) => {
  const id = Number(req.params.id);
  const reserva = await reservaService.obtenerReserva(id);
  res.json({ success: true, data: reserva });
};

/**
 * POST /api/reservas/crear-reserva
 * Crea una nueva reserva a partir del body.
 */
const crearReserva = async (req, res) => {
  const reserva = await reservaService.crearReserva(req.body);
  res.status(201).json({ success: true, data: reserva });
};

/**
 * PUT /api/reservas/actualizar-reserva/:id
 * Actualiza una reserva a partir del body.
 */
const actualizarReserva = async (req, res) => {
  const id = Number(req.params.id);
  const reserva = await reservaService.actualizarReserva(id, req.body);
  res.json({ success: true, data: reserva });
};

/**
 * PATCH /api/reservas/cambiar-estado/:id
 * Cambia solo el estado de una reserva (body: { estado_id }).
 */
const cambiarEstado = async (req, res) => {
  const id = Number(req.params.id);
  const estadoId = Number(req.body.estado_id);
  const reserva = await reservaService.cambiarEstado(id, estadoId);
  res.json({ success: true, data: reserva });
};

/**
 * DELETE /api/reservas/eliminar-reserva/:id
 * Elimina físicamente una reserva.
 */
const eliminarReserva = async (req, res) => {
  const id = Number(req.params.id);
  await reservaService.eliminarReserva(id);
  res.json({ success: true, message: 'Reserva eliminada correctamente' });
};

/**
 * GET /api/reservas/obtener-por-espacio?espacio_id=&fecha=
 * Responde con las reservas de un espacio en una fecha.
 */
const obtenerPorEspacio = async (req, res) => {
  const { espacio_id, fecha } = req.query;
  const reservas = await reservaService.obtenerReservasPorEspacio(espacio_id, fecha);
  res.json({ success: true, data: reservas });
};

/**
 * GET /api/reservas/obtener-por-rango?desde=&hasta=
 * Responde con las reservas en un rango de fechas.
 */
const obtenerPorRango = async (req, res) => {
  const { desde, hasta } = req.query;
  const reservas = await reservaService.obtenerReservasPorRango(desde, hasta);
  res.json({ success: true, data: reservas });
};

/**
 * GET /api/reservas/obtener-por-estado/:estadoId
 * Responde con las reservas de un estado.
 */
const obtenerPorEstado = async (req, res) => {
  const estadoId = Number(req.params.estadoId);
  const reservas = await reservaService.obtenerReservasPorEstado(estadoId);
  res.json({ success: true, data: reservas });
};

/**
 * GET /api/reservas/verificar-disponibilidad?espacio_id=&fecha=&hora_inicio=&hora_fin=
 * Responde si el espacio está disponible y los conflictos (si los hay).
 */
const verificarDisponibilidad = async (req, res) => {
  const { espacio_id, fecha, hora_inicio, hora_fin } = req.query;
  const resultado = await reservaService.verificarDisponibilidad(
    espacio_id,
    fecha,
    hora_inicio,
    hora_fin,
  );
  res.json({ success: true, data: resultado });
};

export default {
  obtenerReservas,
  obtenerReserva,
  crearReserva,
  actualizarReserva,
  cambiarEstado,
  eliminarReserva,
  obtenerPorEspacio,
  obtenerPorRango,
  obtenerPorEstado,
  verificarDisponibilidad,
};
