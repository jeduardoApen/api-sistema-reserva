/**
 * Propósito: Controller de tipos de espacio. Administra la comunicación HTTP (req/res)
 *           y delega la lógica al Service.
 *
 * @warning No incluye SQL ni reglas de negocio.
 *
 * @example
 * // Se usa en tipoEspacio.routes.js: router.get('/obtener-tipos', obtenerTipos);
 *
 * Código Nativo/Framework: Express.js - res.json() para responder al cliente.
 */
import tipoEspacioService from '../services/tipoEspacio.service.js';

/**
 * GET /api/tipos-espacio/obtener-tipos
 * Responde con la lista completa de tipos de espacio.
 */
const obtenerTipos = async (req, res) => {
  const tipos = await tipoEspacioService.listarTipos();
  res.json({ success: true, data: tipos });
};

export default { obtenerTipos };
