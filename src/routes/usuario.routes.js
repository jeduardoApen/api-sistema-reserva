/**
 * Propósito: Rutas del recurso usuarios. Define los endpoints y delega a los Controllers.
 *
 * @warning No incluye lógica de negocio ni SQL.
 *
 * @example
 * // GET /api/usuarios/obtener-usuarios
 *
 * Código Nativo/Framework: Express.js - Router montado bajo /api/usuarios.
 */
import { Router } from 'express';
import usuarioController from '../controllers/usuario.controller.js';

const router = Router();

router.get('/obtener-usuarios', usuarioController.obtenerUsuarios);

export default router;
