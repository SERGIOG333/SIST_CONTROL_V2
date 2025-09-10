import { Router } from "express";
import UserController from '../controllers/user.controller.js';

const router = Router();
const name = '/users';
const name2 = '/login';

router.post(name, UserController.register);
router.get(name + '/', UserController.show);
router.get(name + '/:id', UserController.findById);
router.put(name + '/:id', UserController.update);
router.delete(name + '/:id', UserController.delete);
//ruta del login /users/login
router.post(name + name2, UserController.login);


export default router;
