// Importamos la aplicación principal de Express
import app from './app/app.js';
// Cargamos las variables de entorno desde el archivo .env
import dotenv from 'dotenv';


dotenv.config();
// Definimos el puerto en el que se ejecutará el servidor
// Si no se define en .env, se usará el puerto 3000 por defecto
const PORT = process.env.SERVER_PORT || 3000; // Allow dynamic port configuration
// Iniciamos el servidor y escuchamos en el puerto especificado
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
