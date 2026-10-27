/**
 * Propósito: Service de reservas. Contiene las reglas de negocio del recurso
 *           (validaciones y regla de no cruce de horarios) y usa el Repository.
 *
 * @warning No ejecutes consultas SQL aquí; delega el acceso a datos al Repository.
 * @note La regla principal: un mismo espacio no puede reservarse en horarios que se crucen.
 *
 * @example
 * import reservaService from '../services/reserva.service.js';
 * const reserva = await reservaService.crearReserva(datos);
 *
 * Código Nativo: Node.js - funciones de negocio que orquestan al Repository.
 */
import reservaRepository from '../repositories/reserva.repository.js';
import espacioRepository from '../repositories/espacio.repository.js';
import estadoReservaRepository from '../repositories/estadoReserva.repository.js';
import ApiError from '../utils/ApiError.js';

/**
 * Convierte una hora en formato "HH:MM" o "HH:MM:SS" a minutos totales.
 *
 * @param {string} hora - Hora en formato HH:MM o HH:MM:SS.
 * @returns {number} Total de minutos.
 */
const aMinutos = (hora) => {
  const [horas, minutos] = hora.split(':').map(Number);
  return horas * 60 + minutos;
};

/**
 * Valida y normaliza los datos de una reserva.
 *
 * @param {Object} datos - Datos de la reserva.
 * @returns {Promise<Object>} Datos validados.
 * @throws {ApiError} 400 si falta o es inválido algún dato, 404 si el espacio o estado no existen.
 */
const validarDatosReserva = async (datos) => {
  const usuarioId = Number(datos.usuario_id);

  if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
    throw new ApiError(400, 'El usuario es obligatorio');
  }

  const espacioId = Number(datos.espacio_id);

  if (!Number.isInteger(espacioId) || espacioId <= 0) {
    throw new ApiError(400, 'El espacio es obligatorio');
  }

  const estadoId = Number(datos.estado_id);

  if (!Number.isInteger(estadoId) || estadoId <= 0) {
    throw new ApiError(400, 'El estado es obligatorio');
  }

  const fecha = datos.fecha_reserva;

  if (!fecha) {
    throw new ApiError(400, 'La fecha es obligatoria');
  }

  const horaInicio = datos.hora_inicio;
  const horaFin = datos.hora_fin;

  if (!horaInicio || !horaFin) {
    throw new ApiError(400, 'Las horas de inicio y fin son obligatorias');
  }

  if (aMinutos(horaInicio) >= aMinutos(horaFin)) {
    throw new ApiError(400, 'La hora de inicio debe ser menor que la hora de fin');
  }

  const motivo = datos.motivo?.trim();

  if (!motivo) {
    throw new ApiError(400, 'El motivo es obligatorio');
  }

  const nombreCliente = datos.nombre_cliente?.trim();

  if (!nombreCliente) {
    throw new ApiError(400, 'El nombre del cliente es obligatorio');
  }

  const espacio = await espacioRepository.obtenerPorId(espacioId);

  if (!espacio) {
    throw new ApiError(404, 'Espacio no encontrado');
  }

  const estado = await estadoReservaRepository.obtenerPorId(estadoId);

  if (!estado) {
    throw new ApiError(404, 'Estado de reserva no encontrado');
  }

  return {
    usuario_id: usuarioId,
    espacio_id: espacioId,
    fecha_reserva: fecha,
    hora_inicio: horaInicio,
    hora_fin: horaFin,
    motivo,
    nombre_cliente: nombreCliente,
    estado_id: estadoId,
    observaciones: datos.observaciones ?? null,
  };
};

/**
 * Lista todas las reservas.
 *
 * @returns {Promise<Array<Object>>} Lista de reservas.
 */
const obtenerReservas = async () => {
  return reservaRepository.obtenerTodos();
};

/**
 * Obtiene una reserva por su id, validando que exista.
 *
 * @param {number} id - Identificador de la reserva.
 * @returns {Promise<Object>} Reserva encontrada.
 * @throws {ApiError} 400 si el id no es válido, 404 si no existe.
 */
const obtenerReserva = async (id) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new ApiError(400, 'El id debe ser un número entero positivo');
  }

  const reserva = await reservaRepository.obtenerPorId(id);

  if (!reserva) {
    throw new ApiError(404, 'Reserva no encontrada');
  }

  return reserva;
};

/**
 * Crea una reserva validando los datos y que no haya cruce de horarios.
 *
 * @param {Object} datos - Datos de la reserva.
 * @returns {Promise<Object>} Reserva creada.
 * @throws {ApiError} 400/404 según validación, 409 si hay cruce de horarios.
 */
const crearReserva = async (datos) => {
  const datosValidados = await validarDatosReserva(datos);

  const conflictos = await reservaRepository.encontrarConflictos(
    datosValidados.espacio_id,
    datosValidados.fecha_reserva,
    datosValidados.hora_inicio,
    datosValidados.hora_fin,
  );

  if (conflictos.length > 0) {
    throw new ApiError(409, 'El espacio ya está reservado en ese horario');
  }

  const id = await reservaRepository.crear(datosValidados);
  return reservaRepository.obtenerPorId(id);
};

/**
 * Actualiza una reserva validando los datos y que no haya cruce de horarios
 * (excluyendo la propia reserva que se edita).
 *
 * @param {number} id - Identificador de la reserva.
 * @param {Object} datos - Datos de la reserva.
 * @returns {Promise<Object>} Reserva actualizada.
 * @throws {ApiError} 400/404 según validación, 409 si hay cruce de horarios.
 */
const actualizarReserva = async (id, datos) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new ApiError(400, 'El id debe ser un número entero positivo');
  }

  const reserva = await reservaRepository.obtenerPorId(id);

  if (!reserva) {
    throw new ApiError(404, 'Reserva no encontrada');
  }

  const datosValidados = await validarDatosReserva(datos);

  const conflictos = await reservaRepository.encontrarConflictos(
    datosValidados.espacio_id,
    datosValidados.fecha_reserva,
    datosValidados.hora_inicio,
    datosValidados.hora_fin,
    id,
  );

  if (conflictos.length > 0) {
    throw new ApiError(409, 'El espacio ya está reservado en ese horario');
  }

  await reservaRepository.actualizar(id, datosValidados);
  return reservaRepository.obtenerPorId(id);
};

/**
 * Cambia solo el estado de una reserva (cancelar o confirmar).
 *
 * @param {number} id - Identificador de la reserva.
 * @param {number} estadoId - Nuevo estado.
 * @returns {Promise<Object>} Reserva actualizada.
 * @throws {ApiError} 400/404 según corresponda.
 */
const cambiarEstado = async (id, estadoId) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new ApiError(400, 'El id debe ser un número entero positivo');
  }

  if (!Number.isInteger(estadoId) || estadoId <= 0) {
    throw new ApiError(400, 'El estado es obligatorio');
  }

  const reserva = await reservaRepository.obtenerPorId(id);

  if (!reserva) {
    throw new ApiError(404, 'Reserva no encontrada');
  }

  const estado = await estadoReservaRepository.obtenerPorId(estadoId);

  if (!estado) {
    throw new ApiError(404, 'Estado de reserva no encontrado');
  }

  await reservaRepository.actualizarEstado(id, estadoId);
  return reservaRepository.obtenerPorId(id);
};

/**
 * Elimina físicamente una reserva, validando que exista.
 *
 * @param {number} id - Identificador de la reserva.
 * @returns {Promise<void>}
 * @throws {ApiError} 400 si el id no es válido, 404 si no existe.
 */
const eliminarReserva = async (id) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new ApiError(400, 'El id debe ser un número entero positivo');
  }

  const reserva = await reservaRepository.obtenerPorId(id);

  if (!reserva) {
    throw new ApiError(404, 'Reserva no encontrada');
  }

  await reservaRepository.eliminar(id);
};

/**
 * Obtiene las reservas de un espacio en una fecha determinada.
 *
 * @param {string} espacioId - Identificador del espacio.
 * @param {string} fecha - Fecha en formato YYYY-MM-DD.
 * @returns {Promise<Array<Object>>} Reservas encontradas.
 * @throws {ApiError} 400 si faltan parámetros.
 */
const obtenerReservasPorEspacio = async (espacioId, fecha) => {
  if (!espacioId || !fecha) {
    throw new ApiError(400, 'espacio_id y fecha son obligatorios');
  }

  return reservaRepository.obtenerPorEspacioFecha(Number(espacioId), fecha);
};

/**
 * Obtiene las reservas dentro de un rango de fechas.
 *
 * @param {string} desde - Fecha inicial.
 * @param {string} hasta - Fecha final.
 * @returns {Promise<Array<Object>>} Reservas encontradas.
 * @throws {ApiError} 400 si faltan parámetros.
 */
const obtenerReservasPorRango = async (desde, hasta) => {
  if (!desde || !hasta) {
    throw new ApiError(400, 'desde y hasta son obligatorios');
  }

  return reservaRepository.obtenerPorRango(desde, hasta);
};

/**
 * Obtiene las reservas filtradas por estado.
 *
 * @param {number} estadoId - Identificador del estado.
 * @returns {Promise<Array<Object>>} Reservas encontradas.
 */
const obtenerReservasPorEstado = async (estadoId) => {
  if (!Number.isInteger(estadoId) || estadoId <= 0) {
    throw new ApiError(400, 'El id debe ser un número entero positivo');
  }

  return reservaRepository.obtenerPorEstado(estadoId);
};

/**
 * Verifica si un espacio está disponible en una fecha y rango horario.
 *
 * @param {string} espacioId - Identificador del espacio.
 * @param {string} fecha - Fecha en formato YYYY-MM-DD.
 * @param {string} horaInicio - Hora de inicio.
 * @param {string} horaFin - Hora de fin.
 * @returns {Promise<Object>} { disponible, conflictos }.
 * @throws {ApiError} 400 si faltan parámetros o el horario es inválido.
 */
const verificarDisponibilidad = async (espacioId, fecha, horaInicio, horaFin) => {
  if (!espacioId || !fecha || !horaInicio || !horaFin) {
    throw new ApiError(400, 'espacio_id, fecha, hora_inicio y hora_fin son obligatorios');
  }

  if (aMinutos(horaInicio) >= aMinutos(horaFin)) {
    throw new ApiError(400, 'La hora de inicio debe ser menor que la hora de fin');
  }

  const conflictos = await reservaRepository.encontrarConflictos(
    Number(espacioId),
    fecha,
    horaInicio,
    horaFin,
  );

  return {
    disponible: conflictos.length === 0,
    conflictos,
  };
};

export default {
  obtenerReservas,
  obtenerReserva,
  crearReserva,
  actualizarReserva,
  cambiarEstado,
  eliminarReserva,
  obtenerReservasPorEspacio,
  obtenerReservasPorRango,
  obtenerReservasPorEstado,
  verificarDisponibilidad,
};
