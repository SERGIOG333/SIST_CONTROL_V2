import { connect } from "../config/db/connectMysql.js";
/**
 * Modelo para gestionar la información de los padres o acudientes.
 * Permite registrar, consultar, actualizar y eliminar datos relacionados a los padres de familia.
 */
const FatherManagementModel = {
  /**
   * Crea un nuevo padre/acudiente en la base de datos.
   * @param {Object} data - Datos del padre.
   * @param {string} data.father_name - Nombre del padre.
   * @param {string} data.father_last_name - Apellido del padre.
   * @param {string} data.father_email - Correo electrónico.
   * @param {string} data.father_number - Número de contacto.
   * @param {number} data.student_fk - ID del estudiante relacionado (llave foránea).
   * @returns {Promise<number>} ID insertado.
   */
  async create({ father_name, father_last_name, father_email, father_number, student_fk }) {
    const [result] = await connect.query(
      `INSERT INTO father_management 
      (father_name, father_last_name, father_email, father_number, student_fk) 
      VALUES (?, ?, ?, ?, ?)`,
      [father_name, father_last_name, father_email, father_number, student_fk]
    );
    return result.insertId;
  },
/**
   * Obtiene la lista de todos los padres registrados.
   * @returns {Promise<Array>} Lista de padres/acudientes.
   */
  async show() {
    const [rows] = await connect.query(`SELECT * FROM father_management ORDER BY father_id`);
    return rows;
  },
/**
   * Busca un padre/acudiente por su ID.
   * @param {number} id - ID del padre.
   * @returns {Promise<Object|null>} Objeto con los datos o null si no se encuentra.
   */
  async findById(id) {
    const [rows] = await connect.query(`SELECT * FROM father_management WHERE father_id = ?`, [id]);
    return rows[0];
  },
/**
   * Actualiza los datos de un padre por su ID.
   * @param {number} id - ID del padre a actualizar.
   * @param {Object} data - Datos nuevos del padre.
   * @returns {Promise<number>} Número de filas afectadas (1 si se actualizó).
   */
  async update(id, { father_name, father_last_name, father_email, father_number, student_fk }) {
    const [result] = await connect.query(
      `UPDATE father_management SET 
      father_name = ?, father_last_name = ?, father_email = ?, father_number = ?, student_fk = ?
      WHERE father_id = ?`,
      [father_name, father_last_name, father_email, father_number, student_fk, id]
    );
    return result.affectedRows;
  },
/**
   * Elimina un padre/acudiente por su ID.
   * @param {number} id - ID del padre a eliminar.
   * @returns {Promise<number>} Número de filas eliminadas (1 si se eliminó).
   */
  async delete(id) {
    const [result] = await connect.query(`DELETE FROM father_management WHERE father_id = ?`, [id]);
    return result.affectedRows;
  }
};

export default FatherManagementModel;
