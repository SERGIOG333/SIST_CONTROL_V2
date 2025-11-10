/**
 * @fileoverview Controlador de administrador para gestionar el CRUD de administradores y la autenticación.
 * @module controllers/AdminController
 */

import AdminModel from "../models/admin.model.js";
import { encryptPassword, comparePassword } from "../library/appBcrypt.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
/**
 * Controlador para operaciones CRUD de administradores y autenticación JWT.
 */
class AdminController {
  /**
   * Registra un nuevo administrador.
   * @route POST /api_v1/admin
   * @param {Request} req - Datos del nuevo admin en el cuerpo de la solicitud.
   * @param {Response} res - Respuesta con mensaje o error.
   */
  async register(req, res) {
    try {
      //verificacion de que todos los campos esten completos
      const { admin_name, admin_last_name, admin_email, admin_password, Users_fk } = req.body;

      if (!admin_name || !admin_last_name || !admin_email || !admin_password || !Users_fk) {
        return res.status(400).json({ error: "All fields are required" });
      }
      ///verificacion de email si ya existe 
      const existing = await AdminModel.findByEmail(admin_email);
      if (existing) {
        return res.status(409).json({ error: "Admin already registered" });
      }
      /////encriptar contraseña
      const passwordHash = await encryptPassword(admin_password);
      const id = await AdminModel.create({ admin_name, admin_last_name, admin_email, passwordHash, Users_fk });
      ///mensaj de de exito
      res.status(201).json({ message: "Admin created", id });
    } catch (error) {
      console.error("Admin creation error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  ///login de administrador
  /**
   * Inicia sesión de administrador y devuelve token JWT.
   * @route POST /api_v1/admin/login
   * @param {Request} req - Email y contraseña en el cuerpo de la solicitud.
   * @param {Response} res - Token JWT o mensaje de error.
   */
  async login(req, res) {
    try {
      const { admin_email, admin_password } = req.body;

      if (!admin_email || !admin_password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
      ////verificacion de email si existe
      const admin = await AdminModel.findByEmail(admin_email);
      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }
      ///verificacion de contraseña aqui se compara la contraseña ingresada con la almacenada
      const isMatch = await comparePassword(admin_password, admin.admin_password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid password" });
      }
      ////generacion de token JWT
      const token = jwt.sign(
        {
          id: admin.admin_id,
          name: admin.admin_name,
          email: admin.admin_email,
          role: "admin"
        },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );

      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
 /**
   * Obtiene todos los administradores registrados.
   * @route GET /api_v1/admin
   */
  async show(req, res) {
    try {
      const admins = await AdminModel.show();
      res.status(200).json({ message: "Admins fetched", data: admins });
      
    } catch (error) {
      res.status(500).json({ error: "Error fetching admins" });
    }
  }
/**
   * Obtiene un administrador por ID.
   * @route GET /api_v1/admin/:id
   */
  async findById(req, res) {
    try {
      const id = req.params.id;
      const admin = await AdminModel.findById(id);
      if (!admin) return res.status(404).json({ error: "Admin not found" });
      res.status(200).json({ message: "Admin found", data: admin });
    } catch (error) {
      res.status(500).json({ error: "Error retrieving admin" });
    }
  }
 /**
   * Actualiza la información de un administrador.
   * @route PUT /api_v1/admin/:id
   */
  async update(req, res) {
    try {
      const id = req.params.id;
      const { admin_name, admin_last_name, admin_email, admin_password, Users_fk } = req.body;

      if (!admin_name || !admin_last_name || !admin_email || !admin_password || !Users_fk) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const passwordHash = await encryptPassword(admin_password);
      const result = await AdminModel.update(id, { admin_name, admin_last_name, admin_email, passwordHash, Users_fk });

      if (result === 0) return res.status(404).json({ error: "Admin not updated" });

      res.status(200).json({ message: "Admin updated", data: result });
    } catch (error) {
      res.status(500).json({ error: "Error updating admin" });
    }
  }
/**
   * Elimina un administrador por ID.
   * @route DELETE /api_v1/admin/:id
   */
  async delete(req, res) {
    try {
      const id = req.params.id;
      const result = await AdminModel.delete(id);
      if (result === 0) return res.status(404).json({ error: "Admin not found" });
      res.status(200).json({ message: "Admin deleted", data: result });
    } catch (error) {
      res.status(500).json({ error: "Error deleting admin" });
    }
  }
}

export default new AdminController();
