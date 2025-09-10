import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
/**
 * Middleware para verificar un token JWT válido de tipo "api".
 * Se utiliza para proteger rutas que solo pueden ser accedidas por usuarios autenticados vía API.
 * 
 * - Espera el token en el encabezado "Authorization" en formato "Bearer <token>".
 * - El token debe contener un campo `type` con valor `"api"`.
 * - Si es válido, continúa al siguiente middleware. Si no, devuelve un error HTTP.
 *
 * Ejemplo de token esperado (payload):
 * {
 *   "id": 123,
 *   "type": "api",
 *   "iat": 1234567890,
 *   "exp": 1234569999
 * }
 */
export const verifyApiToken = (req, res, next) => {
  const token = req.header("Authorization");// Leemos el token del header
  // Si no hay token, rechazamos la petición
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
     // Verificamos y decodificamos el token
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);

     // Validamos que el token sea del tipo 'api'
    if (decoded.type !== "api") {
      return res.status(403).json({ error: "Access denied: API users only" });
    }
 // Guardamos los datos decodificados del token en la petición para usos posteriores
    req.apiUser = decoded; 
    // Guardamos los datos del api user en la request
    // Continuamos al siguiente middleware o controlador
    next();
  } catch (err) {
     // Si hay error en la verificación del token (inválido o expirado)
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
