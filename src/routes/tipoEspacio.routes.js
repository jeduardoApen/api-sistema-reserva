/**
 * Propósito: Rutas del recurso tipos de espacio. Define los endpoints y delega a los Controllers.
 *
 * @warning No incluye lógica de negocio ni SQL.
 *
 * @example
 * // GET /api/tipos-espacio/obtener-tipos
 *
 * Código Nativo/Framework: Express.js - Router montado bajo /api/tipos-espacio.
 */
import { Router } from 'express';
import tipoEspacioController from '../controllers/tipoEspacio.controller.js';

const router = Router();

router.get('/obtener-tipos', tipoEspacioController.obtenerTipos);
router.get('/obtener-tipo/:id', tipoEspacioController.obtenerTipo);

export default router;
