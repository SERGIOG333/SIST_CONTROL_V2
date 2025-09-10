// backend/controllers/attendance.controller.js

import AttendanceModel from "../models/AttendanceModel.js";
/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Endpoints para gestionar asistencias de estudiantes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AttendanceInput:
 *       type: object
 *       required:
 *         - student_fk
 *       properties:
 *         student_fk:
 *           type: integer
 *           description: ID del estudiante (clave foránea)
 *       example:
 *         student_fk: 1
 * 
 *     AttendanceResponse:
 *       type: object
 *       properties:
 *         attendance_id:
 *           type: integer
 *           description: ID de la asistencia generada automáticamente
 *         student_fk:
 *           type: integer
 *           description: ID del estudiante relacionado
 *         attendance_time:
 *           type: string
 *           format: time
 *           description: Hora registrada automáticamente (HH:MM:SS)
 *         attendance_date:
 *           type: string
 *           format: date
 *           description: Fecha registrada automáticamente (YYYY-MM-DD)
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de creación del registro
 */

const AttendanceController = {
   /**
   * @swagger
   * /attendance:
   *   post:
   *     summary: Registrar una asistencia
   *     tags: [Attendance]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/AttendanceInput'
   *     responses:
   *       201:
   *         description: Asistencia registrada exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Asistencia registrada exitosamente.
   *                 data:
   *                   $ref: '#/components/schemas/AttendanceResponse'
   *       400:
   *         description: El campo student_fk es requerido
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: El campo student_fk es requerido.
   *       500:
   *         description: Error interno al registrar asistencia
   */
  async register(req, res) {
    try {
      const { student_fk } = req.body;

      if (!student_fk) {
        return res.status(400).json({ message: "El campo student_fk es requerido." });
      }

      // Obtener hora y fecha actuales
      const now = new Date();
      const attendance_date = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const attendance_time = now.toTimeString().split(' ')[0]; // HH:MM:SS

      const result = await AttendanceModel.create({
        student_fk,
        attendance_time,
        attendance_date,
      });

      res.status(201).json({
        message: "Asistencia registrada exitosamente.",
        data: result,
      });
    } catch (err) {
      console.error("AttendanceController.register error:", err);
      res.status(500).json({ message: "Error interno al registrar asistencia." });
    }
  },
 /**
   * @swagger
   * /attendance/:
   *   get:
   *     summary: Obtener todas las asistencias registradas
   *     tags: [Attendance]
   *     responses:
   *       200:
   *         description: Listado de asistencias
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Listado de asistencias.
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/AttendanceResponse'
   *       500:
   *         description: Error al obtener las asistencias
   */
  async getAll(req, res) {
    try {
      const data = await AttendanceModel.getAll();
      res.status(200).json({
        message: "Listado de asistencias.",
        data,
      });
    } catch (err) {
      console.error("AttendanceController.getAll error:", err);
      res.status(500).json({ message: "Error al obtener las asistencias." });
    }
  },
};

export default AttendanceController;
