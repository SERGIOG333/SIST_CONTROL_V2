import { connect } from "../config/db/connectMysql.js";
/**
 * Modelo para gestionar los cursos del sistema.
 * Permite registrar, consultar, actualizar y eliminar cursos.
 */
const CourseModel = {
  /**
   * Crea un nuevo curso en la base de datos.
   * @param {Object} data - Información del curso.
   * @param {string} data.course_course_name - Nombre del curso.
   * @param {string} data.course_description - Descripción del curso.
    docente asignado.
   * @param {string} data.course_assigned_student - Descripción de los estudiantes asignados.
   * @param {number} data.teacher_fk - ID del docente (llave foránea).
   * @returns {Promise<number>} ID del nuevo curso insertado.
   */
  async create({
    course_course_name,
    course_description,
   
    course_assigned_student,
    teacher_fk
  }) {
    const [result] = await connect.query(
      `INSERT INTO course 
      (course_course_name, course_description, course_assigned_student, teacher_fk)
      VALUES (?, ?, ?, ? )`,
      [
        course_course_name,
        course_description,
        
        course_assigned_student,
        teacher_fk
      ]
    );
    return result.insertId;
  },
/**
   * Obtiene todos los cursos ordenados por ID.
   * @returns {Promise<Array>} Lista de cursos.
   */
  async show() {
    const [rows] = await connect.query(`SELECT * FROM course ORDER BY course_id`);
    return rows;
  },
/**
   * Busca un curso por su ID.
   * @param {number} id - ID del curso.
   * @returns {Promise<Object|null>} Curso encontrado o null si no existe.
   */
  async findById(id) {
    const [rows] = await connect.query(`SELECT * FROM course WHERE course_id = ?`, [id]);
    return rows[0];
  },
/**
   * Actualiza los datos de un curso por su ID.
   * @param {number} id - ID del curso.
   * @param {Object} data - Nuevos datos del curso.
   * @returns {Promise<number>} Número de filas afectadas (1 si se actualizó, 0 si no).
   */
  async update(id, data) {
    const [result] = await connect.query(
      `UPDATE course SET
        course_course_name = ?, course_description = ?, 
         course_assigned_student = ?, teacher_fk = ?
      WHERE course_id = ?`,
      [
        data.course_course_name,
        data.course_description,
        
        data.course_assigned_student,
        data.teacher_fk,
        id
      ]
    );
    return result.affectedRows;
  },
/**
   * Elimina un curso por su ID.
   * @param {number} id - ID del curso a eliminar.
   * @returns {Promise<number>} Número de filas eliminadas (1 si se eliminó, 0 si no).
   */
  async delete(id) {
    const [result] = await connect.query(`DELETE FROM course WHERE course_id = ?`, [id]);
    return result.affectedRows;
  }
};

export default CourseModel;
