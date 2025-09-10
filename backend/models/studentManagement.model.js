import { connect } from "../config/db/connectMysql.js";
/**
 * Modelo para gestionar los datos de estudiantes en el sistema.
 * Incluye operaciones CRUD sobre la tabla `student_management`.
 */
const StudentManagementModel = {
  /**
   * Registra un nuevo estudiante en la base de datos.
   * @param {Object} data - Datos del estudiante.
   * @param {string} data.student_name - Nombre del estudiante.
   * @param {string} data.student_last_name - Apellido del estudiante.
   * @param {string} data.student_identificacion - Documento de identificación.
   * @param {string} data.student_arrival_time - Hora de llegada.
   * @param {string} data.student_departure_time - Hora de salida.
   * @param {string} data.student_email - Correo electrónico.
   * @param {string} data.student_date - Fecha de nacimiento o registro (formato YYYY-MM-DD).
   * @param {string} data.student_photo - URL o nombre de archivo de la foto del estudiante.
   * @returns {Promise<number>} ID insertado del nuevo estudiante.
   */
  async create({
    student_name,
    student_last_name,
    student_identificacion,
    student_arrival_time,
    student_departure_time,
    student_email,
    student_date,
    student_photo
  }) {
    const [result] = await connect.query(
      `INSERT INTO student_management 
      (student_name, student_last_name, student_identificacion, student_arrival_time, 
       student_departure_time, student_email, student_date, student_photo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        student_name,
        student_last_name,
        student_identificacion,
        student_arrival_time,
        student_departure_time,
        student_email,
        student_date,
        student_photo
      ]
    );
    return result.insertId;
  },
 /**
   * Obtiene la lista completa de estudiantes registrados.
   * @returns {Promise<Array>} Arreglo con todos los estudiantes.
   */
  async show() {
    const [rows] = await connect.query(`SELECT * FROM student_management ORDER BY student_id`);
    return rows;
  },
/**
   * Busca un estudiante por su ID.
   * @param {number} id - ID del estudiante.
   * @returns {Promise<Object|null>} Estudiante encontrado o null si no existe.
   */
  async findById(id) {
    const [rows] = await connect.query(`SELECT * FROM student_management WHERE student_id = ?`, [id]);
    return rows[0];
  },
  /**
   * Actualiza la información de un estudiante por su ID.
   * @param {number} id - ID del estudiante.
   * @param {Object} data - Nuevos datos del estudiante.
   * @returns {Promise<number>} Número de filas afectadas (1 si fue exitoso).
   */
  async update(id, data) {
    const [result] = await connect.query(
      `UPDATE student_management SET
        student_name = ?, student_last_name = ?, student_identificacion = ?,
        student_arrival_time = ?, student_departure_time = ?, student_email = ?,
        student_date = ?, student_photo = ?
       WHERE student_id = ?`,
      [
        data.student_name,
        data.student_last_name,
        data.student_identificacion,
        data.student_arrival_time,
        data.student_departure_time,
        data.student_email,
        data.student_date,
        data.student_photo,
        id
      ]
    );
    return result.affectedRows;
  },
 /**
   * Elimina un estudiante de la base de datos por su ID.
   * @param {number} id - ID del estudiante.
   * @returns {Promise<number>} Número de filas afectadas (1 si fue eliminado).
   */
  async delete(id) {
    const [result] = await connect.query(`DELETE FROM student_management WHERE student_id = ?`, [id]);
    return result.affectedRows;
  }
};

export default StudentManagementModel;
