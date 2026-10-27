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
import pool from '../config/database.js';

import espacioRoutes from './espacio.routes.js';
import reservaRoutes from './reserva.routes.js';
import usuarioRoutes from './usuario.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import tipoEspacioRoutes from './tipoEspacio.routes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API de reserva de espacios funcionando correctamente',
  });
});

router.get("/test-db", async (req, res) => {
 
    const [rows] = await pool.query(`
      SELECT
        DATABASE() AS base_datos,
        VERSION() AS version_mysql,
        NOW() AS fecha_servidor
    `);

    res.json({
      success: true,
      message: "Conexión exitosa a Azure MySQL",
      data: rows[0]
    })
  });

router.use('/espacios', espacioRoutes);
router.use('/reservas', reservaRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/tipos-espacio', tipoEspacioRoutes);

export default router;
