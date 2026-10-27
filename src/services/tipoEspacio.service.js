/**
 * Propósito: Service de tipos de espacio. Contiene las reglas de negocio del recurso
 *           y usa el Repository para acceder a los datos.
 *
 * @warning No ejecutes consultas SQL aquí; delega el acceso a datos al Repository.
 *
 * @example
 * import tipoEspacioService from '../services/tipoEspacio.service.js';
 * const tipos = await tipoEspacioService.listarTipos();
 *
 * Código Nativo: Node.js - funciones de negocio que orquestan al Repository.
 */
import tipoEspacioRepository from '../repositories/tipoEspacio.repository.js';

/**
 * Lista todos los tipos de espacio.
 *
 * @returns {Promise<Array<Object>>} Lista de tipos de espacio.
 */
const listarTipos = async () => {
  return tipoEspacioRepository.findAll();
};

export default { listarTipos };
