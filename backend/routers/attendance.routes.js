import { Router } from "express";
import AttendanceController from "../controllers/attendance.controller.js";

const router = Router();
const name = "/attendance";
const name2 = "/exit";

/**
 * Ruta para registrar una asistencia
 * POST /attendance
 */
router.post(name, AttendanceController.register);
router.post(name2, AttendanceController.exit);

/**
 * Ruta para obtener todas las asistencias
 * GET /attendance/
 */
router.get(name + "/", AttendanceController.getAll);

export default router;
