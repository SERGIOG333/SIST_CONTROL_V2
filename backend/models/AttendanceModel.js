// backend/models/AttendanceModel.js
import { connect } from "../config/db/connectMysql.js";
/**
 * Modelo para gestionar la asistencia de estudiantes.
 * Permite registrar y consultar asistencias en la base de datos.
 */
const AttendanceModel = {
  async create({ student_fk, attendance_time, attendance_date }) {
     /**
   * Crea un nuevo registro de asistencia para un estudiante.
   * @param {Object} attendanceData - Datos de asistencia.
   * @param {number} attendanceData.student_fk - ID del estudiante (llave foránea).
   * @param {string} attendanceData.attendance_time - Hora de la asistencia (formato HH:MM:SS).
   * @param {string} attendanceData.attendance_date - Fecha de la asistencia (formato YYYY-MM-DD).
   * @returns {Promise<Object>} Resultado de la operación de inserción.
   * @throws {Error} Error si la inserción falla.
   */
    try {
      const sql = `
        INSERT INTO student_attendance (student_fk, attendance_time, attendance_date)
        VALUES (?, ?, ?)
      `;
      const [result] = await connect.query(sql, [student_fk, attendance_time, attendance_date]);
      return result;
    } catch (error) {
      console.error("AttendanceModel.create error:", error);
      throw error;
    }
  },
/**
   * Obtiene todos los registros de asistencia junto con los datos del estudiante.
   * @returns {Promise<Array>} Lista de asistencias con información del estudiante relacionada.
   * @throws {Error} Error si la consulta falla.
   */
  async getAll() {
    try {
      const sql = `
        SELECT 
          sa.attendance_id,
          sm.student_name,
          sm.student_last_name,
          sm.student_identificacion,
          sm.student_email,
          sm.student_photo,
          sa.attendance_time,
          sa.attendance_date
        FROM student_attendance sa
        INNER JOIN student_management sm ON sa.student_fk = sm.student_id
        ORDER BY sa.attendance_date DESC, sa.attendance_time DESC
      `;
      const [rows] = await connect.query(sql);
      return rows;
    } catch (error) {
      console.error("AttendanceModel.getAll error:", error);
      throw error;
    }
  },
};

export default AttendanceModel;
