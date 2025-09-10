import { connect } from '../config/db/connectMysql.js';
/**
 * Modelo para gestionar los datos de los profesores.
 * Incluye métodos CRUD sobre la tabla `teacher`.
 */
class TeacherModel {
/**
   * Registra un nuevo profesor en la base de datos.
   * @param {Object} data - Datos del profesor.
   * @param {string} data.teacher_name - Nombre del profesor.
   * @param {string} data.teacher_last_name - Apellido del profesor.
   * @param {string} data.teacher_identificacion - Documento de identificación.
   * @param {string} data.teacher_course_assigned - Curso asignado al profesor.
   * @param {string} data.teacher_email - Correo electrónico del profesor.
   * @param {number} data.Users_fk - ID de usuario relacionado.
   * @returns {Promise<number|Array>} ID del nuevo profesor o [0] si hay error.
   */
  static async create({ teacher_name, teacher_last_name, teacher_identificacion, teacher_course_assigned, teacher_email, Users_fk }) {
    try {
      const sqlQuery = `
        INSERT INTO teacher (teacher_name, teacher_last_name, teacher_identificacion, teacher_course_assigned, teacher_email, Users_fk)
        VALUES (?, ?, ?, ?, ?, ?);
      `;
      const [result] = await connect.query(sqlQuery, [
        teacher_name,
        teacher_last_name,
        teacher_identificacion,
        teacher_course_assigned,
        teacher_email,
        Users_fk
      ]);
      return result.insertId;
    } catch (error) {
      return [0];
    }
  }
 /**
   * Muestra todos los profesores registrados.
   * @returns {Promise<Array|Array>} Lista de profesores o [0] si ocurre error.
   */
  static async show() {
    try {
      const sqlQuery = "SELECT * FROM teacher ORDER BY teacher_id";
      const [result] = await connect.query(sqlQuery);
      return result;
    } catch (error) {
      return [0];
    }
  }
 /**
   * Actualiza los datos de un profesor por su ID.
   * @param {number} teacher_id - ID del profesor.
   * @param {Object} data - Nuevos datos del profesor.
   * @returns {Promise<number|Array>} Filas afectadas o [0] si no se modificó.
   */
  static async update(teacher_id, { teacher_name, teacher_last_name, teacher_identificacion, teacher_course_assigned, teacher_email, Users_fk }) {
    try {
      const sqlQuery = `
        UPDATE teacher SET 
        teacher_name = ?, 
        teacher_last_name = ?, 
        teacher_identificacion = ?, 
        teacher_course_assigned = ?, 
        teacher_email = ?, 
        Users_fk = ?
        WHERE teacher_id = ?;
      `;
      const [result] = await connect.query(sqlQuery, [
        teacher_name,
        teacher_last_name,
        teacher_identificacion,
        teacher_course_assigned,
        teacher_email,
        Users_fk,
        teacher_id
      ]);
      return result.affectedRows === 0 ? [0] : result.affectedRows;
    } catch (error) {
      return [0];
    }
  }
 /**
   * Elimina un profesor por su ID.
   * @param {number} teacher_id - ID del profesor a eliminar.
   * @returns {Promise<number|Array>} Filas eliminadas o [0] si no se eliminó.
   */
  static async delete(teacher_id) {
    try {
      const sqlQuery = "DELETE FROM teacher WHERE teacher_id = ?";
      const [result] = await connect.query(sqlQuery, [teacher_id]);
      return result.affectedRows === 0 ? [0] : result.affectedRows;
    } catch (error) {
      return [0];
    }
  }
 /**
   * Busca un profesor por su ID.
   * @param {number} teacher_id - ID del profesor.
   * @returns {Promise<Object|Array>} Objeto del profesor encontrado o [0] si no existe.
   */
  static async findById(teacher_id) {
    try {
      const sqlQuery = "SELECT * FROM teacher WHERE teacher_id = ?";
      const [result] = await connect.query(sqlQuery, [teacher_id]);
      return result;
    } catch (error) {
      return [0];
    }
  }

}

export default TeacherModel;
