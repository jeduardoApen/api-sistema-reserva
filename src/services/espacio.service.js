/**
 * Propósito: Service de espacios. Contiene las reglas de negocio del recurso
 *           y usa el Repository para acceder a los datos.
 *
 * @warning No ejecutes consultas SQL aquí; delega el acceso a datos al Repository.
 *
 * @example
 * import espacioService from '../services/espacio.service.js';
 * const espacios = await espacioService.obtenerEspacios();
 *
 * Código Nativo: Node.js - funciones de negocio que orquestan al Repository.
 */
import espacioRepository from '../repositories/espacio.repository.js';
import tipoEspacioRepository from '../repositories/tipoEspacio.repository.js';
import ApiError from '../utils/ApiError.js';

/**
 * Lista todos los espacios.
 *
 * @returns {Promise<Array<Object>>} Lista de espacios.
 */
const obtenerEspacios = async () => {
  return espacioRepository.obtenerTodos();
};

/**
 * Obtiene un espacio por su id, validando que exista.
 *
 * @param {number} id - Identificador del espacio.
 * @returns {Promise<Object>} Espacio encontrado.
 * @throws {ApiError} 400 si el id no es válido, 404 si no existe.
 */
const obtenerEspacio = async (id) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new ApiError(400, 'El id debe ser un número entero positivo');
  }

  const espacio = await espacioRepository.obtenerPorId(id);

  if (!espacio) {
    throw new ApiError(404, 'Espacio no encontrado');
  }

  return espacio;
};

/**
 * Valida los datos de un espacio (nombre, capacidad y tipo de espacio).
 *
 * @param {Object} datos - Objeto con { nombre, descripcion, ubicacion, capacidad, tipo_espacio_id }.
 * @returns {Promise<Object>} Datos validados y normalizados.
 * @throws {ApiError} 400 si falta el nombre, la ubicación o la capacidad no es válida, 404 si el tipo no existe.
 */
const validarDatosEspacio = async (datos) => {
  const nombre = datos.nombre?.trim();

  if (!nombre) {
    throw new ApiError(400, 'El nombre es obligatorio');
  }

  const ubicacion = datos.ubicacion?.trim();

  if (!ubicacion) {
    throw new ApiError(400, 'La ubicación es obligatoria');
  }

  const capacidad = Number(datos.capacidad);

  if (!Number.isInteger(capacidad) || capacidad <= 0) {
    throw new ApiError(400, 'La capacidad debe ser un número entero mayor a 0');
  }

  const tipoEspacioId = Number(datos.tipo_espacio_id);

  if (!Number.isInteger(tipoEspacioId) || tipoEspacioId <= 0) {
    throw new ApiError(400, 'El tipo de espacio es obligatorio');
  }

  const tipoExiste = await tipoEspacioRepository.obtenerPorId(tipoEspacioId);

  if (!tipoExiste) {
    throw new ApiError(404, 'Tipo de espacio no encontrado');
  }

  return {
    nombre,
    descripcion: datos.descripcion ?? null,
    ubicacion,
    capacidad,
    tipo_espacio_id: tipoEspacioId,
  };
};

/**
 * Crea un espacio validando los datos de entrada.
 *
 * @param {Object} datos - Objeto con { nombre, descripcion, ubicacion, capacidad, tipo_espacio_id }.
 * @returns {Promise<Object>} Espacio creado.
 */
const crearEspacio = async (datos) => {
  const datosValidados = await validarDatosEspacio(datos);
  const id = await espacioRepository.crear(datosValidados);
  return espacioRepository.obtenerPorId(id);
};

/**
 * Actualiza un espacio validando que exista y los datos de entrada.
 *
 * @param {number} id - Identificador del espacio.
 * @param {Object} datos - Objeto con { nombre, descripcion, ubicacion, capacidad, tipo_espacio_id }.
 * @returns {Promise<Object>} Espacio actualizado.
 * @throws {ApiError} 400/404 según corresponda.
 */
const actualizarEspacio = async (id, datos) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new ApiError(400, 'El id debe ser un número entero positivo');
  }

  const espacio = await espacioRepository.obtenerPorId(id);

  if (!espacio) {
    throw new ApiError(404, 'Espacio no encontrado');
  }

  const datosValidados = await validarDatosEspacio(datos);
  await espacioRepository.actualizar(id, datosValidados);

  return espacioRepository.obtenerPorId(id);
};

/**
 * Elimina físicamente un espacio, validando que exista.
 *
 * @param {number} id - Identificador del espacio.
 * @returns {Promise<void>}
 * @throws {ApiError} 400 si el id no es válido, 404 si no existe.
 */
const eliminarEspacio = async (id) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new ApiError(400, 'El id debe ser un número entero positivo');
  }

  const espacio = await espacioRepository.obtenerPorId(id);

  if (!espacio) {
    throw new ApiError(404, 'Espacio no encontrado');
  }

  await espacioRepository.eliminar(id);
};

/**
 * Desactiva lógicamente un espacio (activo = 0), validando que exista.
 *
 * @param {number} id - Identificador del espacio.
 * @returns {Promise<void>}
 * @throws {ApiError} 400 si el id no es válido, 404 si no existe.
 */
const desactivarEspacio = async (id) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new ApiError(400, 'El id debe ser un número entero positivo');
  }

  const espacio = await espacioRepository.obtenerPorId(id);

  if (!espacio) {
    throw new ApiError(404, 'Espacio no encontrado');
  }

  await espacioRepository.desactivar(id);
};

/**
 * Obtiene los espacios disponibles en una fecha y rango horario.
 *
 * @param {string} fecha - Fecha en formato YYYY-MM-DD.
 * @param {string} horaInicio - Hora de inicio.
 * @param {string} horaFin - Hora de fin.
 * @returns {Promise<Array<Object>>} Espacios disponibles.
 * @throws {ApiError} 400 si falta alguno de los parámetros.
 */
const obtenerEspaciosDisponibles = async (fecha, horaInicio, horaFin) => {
  if (!fecha || !horaInicio || !horaFin) {
    throw new ApiError(400, 'fecha, hora_inicio y hora_fin son obligatorios');
  }

  return espacioRepository.obtenerDisponibles(fecha, horaInicio, horaFin);
};

export default {
  obtenerEspacios,
  obtenerEspacio,
  crearEspacio,
  actualizarEspacio,
  eliminarEspacio,
  desactivarEspacio,
  obtenerEspaciosDisponibles,
};
