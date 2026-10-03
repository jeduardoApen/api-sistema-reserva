/**
 * Propósito: Configura y exporta un pool de conexiones MySQL para que los
 *           Repositories accedan a la base de datos sin crear conexiones por petición.
 *
 * @warning No ejecutes consultas SQL del sistema aquí; este módulo solo expone el pool.
 * @note El pool se crea al importar este módulo, por lo que las variables de entorno
 *       deben estar cargadas (dotenv) antes de importarlo.
 *
 * @example
 * import pool from '../config/database.js';
 * const [filas] = await pool.execute('SELECT * FROM espacios WHERE id = ?', [id]);
 *
 * Código Nativo/Framework: Node.js + mysql2/promise - crea un pool reutilizable de
 * conexiones MySQL basado en las variables de entorno DB_*.
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
