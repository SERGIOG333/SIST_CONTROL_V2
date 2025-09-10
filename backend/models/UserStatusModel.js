import { connect } from '../config/db/connectMysql.js';
/**
 * Modelo para la gestión del estado de los usuarios (user_status).
 * Permite operaciones CRUD: crear, listar, actualizar, eliminar y buscar por ID.
 */
class UserStatusModel {
 /**
   * Crea un nuevo estado de usuario.
   * @param {Object} data - Objeto con el nombre del estado.
   * @param {string} data.User_status_name - Nombre del estado del usuario.
   * @returns {Promise<number|Array>} ID insertado o [0] si ocurre un error.
   */
  static async create({ User_status_name }) {
    try {
      const sqlQuery = "INSERT INTO user_status (User_status_name) VALUES (?);";
      const [result] = await connect.query(sqlQuery, [User_status_name]);
      return result.insertId;
    } catch (error) {
      return [0];
    }
  }
/**
   * Retorna todos los estados de usuario registrados.
   * @returns {Promise<Array|[0]>} Lista de estados o [0] si ocurre un error.
   */
  static async show() {
    try {
      const sqlQuery = "SELECT * FROM user_status ORDER BY User_status_id";
      const [result] = await connect.query(sqlQuery);
      return result;
    } catch (error) {
      return [0];
    }
  }
/**
   * Actualiza un estado de usuario por su ID.
   * @param {number} User_status_id - ID del estado a actualizar.
   * @param {Object} data - Objeto con los nuevos datos.
   * @param {string} data.User_status_name - Nuevo nombre del estado.
   * @returns {Promise<number|[0]>} Número de filas afectadas o [0] si no se actualiza.
   */
  static async update(User_status_id, { User_status_name }) {
    try {
      const sqlQuery = "UPDATE user_status SET User_status_name = ? WHERE User_status_id = ?";
      const [result] = await connect.query(sqlQuery, [User_status_name, User_status_id]);
      return result.affectedRows === 0 ? [0] : result.affectedRows;
    } catch (error) {
      return [0];
    }
  }
 /**
   * Elimina un estado de usuario por su ID.
   * @param {number} User_status_id - ID del estado a eliminar.
   * @returns {Promise<number|[0]>} Número de filas eliminadas o [0] si no se elimina.
   */
  static async delete(User_status_id) {
    try {
      const sqlQuery = "DELETE FROM user_status WHERE User_status_id = ?";
      const [result] = await connect.query(sqlQuery, [User_status_id]);
      return result.affectedRows === 0 ? [0] : result.affectedRows;
    } catch (error) {
      return [0];
    }
  }
 /**
   * Busca un estado de usuario por su ID.
   * @param {number} User_status_id - ID del estado a buscar.
   * @returns {Promise<Object|[0]>} Objeto del estado o [0] si no se encuentra.
   */
  static async findById(User_status_id) {
    try {
      const sqlQuery = "SELECT * FROM user_status WHERE User_status_id = ?";
      const [result] = await connect.query(sqlQuery, [User_status_id]);
      return result;
    } catch (error) {
      return [0];
    }
  }

}

export default UserStatusModel;
