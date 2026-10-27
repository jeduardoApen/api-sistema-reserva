/**
 * Propósito: Rutas del recurso estados de reserva. Define los endpoints y delega a los Controllers.
 *
 * @warning No incluye lógica de negocio ni SQL.
 *
 * @example
 * // GET /api/estados-reserva/obtener-estados
 *
 * Código Nativo/Framework: Express.js - Router montado bajo /api/estados-reserva.
 */
import { Router } from 'express';
import estadoReservaController from '../controllers/estadoReserva.controller.js';

const router = Router();

router.get('/obtener-estados', estadoReservaController.obtenerEstados);
router.get('/obtener-estado/:id', estadoReservaController.obtenerEstado);
router.post('/crear-estado', estadoReservaController.crearEstado);
router.put('/actualizar-estado/:id', estadoReservaController.actualizarEstado);
router.delete('/eliminar-estado/:id', estadoReservaController.eliminarEstado);

export default router;
