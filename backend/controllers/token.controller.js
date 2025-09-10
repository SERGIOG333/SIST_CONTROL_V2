import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Verificación de autenticación con JWT
 */

/**
 * @swagger
 * /verify-token:
 *   get:
 *     summary: Verificar validez del token JWT
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Verified
 *                 valid:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Token inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid Token
 *                 valid:
 *                   type: boolean
 *                   example: false
 *       401:
 *         description: Token no proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Access denied
 */

/**
 * Middleware para verificar el token JWT enviado en el header Authorization.
 */
// Middleware to verify the token
export const verifyToken = (req, res) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    res.status(200).json({message:"Verified", valid: true});
  } catch (err) {
    res.status(400).json({ error: "Invalid Token",valid: false });
  }
};

