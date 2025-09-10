/**
 * @fileoverview Configuración de la conexión a la base de datos MySQL utilizando mysql2 y variables de entorno.
 * @module config/database
 */
import dotenv from 'dotenv';
import { createPool } from "mysql2/promise";

// Carga las variables de entorno desde el archivo .env
dotenv.config();
// Database configuration
/**
 * Configuración de la base de datos.
 * Se pueden modificar mediante variables de entorno en un archivo `.env`:
 * 
 * - DB_HOST
 * - DB_USER
 * - DB_PASSWORD
 * - DB_NAME
 * - DB_PORT
 * 
 * Si no se especifican, se usan los valores por defecto.
 */
const dbConfig = {
  host:process.env.DB_HOST|| 'localhost',
  user:process.env.DB_USER|| 'root',
  password:process.env.DB_PASSWORD|| '',
  database:process.env.DB_NAME|| 'sist_control',
  port:process.env.DB_PORT||'3306'
};
/**
 * Pool de conexiones reutilizable para interactuar con la base de datos.
 * Usa Promises para facilitar operaciones asíncronas con `async/await`.
 * 
 * @type {import('mysql2/promise').Pool}
 */
export const connect = createPool(dbConfig);