// backend/controllers/email.controller.js
import transporter from "../config/emailConfig.js";
import { fileURLToPath } from "url";
import path from "path";
import ejs from "ejs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class EmailController {
  // Método interno para enviar correos
  static async sendEmail(options, res) {
    try {
      const { to, subject, template, data, attachments, html } = options;

      const renderedHtml = template
        ? await ejs.renderFile(
            path.join(__dirname, `../views/emails/${template}.ejs`),
            data || {}
          )
        : html || "<p>Email sent successfully!</p>";

      const mailOptions = {
        from: `"Sist Control" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: renderedHtml,
        attachments: attachments || [],
      };

      const info = await transporter.sendMail(mailOptions);
      return res.json({ message: "📩 Email sent successfully", info });
    } catch (error) {
      console.error("❌ Error in sendEmail:", error);
      return res.status(500).json({ error: "Failed to send email" });
    }
  }

  // Test de conexión
  static async test(req, res) {
    return res.json({ message: "✅ Email module is working" });
  }

  // Correo de bienvenida
  static async sendWelcomeEmail(req, res) {
    const { email, name } = req.body;
    return this.sendEmail(
      {
        to: email,
        subject: "Bienvenido a Sist Control",
        template: "welcome-email",
        data: { name },
      },
      res
    );
  }

  // Correo de restablecimiento de contraseña
  static async sendPasswordReset(req, res) {
    const { email, name, resetLink } = req.body;
    return this.sendEmail(
      {
        to: email,
        subject: "Restablecimiento de contraseña",
        template: "reset-password",
        data: { name, resetLink },
      },
      res
    );
  }

  // Correo de entrada de estudiante
  static async sendStudentEntryEmail(req, res) {
    const { email, studentName, studentLastName, arrivalTime } = req.body;
    return this.sendEmail(
      {
        to: email,
        subject: "Notificación de llegada del estudiante",
        template: "student-entry",
        data: { studentName, studentLastName, arrivalTime },
      },
      res
    );
  }

  // Correo de salida de estudiante
  static async sendStudentExitEmail(req, res) {
    const { email, studentName, studentLastName, departureTime } = req.body;
    return this.sendEmail(
      {
        to: email,
        subject: "Notificación de salida del estudiante",
        template: "student-exit",
        data: { studentName, studentLastName, departureTime },
      },
      res
    );
  }
}

export default EmailController;
