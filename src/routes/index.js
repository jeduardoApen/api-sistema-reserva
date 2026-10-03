/**
 * Propósito: Punto central de rutas; registra el health check y monta las rutas de
 *           los módulos (espacios, reservas, usuarios, dashboard) bajo el prefijo /api.
 *
 * @warning Este router se monta en app.js con `app.use('/api', apiRoutes)`, por lo que
 *          las rutas aquí definidas quedarán precedidas por /api.
 * @note El health check NO consulta MySQL; solo verifica que Express funciona.
 *
 * @example
 * // GET http://localhost:3000/api/health
 * // => { "success": true, "message": "API de reserva de espacios funcionando correctamente" }
 *
 * Código Nativo/Framework: Express.js - Router raíz que delega a los routers de cada módulo.
 */
import { Router } from 'express';

import espacioRoutes from './espacio.routes.js';
import reservaRoutes from './reserva.routes.js';
import usuarioRoutes from './usuario.routes.js';
import dashboardRoutes from './dashboard.routes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API de reserva de espacios funcionando correctamente',
  });
});

router.use('/espacios', espacioRoutes);
router.use('/reservas', reservaRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
