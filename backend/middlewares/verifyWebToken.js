import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// Carga de variables de entorno desde el archivo .env
dotenv.config();
/**
 * Middleware para verificar un token JWT válido de tipo "web".
 * Este middleware está diseñado para proteger rutas que solo deben ser accesibles por usuarios autenticados desde la web (frontend).
 *
 * - Requiere que el token esté en el header "Authorization" en formato "Bearer <token>".
 * - El token debe contener un campo "type" con valor "web".
 * - Si el token es válido y corresponde al tipo "web", se continúa al siguiente middleware/controlador.
 * - Si no, retorna un error HTTP correspondiente (401 o 403).
 *
 * Ejemplo de payload del token esperado:
 * {
 *   "id": 123,
 *   "type": "web",
 *   "iat": 1681234567,
 *   "exp": 1681239999
 * }
 */
export const verifyWebToken = (req, res, next) => {
  const token = req.header("Authorization");
  // Si no se proporciona token, se rechaza la solicitud
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
     // Se verifica y decodifica el token, eliminando "Bearer " si viene incluido
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);

    // Verificamos que sea un token de tipo web
    if (decoded.type !== "web") {
      return res.status(403).json({ error: "Access denied: Web users only" });
    }

    req.user = decoded; // Guardamos los datos del usuario en la request
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
