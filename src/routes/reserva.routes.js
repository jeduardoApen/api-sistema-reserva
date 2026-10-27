/**
 * Propósito: Rutas del recurso reservas. Define los endpoints y delega a los Controllers.
 *
 * @warning No incluye lógica de negocio ni SQL.
 *
 * @example
 * // GET /api/reservas/obtener-reservas
 *
 * Código Nativo/Framework: Express.js - Router montado bajo /api/reservas.
 */
import { Router } from 'express';
import reservaController from '../controllers/reserva.controller.js';

const router = Router();

router.get('/obtener-reservas', reservaController.obtenerReservas);
router.get('/obtener-reserva/:id', reservaController.obtenerReserva);
router.post('/crear-reserva', reservaController.crearReserva);
router.put('/actualizar-reserva/:id', reservaController.actualizarReserva);
router.patch('/cambiar-estado/:id', reservaController.cambiarEstado);
router.delete('/eliminar-reserva/:id', reservaController.eliminarReserva);

router.get('/obtener-por-espacio', reservaController.obtenerPorEspacio);
router.get('/obtener-por-rango', reservaController.obtenerPorRango);
router.get('/obtener-por-estado/:estadoId', reservaController.obtenerPorEstado);
router.get('/verificar-disponibilidad', reservaController.verificarDisponibilidad);

export default router;
