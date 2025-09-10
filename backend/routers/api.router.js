import { Router } from "express";
import RoleController from '../controllers/role.controller.js';
import ApiUserController from "../controllers/apiUser.controller.js";
import { verifyApiToken } from "../middlewares/verifyApiToken.js";

const router = Router();

router.post("/api-user", ApiUserController.create);        // Registro
router.post("/login", ApiUserController.login);   // Login con JWT

const name='/role';
// Ejemplo de ruta protegida solo para usuarios con token válido
router.route(name)
  .post(verifyApiToken,RoleController.register) // Register a new user
  .get(verifyApiToken,RoleController.show);// Show all users

router.route(`${name}/:id`)
  .get(verifyApiToken,RoleController.findById)// Show a user by ID
  .put(verifyApiToken,RoleController.update)// Update a user by ID
  .delete(verifyApiToken,RoleController.delete);// Delete a user by ID

export default router;
