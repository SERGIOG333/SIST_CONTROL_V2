import { Router } from "express";
import StudentManagementController from "../controllers/studentManagement.controller.js";

const router = Router();
const name = "/student";

router.post(name, StudentManagementController.register);
router.get(name + "/", StudentManagementController.show);
router.get(name + "/:id", StudentManagementController.findById);
router.put(name + "/:id", StudentManagementController.update);
router.delete(name + "/:id", StudentManagementController.delete);

//  ruta para generar QR
router.get(name + "/:identificacion/qr", StudentManagementController.generateQr);
// Buscar por identificacion


export default router;
