import ApiUserModel from "../models/api_user.model.js";
import { encryptPassword, comparePassword } from "../library/appBcrypt.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

class ApiUserController {
  // Registrar un nuevo usuario API
  static async create(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: "Required fields are missing" });
      }

      if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters long" });
      }

      const existing = await ApiUserModel.findByEmail(email);
      if (existing) {
        return res.status(409).json({ error: "Email already registered" });
      }

      const passwordHash = await encryptPassword(password);
      const id = await ApiUserModel.create({ name, email, passwordHash });

      res.status(201).json({ message: "API user created", id });
    } catch (error) {
      console.error("API user creation error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Iniciar sesión (login) y devolver un token JWT
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      const user = await ApiUserModel.findByEmail(email);
      if (!user) {
        return res.status(404).json({ error: "API user not found" });
      }

      const isMatch = await comparePassword(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid password" });
      }

      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          type: "api"
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      console.error("API user login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default ApiUserController;
