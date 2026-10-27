/**
 * Propósito: Repository de espacios. Accede a MySQL (tabla `espacios`) mediante el
 *           pool de conexiones; aquí viven las consultas SQL.
 *
 * @warning No ejecutes lógica de negocio aquí; este módulo solo accede a datos.
 * @note Todas las consultas usan consultas parametrizadas (pool.execute) para evitar SQL injection.
 *
 * @example
 * import espacioRepository from '../repositories/espacio.repository.js';
 * const espacios = await espacioRepository.obtenerTodos();
 *
 * Código Nativo/Framework: Node.js + mysql2/promise - pool.execute() sobre la tabla espacios.
 */
import pool from '../config/database.js';

/**
 * Obtiene todos los espacios con el nombre de su tipo, ordenados por nombre.
 *
 * @returns {Promise<Array<Object>>} Lista de espacios.
 */
const obtenerTodos = async () => {
  const [rows] = await pool.execute(
    `SELECT e.id, e.nombre, e.descripcion, e.ubicacion, e.capacidad,
            e.tipo_espacio_id, t.nombre AS tipo_nombre, e.activo,
            e.created_at, e.updated_at
     FROM espacios e
     JOIN tipos_espacio t ON t.id = e.tipo_espacio_id
     ORDER BY e.nombre`,
  );
  return rows;
};

/**
 * Obtiene un espacio por su id, con el nombre de su tipo.
 *
 * @param {number} id - Identificador del espacio.
 * @returns {Promise<Object|undefined>} Espacio encontrado o undefined.
 */
const obtenerPorId = async (id) => {
  const [rows] = await pool.execute(
    `SELECT e.id, e.nombre, e.descripcion, e.ubicacion, e.capacidad,
            e.tipo_espacio_id, t.nombre AS tipo_nombre, e.activo,
            e.created_at, e.updated_at
     FROM espacios e
     JOIN tipos_espacio t ON t.id = e.tipo_espacio_id
     WHERE e.id = ?`,
    [id],
  );
  return rows[0];
};

/**
 * Inserta un nuevo espacio.
 *
 * @param {Object} datos - { nombre, descripcion, ubicacion, capacidad, tipo_espacio_id }.
 * @returns {Promise<number>} id del espacio creado.
 */
const crear = async ({ nombre, descripcion, ubicacion, capacidad, tipo_espacio_id }) => {
  const [result] = await pool.execute(
    `INSERT INTO espacios (nombre, descripcion, ubicacion, capacidad, tipo_espacio_id, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
    [nombre, descripcion, ubicacion, capacidad, tipo_espacio_id],
  );
  return result.insertId;
};

/**
 * Actualiza los datos de un espacio.
 *
 * @param {number} id - Identificador del espacio.
 * @param {Object} datos - { nombre, descripcion, ubicacion, capacidad, tipo_espacio_id }.
 * @returns {Promise<number>} Número de filas afectadas.
 */
const actualizar = async (id, { nombre, descripcion, ubicacion, capacidad, tipo_espacio_id }) => {
  const [result] = await pool.execute(
    `UPDATE espacios
     SET nombre = ?, descripcion = ?, ubicacion = ?, capacidad = ?,
         tipo_espacio_id = ?, updated_at = NOW()
     WHERE id = ?`,
    [nombre, descripcion, ubicacion, capacidad, tipo_espacio_id, id],
  );
  return result.affectedRows;
};

/**
 * Elimina físicamente un espacio.
 *
 * @param {number} id - Identificador del espacio.
 * @returns {Promise<number>} Número de filas afectadas.
 */
const eliminar = async (id) => {
  const [result] = await pool.execute(`DELETE FROM espacios WHERE id = ?`, [id]);
  return result.affectedRows;
};

/**
 * Desactiva lógicamente un espacio (activo = 0).
 *
 * @param {number} id - Identificador del espacio.
 * @returns {Promise<number>} Número de filas afectadas.
 */
const desactivar = async (id) => {
  const [result] = await pool.execute(
    `UPDATE espacios SET activo = 0, updated_at = NOW() WHERE id = ?`,
    [id],
  );
  return result.affectedRows;
};

/**
 * Obtiene los espacios activos que están libres en una fecha y rango horario dados.
 *
 * @warning Excluye las reservas en estado "Cancelada" usando su id (no el nombre literal).
 * @param {string} fecha - Fecha en formato YYYY-MM-DD.
 * @param {string} horaInicio - Hora de inicio solicitada.
 * @param {string} horaFin - Hora de fin solicitada.
 * @returns {Promise<Array<Object>>} Espacios disponibles (sin solapamiento).
 */
const obtenerDisponibles = async (fecha, horaInicio, horaFin) => {
  const [estadoCancelada] = await pool.execute(
    `SELECT id FROM estados_reserva WHERE nombre = 'Cancelada' LIMIT 1`,
  );
  const idCancelada = estadoCancelada[0]?.id ?? 0;

  const [rows] = await pool.execute(
    `SELECT e.id, e.nombre, e.ubicacion, e.capacidad, t.nombre AS tipo_nombre
     FROM espacios e
     JOIN tipos_espacio t ON t.id = e.tipo_espacio_id
     WHERE e.activo = 1
       AND e.id NOT IN (
           SELECT r.espacio_id
           FROM reservas r
           WHERE r.fecha_reserva = ?
             AND r.hora_inicio < ?
             AND r.hora_fin    > ?
             AND r.estado_id <> ?
       )
     ORDER BY e.nombre`,
    [fecha, horaFin, horaInicio, idCancelada],
  );
  return rows;
};

export default { obtenerTodos, obtenerPorId, crear, actualizar, eliminar, desactivar, obtenerDisponibles };
