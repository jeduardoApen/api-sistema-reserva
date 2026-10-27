/**
 * Propósito: Repository de tipos de espacio. Accede a MySQL (tabla `tipos_espacio`)
 *           mediante el pool de conexiones; aquí viven las consultas SQL.
 *
 * @warning No ejecutes lógica de negocio aquí; este módulo solo accede a datos.
 * @note Todas las consultas usan consultas parametrizadas (pool.execute) para evitar SQL injection.
 *
 * @example
 * import tipoEspacioRepository from '../repositories/tipoEspacio.repository.js';
 * const tipos = await tipoEspacioRepository.findAll();
 *
 * Código Nativo/Framework: Node.js + mysql2/promise - pool.execute() sobre la tabla tipos_espacio.
 */
import pool from '../config/database.js';

/**
 * Obtiene todos los tipos de espacio ordenados por nombre.
 *
 * @returns {Promise<Array<Object>>} Lista de tipos de espacio.
 */
const findAll = async () => {
  const [rows] = await pool.execute(
    `SELECT id, nombre, descripcion, activo, created_at, updated_at
     FROM tipos_espacio
     ORDER BY nombre`,
  );
  return rows;
};

export default { findAll };
