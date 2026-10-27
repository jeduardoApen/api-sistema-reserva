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

// TODO: Implementar el CRUD completo de usuarios (listar, crear, actualizar, eliminar).

export default { obtenerPorCorreo };
