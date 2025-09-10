import { connect } from "../config/db/connectMysql.js";
/**
 * Modelo para gestionar las relaciones entre cursos y estudiantes.
 * Permite registrar, consultar, actualizar y eliminar relaciones.
 */
const CourseStudentModel = {
  /**
   * Crea una nueva relación entre un curso y un estudiante.
   * @param {Object} data - Datos de la relación.
   * @param {number} data.course_fk - ID del curso (llave foránea).
   * @param {number} data.student_fk - ID del estudiante (llave foránea).
   * @returns {Promise<number>} ID del nuevo registro insertado.
   */
  async create({ course_fk, student_fk }) {
    const [result] = await connect.query(
      `INSERT INTO course_student (course_fk, student_fk) VALUES (?, ?)`,
      [course_fk, student_fk]
    );
    return result.insertId;
  },
 /**
   * Obtiene todas las relaciones curso-estudiante.
   * @returns {Promise<Array>} Lista de relaciones.
   */
  async show() {
    const [rows] = await connect.query(`SELECT * FROM course_student ORDER BY course_student_id`);
    return rows;
  },
 /**
   * Busca una relación por su ID.
   * @param {number} id - ID de la relación.
   * @returns {Promise<Object|null>} Relación encontrada o null si no existe.
   */
  async findById(id) {
    const [rows] = await connect.query(
      `SELECT * FROM course_student WHERE course_student_id = ?`,
      [id]
    );
    return rows[0];
  },
/**
   * Actualiza una relación curso-estudiante por su ID.
   * @param {number} id - ID de la relación.
   * @param {Object} data - Nuevos datos (course_fk, student_fk).
   * @returns {Promise<number>} Número de filas afectadas (1 si se actualizó, 0 si no).
   */
  async update(id, { course_fk, student_fk }) {
    const [result] = await connect.query(
      `UPDATE course_student SET course_fk = ?, student_fk = ? WHERE course_student_id = ?`,
      [course_fk, student_fk, id]
    );
    return result.affectedRows;
  },
/**
   * Elimina una relación curso-estudiante por su ID.
   * @param {number} id - ID de la relación.
   * @returns {Promise<number>} Número de filas eliminadas (1 si se eliminó, 0 si no).
   */
  async delete(id) {
    const [result] = await connect.query(
      `DELETE FROM course_student WHERE course_student_id = ?`,
      [id]
    );
    return result.affectedRows;
  }
};

export default CourseStudentModel;
