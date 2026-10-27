/**
 * Propósito: Repository de estados de reserva. Accede a MySQL (tabla `estados_reserva`)
 *           mediante el pool de conexiones; aquí viven las consultas SQL.
 *
 * @warning No ejecutes lógica de negocio aquí; este módulo solo accede a datos.
 * @note Todas las consultas usan consultas parametrizadas (pool.execute) para evitar SQL injection.
 *
 * @example
 * import estadoReservaRepository from '../repositories/estadoReserva.repository.js';
 * const estados = await estadoReservaRepository.obtenerTodos();
 *
 * Código Nativo/Framework: Node.js + mysql2/promise - pool.execute() sobre la tabla estados_reserva.
 */
import pool from '../config/database.js';

/**
 * Obtiene todos los estados de reserva ordenados por nombre.
 *
 * @returns {Promise<Array<Object>>} Lista de estados de reserva.
 */
const obtenerTodos = async () => {
  const [rows] = await pool.execute(
    `SELECT id, nombre FROM estados_reserva ORDER BY nombre`,
  );
  return rows;
};

/**
 * Obtiene un estado de reserva por su id.
 *
 * @param {number} id - Identificador del estado.
 * @returns {Promise<Object|undefined>} Estado encontrado o undefined.
 */
const obtenerPorId = async (id) => {
  const [rows] = await pool.execute(
    `SELECT id, nombre FROM estados_reserva WHERE id = ?`,
    [id],
  );
  return rows[0];
};

/**
 * Inserta un nuevo estado de reserva.
 *
 * @param {Object} datos - Objeto con { nombre }.
 * @returns {Promise<number>} id del estado creado.
 */
const crear = async ({ nombre }) => {
  const [result] = await pool.execute(
    `INSERT INTO estados_reserva (nombre) VALUES (?)`,
    [nombre],
  );
  return result.insertId;
};

/**
 * Actualiza el nombre de un estado de reserva.
 *
 * @param {number} id - Identificador del estado.
 * @param {Object} datos - Objeto con { nombre }.
 * @returns {Promise<number>} Número de filas afectadas.
 */
const actualizar = async (id, { nombre }) => {
  const [result] = await pool.execute(
    `UPDATE estados_reserva SET nombre = ? WHERE id = ?`,
    [nombre, id],
  );
  return result.affectedRows;
};

/**
 * Elimina físicamente un estado de reserva.
 *
 * @param {number} id - Identificador del estado.
 * @returns {Promise<number>} Número de filas afectadas.
 */
const eliminar = async (id) => {
  const [result] = await pool.execute(
    `DELETE FROM estados_reserva WHERE id = ?`,
    [id],
  );
  return result.affectedRows;
};

export default { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };
