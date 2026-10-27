/**
 * Propósito: Service de usuarios. Contiene las reglas de negocio del recurso
 *           y usa el Repository para acceder a los datos.
 *
 * @warning No ejecutes consultas SQL aquí; delega el acceso a datos al Repository.
 *
 * @example
 * import usuarioService from '../services/usuario.service.js';
 * const usuarios = await usuarioService.obtenerUsuarios();
 *
 * Código Nativo: Node.js - funciones de negocio que orquestan al Repository.
 */
import usuarioRepository from '../repositories/usuario.repository.js';

/**
 * Lista los usuarios, opcionalmente solo los activos.
 *
 * @param {string} [activo] - Query param "1" para filtrar solo usuarios activos.
 * @returns {Promise<Array<Object>>} Lista de usuarios (sin password).
 */
const obtenerUsuarios = async (activo) => {
  const soloActivos = activo === '1';
  return usuarioRepository.obtenerTodos(soloActivos);
};

export default { obtenerUsuarios };
