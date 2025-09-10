import { connect } from '../config/db/connectMysql.js';
/**
 * Modelo para gestionar los usuarios del sistema.
 * Proporciona funciones para crear, leer, actualizar y eliminar usuarios.
 */
class UserModel {
  /**
   * Crea un nuevo usuario en la base de datos.
   * @param {Object} data - Datos del usuario.
   * @param {string} data.Users_usuario - Nombre de usuario.
   * @param {string} data.passwordHash - Contraseña encriptada.
   * @param {number} data.User_status_fk - FK del estado del usuario.
   * @param {number} data.Role_fk - FK del rol del usuario.
   * @returns {Promise<number|Array>} ID del usuario creado o [0] si hay error.
   */
  static async create({ Users_usuario, passwordHash, User_status_fk, Role_fk }) {
    try {
      const sqlQuery = `
        INSERT INTO users (Users_usuario, Users_password, User_status_fk, Role_fk)
        VALUES (?, ?, ?, ?);
      `;
      const [result] = await connect.query(sqlQuery, [
        Users_usuario,
        passwordHash,
        User_status_fk,
        Role_fk
      ]);
      return result.insertId;
    } catch (error) {
      console.error('UserModel.create error:', error);
      return [0];
    }
  }
/**
   * Busca un usuario por su nombre de usuario.
   * @param {string} Users_usuario - Nombre de usuario.
   * @returns {Promise<Object|null>} Objeto del usuario encontrado o null si no existe.
   */
  static async findByUsername(Users_usuario) {
    try {
      const sqlQuery = "SELECT * FROM users WHERE Users_usuario = ? LIMIT 1;";
      const [result] = await connect.query(sqlQuery, [Users_usuario]);
      return result[0];
    } catch (error) {
      console.error('UserModel.findByUsername error:', error);
      return null;
    }
  }
/**
   * Retorna todos los usuarios registrados.
   * @returns {Promise<Array>} Arreglo con todos los usuarios.
   */
  static async show() {
    try {
      const [result] = await connect.query("SELECT * FROM users ORDER BY Users_id");
      return result;
    } catch (error) {
      return [0];
    }
  }
/**
   * Actualiza los datos de un usuario por su ID.
   * @param {number} Users_id - ID del usuario.
   * @param {Object} data - Nuevos datos del usuario.
   * @param {string} data.Users_usuario - Nombre de usuario actualizado.
   * @param {string} data.Users_password - Contraseña actualizada (ya encriptada).
   * @param {number} data.User_status_fk - FK del nuevo estado.
   * @param {number} data.Role_fk - FK del nuevo rol.
   * @returns {Promise<number|Array>} Número de filas afectadas o [0] si no se actualizó.
   */
  static async update(Users_id, { Users_usuario, Users_password, User_status_fk, Role_fk }) {
    try {
      const sqlQuery = `
        UPDATE users SET 
        Users_usuario = ?, 
        Users_password = ?, 
        User_status_fk = ?, 
        Role_fk = ?
        WHERE Users_id = ?;
      `;
      const [result] = await connect.query(sqlQuery, [
        Users_usuario,
        Users_password,
        User_status_fk,
        Role_fk,
        Users_id
      ]);
      return result.affectedRows === 0 ? [0] : result.affectedRows;
    } catch (error) {
      return [0];
    }
  }
/**
   * Elimina un usuario por su ID.
   * @param {number} Users_id - ID del usuario a eliminar.
   * @returns {Promise<number|Array>} Número de filas eliminadas o [0] si no se eliminó.
   */
  static async delete(Users_id) {
    try {
      const [result] = await connect.query("DELETE FROM users WHERE Users_id = ?", [Users_id]);
      return result.affectedRows === 0 ? [0] : result.affectedRows;
    } catch (error) {
      return [0];
    }
  }
/**
   * Busca un usuario por su ID.
   * @param {number} Users_id - ID del usuario.
   * @returns {Promise<Object|Array>} Objeto del usuario o [0] si no se encontró.
   */
  static async findById(Users_id) {
    try {
      const [result] = await connect.query("SELECT * FROM users WHERE Users_id = ?", [Users_id]);
      return result;
    } catch (error) {
      return [0];
    }
  }
}

export default UserModel;
