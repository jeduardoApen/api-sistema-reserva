/**
 * Propósito: Repository de usuarios. Accede a MySQL (tabla `usuarios`) mediante el pool.
 *
 * @warning No ejecutes lógica de negocio aquí; este módulo solo accede a datos.
 * @note Todas las consultas usan consultas parametrizadas (pool.execute) para evitar SQL injection.
 *
 * @example
 * import usuarioRepository from '../repositories/usuario.repository.js';
 * const usuario = await usuarioRepository.obtenerPorCorreo('admin@test.com');
 *
 * Código Nativo/Framework: Node.js + mysql2/promise - pool.execute() sobre la tabla usuarios.
 */
import pool from '../config/database.js';

/**
 * Obtiene un usuario por su correo (incluye el password para validar el login).
 *
 * @param {string} correo - Correo del usuario.
 * @returns {Promise<Object|undefined>} Usuario encontrado o undefined.
 */
const obtenerPorCorreo = async (correo) => {
  const [rows] = await pool.execute(
    `SELECT id, nombre, apellido, correo, password, telefono, activo
     FROM usuarios
     WHERE correo = ?`,
    [correo],
  );
  return rows[0];
};

/**
 * Obtiene los usuarios, opcionalmente solo los activos.
 *
 * @param {boolean} [soloActivos=false] - Si es true, filtra activo = 1.
 * @returns {Promise<Array<Object>>} Lista de usuarios (sin password).
 */
const obtenerTodos = async (soloActivos = false) => {
  const sql = `
    SELECT id, nombre, apellido, correo, telefono, activo, created_at, updated_at
    FROM usuarios
    ${soloActivos ? 'WHERE activo = 1' : ''}
    ORDER BY id
  `;
  const [rows] = await pool.execute(sql);
  return rows;
};

// TODO: Implementar crear, actualizar y eliminar usuarios.

export default { obtenerPorCorreo, obtenerTodos };
