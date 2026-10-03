/**
 * Propósito: Crea y configura la instancia de Express: middlewares generales,
 *           registro de rutas, manejo de rutas inexistentes y de errores.
 *
 * @warning No utilices `app.listen()` aquí; el servidor se levanta en server.js.
 *
 * @example
 * import app from './app.js';
 * app.listen(3000);
 *
 * Código Nativo/Framework: Express.js - instancia `express()` con los middlewares
 * json, cors, helmet y morgan, y las rutas montadas bajo /api.
 */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import apiRoutes from './routes/index.js';
import notFound from './middlewares/notFound.middleware.js';
import errorHandler from './middlewares/error.middleware.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
