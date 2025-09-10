import { Router } from "express";
import AttendanceController from "../controllers/attendance.controller.js";

const router = Router();
const name = "/attendance";
// Ruta para registrar una asistencia
router.post(name, AttendanceController.register);

// Ruta para obtener todas las asistencias
router.get(name + "/", AttendanceController.getAll);

export default router;
