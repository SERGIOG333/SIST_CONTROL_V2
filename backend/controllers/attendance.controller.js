// backend/controllers/attendance.controller.js

import AttendanceModel from "../models/AttendanceModel.js";
import { connect as db } from "../config/db/connectMysql.js";

 // 🔹 Para consultar el padre del estudiante
import EmailController from "./email.controller.js"; // 🔹 Para enviar el correo

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Endpoints para gestionar asistencias de estudiantes
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
   *       400:
   *         description: El campo student_fk es requerido
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
      const attendance_date = now.toISOString().split("T")[0]; // YYYY-MM-DD
      const attendance_time = now.toTimeString().split(" ")[0]; // HH:MM:SS

      // Insertar asistencia
      const result = await AttendanceModel.create({
        student_fk,
        attendance_time,
        attendance_date,
      });

      // Buscar información del estudiante y su padre
      const [rows] = await db.query(
        `SELECT s.student_name, s.student_last_name, f.father_email
         FROM student_management s
         JOIN father_management f ON s.student_id = f.student_fk
         WHERE s.student_id = ?`,
        [student_fk]
      );

      if (rows.length > 0) {
        const { student_name, student_last_name, father_email } = rows[0];

        // Enviar correo al padre
        await EmailController.sendEmail({
          to: father_email,
          subject: "Notificación de llegada del estudiante",
          template: "student-entry",
          data: {
            studentName: student_name,
            studentLastName: student_last_name,
            arrivalTime: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        });
      }

      res.status(201).json({
        message: "Asistencia registrada exitosamente.",
        data: result,
      });
    } catch (err) {
      console.error("AttendanceController.register error:", err);
      res.status(500).json({ message: "Error interno al registrar asistencia." });
    }
  },

  //metodo para registrar la salida del estudiante
  async exit(req, res) {
    try {
      const { student_fk } = req.body;

      if (!student_fk) {
        return res.status(400).json({ message: "El campo student_fk es requerido." });
      }

      // Obtener hora y fecha actuales
      const now = new Date();
      const attendance_date = now.toISOString().split("T")[0]; // YYYY-MM-DD
      const attendance_time = now.toTimeString().split(" ")[0]; // HH:MM:SS

      // Insertar asistencia
      const result = await AttendanceModel.create({
        student_fk,
        attendance_time,
        attendance_date,
      });

      // Buscar información del estudiante y su padre
      const [rows] = await db.query(
        `SELECT s.student_name, s.student_last_name, f.father_email
         FROM student_management s
         JOIN father_management f ON s.student_id = f.student_fk
         WHERE s.student_id = ?`,
        [student_fk]
      );

      if (rows.length > 0) {
        const { student_name, student_last_name, father_email } = rows[0];

        // Enviar correo al padre
        await EmailController.sendEmail({
          to: father_email,
          subject: "Notificación de salida del estudiante",
          template: "student-exit",
          data: {
            studentName: student_name,
            studentLastName: student_last_name,
            arrivalTime: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        });
      }

      res.status(201).json({
        message: "salida registrada exitosamente.",
        data: result,
      });
    } catch (err) {
      console.error("AttendanceController.exit error:", err);
      res.status(500).json({ message: "Error interno al registrar asistencia." });
    }
  },

  /**
   * @swagger
   * /attendance/:
   *   get:
   *     summary: Obtener todas las asistencias registradas
   *     tags: [Attendance]
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
