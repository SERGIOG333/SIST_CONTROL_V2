// backend/config/emailConfig.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 465,
  secure: process.env.EMAIL_SECURE === "true", // 👈 convierte el string "true"/"false" a boolean
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verificación de conexión SMTP
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Error en conexión SMTP:", error);
  } else {
    console.log("✅ SMTP listo para enviar correos");
  }
});

export default transporter;

