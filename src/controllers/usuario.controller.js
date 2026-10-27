/**
 * Propósito: Controller de usuarios. Administra la comunicación HTTP (req/res)
 *           y delega la lógica al Service.
 *
 * @warning No incluye SQL ni reglas de negocio.
 *
 * @example
 * // Se usa en usuario.routes.js: router.get('/obtener-usuarios', obtenerUsuarios);
 *
 * Código Nativo/Framework: Express.js - res.json() para responder al cliente.
 */
import usuarioService from '../services/usuario.service.js';

/**
 * GET /api/usuarios/obtener-usuarios
 * Responde con la lista de usuarios (opcional: ?activo=1).
 */
const obtenerUsuarios = async (req, res) => {
  const { activo } = req.query;
  const usuarios = await usuarioService.obtenerUsuarios(activo);
  res.json({ success: true, data: usuarios });
};

export default { obtenerUsuarios };
