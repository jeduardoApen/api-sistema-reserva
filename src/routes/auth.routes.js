/**
 * Propósito: Rutas de autenticación. Define el endpoint de login y delega al Controller.
 *
 * @warning No incluye lógica de negocio ni SQL.
 *
 * @example
 * // POST /api/auth/login
 *
 * Código Nativo/Framework: Express.js - Router montado bajo /api/auth.
 */
import { Router } from 'express';
import authController from '../controllers/auth.controller.js';

const router = Router();

router.post('/login', authController.login);

export default router;
