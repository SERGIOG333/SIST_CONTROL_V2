// backend/routers/emails.routes.js
import { Router } from "express";
import EmailController from "../controllers/email.controller.js";

const router = Router();
const name = "/emails";

// Test de conexión
router.get(name + "/test", EmailController.test.bind(EmailController));

// Rutas de envío de correos
router.post(name + "/welcome", EmailController.sendWelcomeEmail.bind(EmailController));
router.post(name + "/reset-password", EmailController.sendPasswordReset.bind(EmailController));
router.post(name + "/student-entry", EmailController.sendStudentEntryEmail.bind(EmailController));
router.post(name + "/student-exit", EmailController.sendStudentExitEmail.bind(EmailController));

export default router;
