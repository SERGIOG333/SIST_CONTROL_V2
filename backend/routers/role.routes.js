import { Router } from "express";
import RoleController from '../controllers/role.controller.js';
import { verifyWebToken } from '../middlewares/verifyWebToken.js';

const router = Router();
const name = '/role';

router.route(name)
  .post(RoleController.register) // Crear un nuevo rol
  .get(RoleController.show);     // Obtener todos los roles

router.route(`${name}/:id`)
  .get(RoleController.findById)  // Obtener rol por ID
  .put( RoleController.update)    // Actualizar rol por ID
  .delete( RoleController.delete);// Eliminar rol por ID

export default router;
