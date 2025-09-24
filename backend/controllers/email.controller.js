// backend/controllers/email.controller.js
import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import transporter from "../config/emailConfig.js"; // 👈 usamos el transporter centralizado

const EmailController = {
  // 🔹 Función base para enviar correos
  async sendEmail({ to, subject, template, data }) {
    try {
      // Cargar la plantilla HTML
      const templatePath = path.resolve("views/emails", `${template}.ejs`);
      const source = fs.readFileSync(templatePath, "utf8");
      const compiledTemplate = handlebars.compile(source);
      const html = compiledTemplate(data);

      // Opciones del correo
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
      };

      // Enviar correo
      const info = await transporter.sendMail(mailOptions);
      console.log(`📩 Correo enviado a ${to}: ${info.response}`);

      return { success: true, message: "Correo enviado correctamente" };
    } catch (err) {
      console.error("❌ Error al enviar correo:", err);
      return { success: false, message: "Error al enviar correo", error: err };
    }
  },

  // ---------- MÉTODOS PÚBLICOS ----------
  async test(req, res) {
    return res.json({ message: "✅ Servicio de correos funcionando" });
  },

  async sendWelcomeEmail(req, res) {
    const { to, name } = req.body;
    const result = await EmailController.sendEmail({
      to,
      subject: "¡Bienvenido a nuestro sistema!",
      template: "welcome",
      data: { name, year: new Date().getFullYear() },
    });
    return res.json(result);
  },

  async sendPasswordReset(req, res) {
    const { to, resetLink } = req.body;
    const result = await EmailController.sendEmail({
      to,
      subject: "Restablece tu contraseña",
      template: "reset-password",
      data: { resetLink, year: new Date().getFullYear() },
    });
    return res.json(result);
  },

  async sendStudentEntryEmail(req, res) {
    const { to, studentName, studentLastName, arrivalTime } = req.body;
    const result = await EmailController.sendEmail({
      to,
      subject: "Notificación de llegada del estudiante",
      template: "student-entry",
      data: { studentName, studentLastName, arrivalTime, year: new Date().getFullYear() },
    });
    return res.json(result);
  },

  async sendStudentExitEmail(req, res) {
    const { to, studentName, studentLastName, departureTime } = req.body;
    const result = await EmailController.sendEmail({
      to,
      subject: "Notificación de salida del estudiante",
      template: "student-exit",
      data: { studentName, studentLastName, departureTime, year: new Date().getFullYear() },
    });
    return res.json(result);
  },
};

export default EmailController;
