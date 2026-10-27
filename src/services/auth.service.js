/**
 * Propósito: Service de autenticación. Valida las credenciales de un usuario (login).
 *
 * @warning Autenticación DIDÁCTICA: las contraseñas se comparan en TEXTO PLANO.
 *          No usar en producción; reemplazar por JWT + bcrypt.
 *
 * @example
 * import authService from '../services/auth.service.js';
 * const usuario = await authService.iniciarSesion('admin@test.com', '123456');
 *
 * Código Nativo: Node.js - funciones de negocio que orquestan al Repository.
 */
import usuarioRepository from '../repositories/usuario.repository.js';
import ApiError from '../utils/ApiError.js';

/**
 * Valida correo y contraseña y devuelve el usuario autenticado (sin el password).
 *
 * @param {string} correo - Correo del usuario.
 * @param {string} password - Contraseña en texto plano.
 * @returns {Promise<Object>} Usuario autenticado (sin password).
 * @throws {ApiError} 400 si faltan datos, 401 si las credenciales son inválidas.
 */
const iniciarSesion = async (correo, password) => {
  if (!correo || !password) {
    throw new ApiError(400, 'El correo y la contraseña son obligatorios');
  }

  const usuario = await usuarioRepository.obtenerPorCorreo(correo);

  if (!usuario || usuario.password !== password) {
    throw new ApiError(401, 'Credenciales inválidas');
  }

  const { password: _password, ...usuarioSeguro } = usuario;
  return usuarioSeguro;
};

export default { iniciarSesion };
