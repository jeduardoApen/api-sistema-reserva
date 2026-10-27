/**
 * Propósito: Controller de autenticación. Administra la comunicación HTTP del login.
 *
 * @warning No incluye SQL ni reglas de negocio.
 *
 * @example
 * // Se usa en auth.routes.js: router.post('/login', login);
 *
 * Código Nativo/Framework: Express.js - res.json() para responder al cliente.
 */
import authService from '../services/auth.service.js';

/**
 * POST /api/auth/login
 * Recibe { correo, password } y devuelve el usuario autenticado.
 */
const login = async (req, res) => {
  const { correo, password } = req.body;
  const usuario = await authService.iniciarSesion(correo, password);
  res.json({ success: true, data: usuario });
};

export default { login };
