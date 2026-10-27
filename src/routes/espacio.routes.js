/**
 * Propósito: Rutas del recurso espacios. Define los endpoints y delega a los Controllers.
 *
 * @warning No incluye lógica de negocio ni SQL.
 * @note La ruta /obtener-disponibles se registra antes de las rutas con :id por claridad.
 *
 * @example
 * // GET /api/espacios/obtener-espacios
 *
 * Código Nativo/Framework: Express.js - Router montado bajo /api/espacios.
 */
import { Router } from 'express';
import espacioController from '../controllers/espacio.controller.js';

const router = Router();

router.get('/obtener-disponibles', espacioController.obtenerDisponibles);
router.get('/obtener-espacios', espacioController.obtenerEspacios);
router.get('/obtener-espacio/:id', espacioController.obtenerEspacio);
router.post('/crear-espacio', espacioController.crearEspacio);
router.put('/actualizar-espacio/:id', espacioController.actualizarEspacio);
router.delete('/eliminar-espacio/:id', espacioController.eliminarEspacio);
router.post('/desactivar-espacio/:id', espacioController.desactivarEspacio);

export default router;
