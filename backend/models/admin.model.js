import { connect } from "../config/db/connectMysql.js";
/**
 * Modelo para la gestión de datos de la tabla `admin`.
 * Proporciona funciones CRUD para interactuar con los registros de administradores del sistema.
 */
const AdminModel = {
  /**
   * Crea un nuevo registro de administrador en la base de datos.
   * @param {Object} admin - Datos del administrador.
   * @param {string} admin.admin_name - Nombre del administrador.
   * @param {string} admin.admin_last_name - Apellido del administrador.
   * @param {string} admin.admin_email - Correo electrónico.
   * @param {string} admin.passwordHash - Contraseña ya encriptada.
   * @param {number} admin.Users_fk - Llave foránea del usuario relacionado.
   * @returns {Promise<number>} ID del nuevo administrador creado.
   */
  async create({ admin_name, admin_last_name, admin_email, passwordHash, Users_fk }) {
    const [result] = await connect.query(
      `INSERT INTO admin (admin_name, admin_last_name, admin_email, admin_password, Users_fk)
       VALUES (?, ?, ?, ?, ?)`,
      [admin_name, admin_last_name, admin_email, passwordHash, Users_fk]
    );
    return result.insertId;
  },
/**
   * Busca un administrador por su correo electrónico.
   * @param {string} admin_email - Correo del administrador.
   * @returns {Promise<Object|null>} Datos del administrador o null si no se encuentra.
   */
  async findByEmail(admin_email) {
    const [rows] = await connect.query(
      `SELECT * FROM admin WHERE admin_email = ?`,
      [admin_email]
    );
    return rows[0]; // Devuelve un único admin si existe
  },
 /**
   * Retorna todos los administradores.
   * @returns {Promise<Array>} Lista completa de administradores.
   */
  async show() {
    const [rows] = await connect.query(`SELECT * FROM admin ORDER BY admin_id`);
    return rows;
  },
/**
   * Busca un administrador por su ID.
   * @param {number} id - ID del administrador.
   * @returns {Promise<Object|null>} Administrador encontrado o null si no existe.
   */
  async findById(id) {
    const [rows] = await connect.query(`SELECT * FROM admin WHERE admin_id = ?`, [id]);
    return rows[0];
  },
 /**
   * Actualiza los datos de un administrador existente.
   * @param {number} id - ID del administrador a actualizar.
   * @param {Object} data - Nuevos datos.
   * @param {string} data.admin_name - Nuevo nombre.
   * @param {string} data.admin_last_name - Nuevo apellido.
   * @param {string} data.admin_email - Nuevo correo.
   * @param {string} data.passwordHash - Nueva contraseña (encriptada).
   * @param {number} data.Users_fk - Nueva relación con usuario.
   * @returns {Promise<number>} Número de filas afectadas (0 si no se actualizó).
   */
  async update(id, { admin_name, admin_last_name, admin_email, passwordHash, Users_fk }) {
    const [result] = await connect.query(
      `UPDATE admin SET admin_name = ?, admin_last_name = ?, admin_email = ?, admin_password = ?, Users_fk = ?
       WHERE admin_id = ?`,
      [admin_name, admin_last_name, admin_email, passwordHash, Users_fk, id]
    );
    return result.affectedRows;
  },
/**
   * Elimina un administrador por ID.
   * @param {number} id - ID del administrador.
   * @returns {Promise<number>} Número de filas eliminadas (0 si no se encontró).
   */
  async delete(id) {
    const [result] = await connect.query(`DELETE FROM admin WHERE admin_id = ?`, [id]);
    return result.affectedRows;
  }
};

export default AdminModel;
