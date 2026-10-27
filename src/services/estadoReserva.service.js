/**
 * Propósito: Service de estados de reserva. Contiene las reglas de negocio del recurso
 *           y usa el Repository para acceder a los datos.
 *
 * @warning No ejecutes consultas SQL aquí; delega el acceso a datos al Repository.
 *
 * @example
 * import estadoReservaService from '../services/estadoReserva.service.js';
 * const estados = await estadoReservaService.obtenerEstados();
 *
 * Código Nativo: Node.js - funciones de negocio que orquestan al Repository.
 */
import estadoReservaRepository from '../repositories/estadoReserva.repository.js';
import ApiError from '../utils/ApiError.js';

/**
 * Lista todos los estados de reserva.
 *
 * @returns {Promise<Array<Object>>} Lista de estados de reserva.
 */
const obtenerEstados = async () => {
  return estadoReservaRepository.obtenerTodos();
};

/**
 * Obtiene un estado de reserva por su id, validando que exista.
 *
 * @param {number} id - Identificador del estado.
 * @returns {Promise<Object>} Estado encontrado.
 * @throws {ApiError} 400 si el id no es válido, 404 si no existe.
 */
const obtenerEstado = async (id) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new ApiError(400, 'El id debe ser un número entero positivo');
  }

  const estado = await estadoReservaRepository.obtenerPorId(id);

  if (!estado) {
    throw new ApiError(404, 'Estado de reserva no encontrado');
  }

  return estado;
};

/**
 * Valida que el nombre del estado venga y no esté vacío.
 *
 * @param {Object} datos - Objeto con { nombre }.
 * @returns {string} Nombre validado (sin espacios en los extremos).
 * @throws {ApiError} 400 si el nombre falta.
 */
const validarNombre = (datos) => {
  const nombre = datos.nombre?.trim();

  if (!nombre) {
    throw new ApiError(400, 'El nombre es obligatorio');
  }

  return nombre;
};

/**
 * Crea un estado de reserva validando los datos de entrada.
 *
 * @param {Object} datos - Objeto con { nombre }.
 * @returns {Promise<Object>} Estado creado.
 */
const crearEstado = async (datos) => {
  const nombre = validarNombre(datos);
  const id = await estadoReservaRepository.crear({ nombre });
  return estadoReservaRepository.obtenerPorId(id);
};

/**
 * Actualiza un estado de reserva validando que exista y los datos de entrada.
 *
 * @param {number} id - Identificador del estado.
 * @param {Object} datos - Objeto con { nombre }.
 * @returns {Promise<Object>} Estado actualizado.
 * @throws {ApiError} 400/404 según corresponda.
 */
const actualizarEstado = async (id, datos) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new ApiError(400, 'El id debe ser un número entero positivo');
  }

  const estado = await estadoReservaRepository.obtenerPorId(id);

  if (!estado) {
    throw new ApiError(404, 'Estado de reserva no encontrado');
  }

  const nombre = validarNombre(datos);
  await estadoReservaRepository.actualizar(id, { nombre });

  return estadoReservaRepository.obtenerPorId(id);
};

/**
 * Elimina físicamente un estado de reserva, validando que exista.
 *
 * @param {number} id - Identificador del estado.
 * @returns {Promise<void>}
 * @throws {ApiError} 400 si el id no es válido, 404 si no existe.
 */
const eliminarEstado = async (id) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new ApiError(400, 'El id debe ser un número entero positivo');
  }

  const estado = await estadoReservaRepository.obtenerPorId(id);

  if (!estado) {
    throw new ApiError(404, 'Estado de reserva no encontrado');
  }

  await estadoReservaRepository.eliminar(id);
};

export default { obtenerEstados, obtenerEstado, crearEstado, actualizarEstado, eliminarEstado };
