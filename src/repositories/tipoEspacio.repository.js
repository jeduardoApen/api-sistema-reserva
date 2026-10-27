/**
 * Propósito: Repository de tipos de espacio. Accede a MySQL (tabla `tipos_espacio`)
 *           mediante el pool de conexiones; aquí viven las consultas SQL.
 *
 * @warning No ejecutes lógica de negocio aquí; este módulo solo accede a datos.
 * @note Todas las consultas usan consultas parametrizadas (pool.execute) para evitar SQL injection.
 *
 * @example
 * import tipoEspacioRepository from '../repositories/tipoEspacio.repository.js';
 * const tipos = await tipoEspacioRepository.obtenerTodos();
 *
 * Código Nativo/Framework: Node.js + mysql2/promise - pool.execute() sobre la tabla tipos_espacio.
 */
import pool from "../config/database.js";

/**
 * Obtiene todos los tipos de espacio ordenados por nombre.
 *
 * @returns {Promise<Array<Object>>} Lista de tipos de espacio.
 */
const obtenerTodos = async () => {
  const [rows] = await pool.execute(
    `SELECT id, nombre, descripcion, activo, created_at, updated_at
     FROM tipos_espacio
     ORDER BY nombre`,
  );
  return rows;
};

/**
 * Obtiene un tipo de espacio por su id.
 *
 * @param {number} id - Identificador del tipo de espacio.
 * @returns {Promise<Object|undefined>} Tipo de espacio encontrado o undefined si no existe.
 */
const obtenerPorId = async (id) => {
  const [rows] = await pool.execute(
    `SELECT id, nombre, descripcion, activo, created_at, updated_at
     FROM tipos_espacio
     WHERE id = ?`,
    [id],
  );
  return rows[0];
};

/**
 * Inserta un nuevo tipo de espacio.
 *
 * @param {Object} datos - Objeto con las propiedades { nombre, descripcion }.
 * @returns {Promise<number>} id del tipo de espacio creado.
 */
const crear = async ({ nombre, descripcion }) => {
  const [result] = await pool.execute(
    `INSERT INTO tipos_espacio (nombre, descripcion, created_at, updated_at)
     VALUES (?, ?, NOW(), NOW())`,
    [nombre, descripcion],
  );
  return result.insertId;
};

/**
 * Actualiza el nombre y la descripción de un tipo de espacio.
 *
 * @param {number} id - Identificador del tipo de espacio.
 * @param {Object} datos - Objeto con { nombre, descripcion }.
 * @returns {Promise<number>} Número de filas afectadas.
 */
const actualizar = async (id, { nombre, descripcion }) => {
  const [result] = await pool.execute(
    `UPDATE tipos_espacio
     SET nombre = ?, descripcion = ?, updated_at = NOW()
     WHERE id = ?`,
    [nombre, descripcion, id],
  );
  return result.affectedRows;
};

/**
 * Elimina físicamente un tipo de espacio.
 *
 * @param {number} id - Identificador del tipo de espacio.
 * @returns {Promise<number>} Número de filas afectadas.
 */
const eliminar = async (id) => {
  const [result] = await pool.execute(
    `DELETE FROM tipos_espacio WHERE id = ?`,
    [id],
  );
  return result.affectedRows;
};

/**
 * Desactiva lógicamente un tipo de espacio (activo = 0).
 *
 * @param {number} id - Identificador del tipo de espacio.
 * @returns {Promise<number>} Número de filas afectadas.
 */
const desactivar = async (id) => {
  const [result] = await pool.execute(
    `UPDATE tipos_espacio SET activo = 0, updated_at = NOW() WHERE id = ?`,
    [id],
  );
  return result.affectedRows;
};

export default { obtenerTodos, obtenerPorId, crear, actualizar, eliminar, desactivar };
