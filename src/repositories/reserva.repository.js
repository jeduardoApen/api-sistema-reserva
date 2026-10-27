/**
 * Propósito: Repository de reservas. Accede a MySQL (tabla `reservas`) mediante el
 *           pool de conexiones; aquí viven las consultas SQL.
 *
 * @warning No ejecutes lógica de negocio aquí; este módulo solo accede a datos.
 * @note Todas las consultas usan consultas parametrizadas (pool.execute) para evitar SQL injection.
 *
 * @example
 * import reservaRepository from '../repositories/reserva.repository.js';
 * const reservas = await reservaRepository.obtenerTodos();
 *
 * Código Nativo/Framework: Node.js + mysql2/promise - pool.execute() sobre la tabla reservas.
 */
import pool from '../config/database.js';

/**
 * Obtiene todas las reservas con sus relaciones (usuario, espacio y estado).
 *
 * @returns {Promise<Array<Object>>} Lista de reservas.
 */
const obtenerTodos = async () => {
  const [rows] = await pool.execute(
    `SELECT r.id, r.fecha_reserva, r.hora_inicio, r.hora_fin,
            r.motivo, r.nombre_cliente, r.observaciones,
            r.usuario_id, CONCAT(u.nombre, ' ', u.apellido) AS usuario_nombre,
            r.espacio_id, e.nombre AS espacio_nombre,
            r.estado_id, er.nombre AS estado_nombre,
            r.created_at, r.updated_at
     FROM reservas r
     JOIN usuarios u         ON u.id = r.usuario_id
     JOIN espacios e         ON e.id = r.espacio_id
     JOIN estados_reserva er ON er.id = r.estado_id
     ORDER BY r.fecha_reserva DESC, r.hora_inicio DESC`,
  );
  return rows;
};

/**
 * Obtiene una reserva por su id, con sus relaciones.
 *
 * @param {number} id - Identificador de la reserva.
 * @returns {Promise<Object|undefined>} Reserva encontrada o undefined.
 */
const obtenerPorId = async (id) => {
  const [rows] = await pool.execute(
    `SELECT r.id, r.fecha_reserva, r.hora_inicio, r.hora_fin,
            r.motivo, r.nombre_cliente, r.observaciones,
            r.usuario_id, CONCAT(u.nombre, ' ', u.apellido) AS usuario_nombre,
            r.espacio_id, e.nombre AS espacio_nombre,
            r.estado_id, er.nombre AS estado_nombre,
            r.created_at, r.updated_at
     FROM reservas r
     JOIN usuarios u         ON u.id = r.usuario_id
     JOIN espacios e         ON e.id = r.espacio_id
     JOIN estados_reserva er ON er.id = r.estado_id
     WHERE r.id = ?`,
    [id],
  );
  return rows[0];
};

/**
 * Inserta una nueva reserva.
 *
 * @param {Object} datos - Datos de la reserva (usuario_id, espacio_id, fecha_reserva,
 *                         hora_inicio, hora_fin, motivo, nombre_cliente, estado_id, observaciones).
 * @returns {Promise<number>} id de la reserva creada.
 */
const crear = async (datos) => {
  const [result] = await pool.execute(
    `INSERT INTO reservas
       (usuario_id, espacio_id, fecha_reserva, hora_inicio, hora_fin,
        motivo, nombre_cliente, estado_id, observaciones, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      datos.usuario_id,
      datos.espacio_id,
      datos.fecha_reserva,
      datos.hora_inicio,
      datos.hora_fin,
      datos.motivo,
      datos.nombre_cliente,
      datos.estado_id,
      datos.observaciones,
    ],
  );
  return result.insertId;
};

/**
 * Actualiza todos los datos de una reserva.
 *
 * @param {number} id - Identificador de la reserva.
 * @param {Object} datos - Datos de la reserva.
 * @returns {Promise<number>} Número de filas afectadas.
 */
const actualizar = async (id, datos) => {
  const [result] = await pool.execute(
    `UPDATE reservas
     SET usuario_id = ?, espacio_id = ?, fecha_reserva = ?, hora_inicio = ?,
         hora_fin = ?, motivo = ?, nombre_cliente = ?, estado_id = ?,
         observaciones = ?, updated_at = NOW()
     WHERE id = ?`,
    [
      datos.usuario_id,
      datos.espacio_id,
      datos.fecha_reserva,
      datos.hora_inicio,
      datos.hora_fin,
      datos.motivo,
      datos.nombre_cliente,
      datos.estado_id,
      datos.observaciones,
      id,
    ],
  );
  return result.affectedRows;
};

/**
 * Actualiza solo el estado de una reserva (útil para cancelar o confirmar).
 *
 * @param {number} id - Identificador de la reserva.
 * @param {number} estadoId - Nuevo estado.
 * @returns {Promise<number>} Número de filas afectadas.
 */
const actualizarEstado = async (id, estadoId) => {
  const [result] = await pool.execute(
    `UPDATE reservas SET estado_id = ?, updated_at = NOW() WHERE id = ?`,
    [estadoId, id],
  );
  return result.affectedRows;
};

/**
 * Elimina físicamente una reserva.
 *
 * @param {number} id - Identificador de la reserva.
 * @returns {Promise<number>} Número de filas afectadas.
 */
const eliminar = async (id) => {
  const [result] = await pool.execute(`DELETE FROM reservas WHERE id = ?`, [id]);
  return result.affectedRows;
};

/**
 * Obtiene las reservas de un espacio en una fecha determinada.
 *
 * @param {number} espacioId - Identificador del espacio.
 * @param {string} fecha - Fecha en formato YYYY-MM-DD.
 * @returns {Promise<Array<Object>>} Reservas del espacio en esa fecha.
 */
const obtenerPorEspacioFecha = async (espacioId, fecha) => {
  const [rows] = await pool.execute(
    `SELECT r.id, r.hora_inicio, r.hora_fin, r.nombre_cliente,
            er.nombre AS estado_nombre
     FROM reservas r
     JOIN estados_reserva er ON er.id = r.estado_id
     WHERE r.espacio_id = ?
       AND r.fecha_reserva = ?
     ORDER BY r.hora_inicio`,
    [espacioId, fecha],
  );
  return rows;
};

/**
 * Obtiene las reservas dentro de un rango de fechas.
 *
 * @param {string} desde - Fecha inicial (YYYY-MM-DD).
 * @param {string} hasta - Fecha final (YYYY-MM-DD).
 * @returns {Promise<Array<Object>>} Reservas en el rango.
 */
const obtenerPorRango = async (desde, hasta) => {
  const [rows] = await pool.execute(
    `SELECT r.id, r.fecha_reserva, r.hora_inicio, r.hora_fin,
            e.nombre AS espacio_nombre, r.nombre_cliente, er.nombre AS estado_nombre
     FROM reservas r
     JOIN espacios e         ON e.id = r.espacio_id
     JOIN estados_reserva er ON er.id = r.estado_id
     WHERE r.fecha_reserva BETWEEN ? AND ?
     ORDER BY r.fecha_reserva, r.hora_inicio`,
    [desde, hasta],
  );
  return rows;
};

/**
 * Obtiene las reservas filtradas por estado.
 *
 * @param {number} estadoId - Identificador del estado.
 * @returns {Promise<Array<Object>>} Reservas con ese estado.
 */
const obtenerPorEstado = async (estadoId) => {
  const [rows] = await pool.execute(
    `SELECT r.id, r.fecha_reserva, r.hora_inicio, r.hora_fin,
            e.nombre AS espacio_nombre, r.nombre_cliente
     FROM reservas r
     JOIN espacios e ON e.id = r.espacio_id
     WHERE r.estado_id = ?
     ORDER BY r.fecha_reserva, r.hora_inicio`,
    [estadoId],
  );
  return rows;
};

/**
 * Encuentra las reservas que se cruzan con el horario solicitado para un espacio.
 * Excluye el estado "Cancelada" (por id) y, opcionalmente, una reserva concreta.
 *
 * @warning El solapamiento se excluye usando el id del estado "Cancelada", no su nombre.
 * @param {number} espacioId - Identificador del espacio.
 * @param {string} fecha - Fecha en formato YYYY-MM-DD.
 * @param {string} horaInicio - Hora de inicio solicitada.
 * @param {string} horaFin - Hora de fin solicitada.
 * @param {number} [excluirId=0] - Reserva a ignorar (0 = ninguna).
 * @returns {Promise<Array<Object>>} Reservas en conflicto.
 */
const encontrarConflictos = async (espacioId, fecha, horaInicio, horaFin, excluirId = 0) => {
  const [estadoCancelada] = await pool.execute(
    `SELECT id FROM estados_reserva WHERE nombre = 'Cancelada' LIMIT 1`,
  );
  const idCancelada = estadoCancelada[0]?.id ?? 0;

  const [rows] = await pool.execute(
    `SELECT r.id, r.hora_inicio, r.hora_fin, r.nombre_cliente, er.nombre AS estado_nombre
     FROM reservas r
     JOIN estados_reserva er ON er.id = r.estado_id
     WHERE r.espacio_id = ?
       AND r.fecha_reserva = ?
       AND r.hora_inicio < ?
       AND r.hora_fin    > ?
       AND r.estado_id <> ?
       AND r.id <> ?`,
    [espacioId, fecha, horaFin, horaInicio, idCancelada, excluirId],
  );
  return rows;
};

export default {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  actualizarEstado,
  eliminar,
  obtenerPorEspacioFecha,
  obtenerPorRango,
  obtenerPorEstado,
  encontrarConflictos,
};
