import { connect } from "../config/db/connectMysql.js";

const ApiUserModel = {
  async create({ name, email, passwordHash }) {
    const [result] = await connect.query(
      "INSERT INTO api_user (name, email, password_hash) VALUES (?, ?, ?)",
      [name, email, passwordHash]
    );
    return result.insertId;
  },

  async findByEmail(email) {
    const [rows] = await connect.query(
      "SELECT * FROM api_user WHERE email = ? AND status = 'active'",
      [email]
    );
    return rows[0]; // Devuelve un solo usuario si existe
  }
};

export default ApiUserModel;
