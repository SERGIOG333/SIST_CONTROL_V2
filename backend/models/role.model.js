import { connect } from '../config/db/connectMysql.js';
/**
 * Modelo para gestionar los roles de usuario en el sistema.
 * Contiene métodos para crear, consultar, actualizar y eliminar roles.
 */
class RoleModel {
 /**
   * Crea un nuevo rol en la base de datos.
   * @param {Object} data - Datos del rol.
   * @param {string} data.Role_name - Nombre del rol a registrar.
   * @returns {Promise<number>} ID del nuevo rol creado o [0] si hay error.
   */
  static async create({ Role_name }) {
    try {
      const sqlQuery = "INSERT INTO role (Role_name) VALUES (?);";
      const [result] = await connect.query(sqlQuery, [Role_name]);
      return result.insertId;
    } catch (error) {
      return [0];
    }
  }
/**
   * Retorna todos los roles existentes en la base de datos.
   * @returns {Promise<Array|number[]>} Lista de roles o [0] si hay error.
   */
  static async show() {
    try {
      const sqlQuery = "SELECT * FROM role ORDER BY Role_id";
      const [result] = await connect.query(sqlQuery);
      return result;
    } catch (error) {
      return [0];
    }
  }
  /**
   * Actualiza un rol existente por su ID.
   * @param {number} Role_id - ID del rol a actualizar.
   * @param {Object} data - Nuevos datos del rol.
   * @param {string} data.Role_name - Nuevo nombre del rol.
   * @returns {Promise<number|number[]>} Número de filas afectadas o [0] si hay error.
   */
  static async update(Role_id, { Role_name }) {
    try {
      const sqlQuery = "UPDATE role SET Role_name = ? WHERE Role_id = ?;";
      const [result] = await connect.query(sqlQuery, [Role_name, Role_id]);
      return result.affectedRows === 0 ? [0] : result.affectedRows;
    } catch (error) {
      return [0];
    }
  }
/**
   * Elimina un rol de la base de datos por su ID.
   * @param {number} Role_id - ID del rol a eliminar.
   * @returns {Promise<number|number[]>} Número de filas eliminadas o [0] si hay error.
   */
  static async delete(Role_id) {
    try {
      const sqlQuery = "DELETE FROM role WHERE Role_id = ?";
      const [result] = await connect.query(sqlQuery, [Role_id]);
      return result.affectedRows === 0 ? [0] : result.affectedRows;
    } catch (error) {
      return [0];
    }
  }
/**
   * Busca un rol por su ID.
   * @param {number} Role_id - ID del rol a buscar.
   * @returns {Promise<Object|number[]>} Datos del rol encontrado o [0] si hay error.
   */
  static async findById(Role_id) {
    try {
      const sqlQuery = "SELECT * FROM role WHERE Role_id = ?";
      const [result] = await connect.query(sqlQuery, [Role_id]);
      return result;
    } catch (error) {
      return [0];
    }
  }

}

export default RoleModel;
