import { Router } from "express";
import FatherManagementController from "../controllers/fatherManagement.controller.js";

const router = Router();
const name = "/father";

router.post(name, FatherManagementController.register);
router.get(name + "/", FatherManagementController.show);
router.get(name + "/:id", FatherManagementController.findById);
router.put(name + "/:id", FatherManagementController.update);
router.delete(name + "/:id", FatherManagementController.delete);

export default router;
