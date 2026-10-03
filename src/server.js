/**
 * Propósito: Punto de entrada de la aplicación; importa `app`, obtiene el puerto
 *           desde las variables de entorno y levanta el servidor HTTP.
 *
 * @warning No agregues lógica de negocio aquí; este archivo solo inicia el servidor.
 *
 * @example
 * // npm run dev   => arranca con node --watch
 * // npm start     => arranca en producción
 *
 * Código Nativo: Node.js - `app.listen()` del módulo Express para escuchar peticiones.
 */
import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});
