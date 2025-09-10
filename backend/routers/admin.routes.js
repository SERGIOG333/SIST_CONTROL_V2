import { Router } from "express";
import AdminController from "../controllers/admin.controller.js";

const router = Router();
const name = "/admin";
const name2 = "/login";

router.post(name, AdminController.register);        // Registro
router.post(name2, AdminController.login);       // Login

router.get(name + "/", AdminController.show);
router.get(name + "/:id", AdminController.findById);
router.put(name + "/:id", AdminController.update);
router.delete(name + "/:id", AdminController.delete);

export default router;
