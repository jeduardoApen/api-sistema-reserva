/**
 * Propósito: Service de tipos de espacio. Contiene las reglas de negocio del recurso
 *           y usa el Repository para acceder a los datos.
 *
 * @warning No ejecutes consultas SQL aquí; delega el acceso a datos al Repository.
 *
 * @example
 * import tipoEspacioService from '../services/tipoEspacio.service.js';
 * const tipos = await tipoEspacioService.obtenerTipos();
 *
 * Código Nativo: Node.js - funciones de negocio que orquestan al Repository.
 */
import tipoEspacioRepository from "../repositories/tipoEspacio.repository.js";
import ApiError from "../utils/ApiError.js";

/**
 * Lista todos los tipos de espacio.
 *
 * @returns {Promise<Array<Object>>} Lista de tipos de espacio.
 */
const obtenerTipos = async () => {
  return tipoEspacioRepository.obtenerTodos();
};

/**
 * Obtiene un tipo de espacio por su id, validando que exista.
 *
 * @param {number} id - Identificador del tipo de espacio.
 * @returns {Promise<Object>} Tipo de espacio encontrado.
 * @throws {ApiError} 400 si el id no es válido o 404 si no existe.
 */
const obtenerTipo = async (id) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new ApiError(400, "El id debe ser un número entero positivo");
  }

  const tipo = await tipoEspacioRepository.obtenerPorId(id);

  if (!tipo) {
    throw new ApiError(404, "Tipo de espacio no encontrado");
  }

  return tipo;
};

/**
 * Crea un tipo de espacio validando los datos de entrada.
 *
 * @param {Object} datos - Objeto con { nombre, descripcion }.
 * @returns {Promise<Object>} Tipo de espacio creado.
 * @throws {ApiError} 400 si el nombre falta.
 */
const crearTipo = async (datos) => {
  const nombre = datos.nombre?.trim();

  if (!nombre) {
    throw new ApiError(400, "El nombre es obligatorio");
  }

  const id = await tipoEspacioRepository.crear({
    nombre,
    descripcion: datos.descripcion ?? null,
  });

  return tipoEspacioRepository.obtenerPorId(id);
};

/**
 * Actualiza un tipo de espacio validando los datos de entrada.
 *
 * @param {number} id - Identificador del tipo de espacio.
 * @param {Object} datos - Objeto con { nombre, descripcion }.
 * @returns {Promise<Object>} Tipo de espacio actualizado.
 * @throws {ApiError} 400 si el id no es válido o falta el nombre, 404 si no existe.
 */
const actualizarTipo = async (id, datos) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new ApiError(400, "El id debe ser un número entero positivo");
  }

  const nombre = datos.nombre?.trim();

  if (!nombre) {
    throw new ApiError(400, "El nombre es obligatorio");
  }

  const tipo = await tipoEspacioRepository.obtenerPorId(id);

  if (!tipo) {
    throw new ApiError(404, "Tipo de espacio no encontrado");
  }

  await tipoEspacioRepository.actualizar(id, {
    nombre,
    descripcion: datos.descripcion ?? null,
  });

  return tipoEspacioRepository.obtenerPorId(id);
};

/**
 * Elimina físicamente un tipo de espacio, validando que exista.
 *
 * @param {number} id - Identificador del tipo de espacio.
 * @returns {Promise<void>}
 * @throws {ApiError} 400 si el id no es válido, 404 si no existe.
 */
const eliminarTipo = async (id) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new ApiError(400, "El id debe ser un número entero positivo");
  }

  const tipo = await tipoEspacioRepository.obtenerPorId(id);

  if (!tipo) {
    throw new ApiError(404, "Tipo de espacio no encontrado");
  }

  await tipoEspacioRepository.eliminar(id);
};

/**
 * Desactiva lógicamente un tipo de espacio (activo = 0), validando que exista.
 *
 * @param {number} id - Identificador del tipo de espacio.
 * @returns {Promise<void>}
 * @throws {ApiError} 400 si el id no es válido, 404 si no existe.
 */
const desactivarTipo = async (id) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new ApiError(400, "El id debe ser un número entero positivo");
  }

  const tipo = await tipoEspacioRepository.obtenerPorId(id);

  if (!tipo) {
    throw new ApiError(404, "Tipo de espacio no encontrado");
  }

  await tipoEspacioRepository.desactivar(id);
};

export default { obtenerTipos, obtenerTipo, crearTipo, actualizarTipo, eliminarTipo, desactivarTipo };
