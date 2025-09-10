import StudentManagementModel from "../models/studentManagement.model.js";
/**
 * @swagger
 * tags:
 *   name: Student
 *   description: Gestión de estudiantes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     StudentInput:
 *       type: object
 *       required:
 *         - student_name
 *         - student_last_name
 *         - student_identificacion
 *         - student_arrival_time
 *         - student_departure_time
 *         - student_email
 *         - student_date
 *         - student_photo
 *       properties:
 *         student_name:
 *           type: string
 *           example: Juan
 *         student_last_name:
 *           type: string
 *           example: Gómez
 *         student_identificacion:
 *           type: string
 *           example: 123456789
 *         student_arrival_time:
 *           type: string
 *           format: time
 *           example: "07:00:00"
 *         student_departure_time:
 *           type: string
 *           format: time
 *           example: "13:00:00"
 *         student_email:
 *           type: string
 *           example: juan@example.com
 *         student_date:
 *           type: string
 *           format: date
 *           example: "2025-07-04"
 *         student_photo:
 *           type: string
 *           example: photo123.jpg
 *     StudentResponse:
 *       type: object
 *       properties:
 *         student_id:
 *           type: integer
 *         student_name:
 *           type: string
 *         student_last_name:
 *           type: string
 *         student_identificacion:
 *           type: string
 *         student_arrival_time:
 *           type: string
 *         student_departure_time:
 *           type: string
 *         student_email:
 *           type: string
 *         student_date:
 *           type: string
 *         student_photo:
 *           type: string
 */
class StudentManagementController {
   /**
   * @swagger
   * /student:
   *   post:
   *     summary: Registrar un nuevo estudiante
   *     tags: [Student]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/StudentInput'
   *     responses:
   *       201:
   *         description: Estudiante creado exitosamente
   *       400:
   *         description: Campos requeridos faltantes
   *       500:
   *         description: Error interno del servidor
   */
  async register(req, res) {
    try {
      const {
        student_name,
        student_last_name,
        student_identificacion,
        student_arrival_time,
        student_departure_time,
        student_email,
        student_date,
        student_photo
      } = req.body;

      if (!student_name || !student_last_name || !student_identificacion || !student_arrival_time ||
          !student_departure_time || !student_email || !student_date || !student_photo) {
        return res.status(400).json({ error: "Required fields are missing" });
      }

      const id = await StudentManagementModel.create({
        student_name,
        student_last_name,
        student_identificacion,
        student_arrival_time,
        student_departure_time,
        student_email,
        student_date,
        student_photo
      });

      res.status(201).json({ message: "Student created successfully", data: id });
    } catch (error) {
      console.error("Register student error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
 /**
   * @swagger
   * /student:
   *   get:
   *     summary: Obtener todos los estudiantes
   *     tags: [Student]
   *     responses:
   *       200:
   *         description: Lista de estudiantes obtenida
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/StudentResponse'
   *       500:
   *         description: Error del servidor
   */
  async show(req, res) {
    try {
      const result = await StudentManagementModel.show();
      res.status(200).json({ message: "Students retrieved successfully", data: result });
    } catch (error) {
      res.status(500).json({ error: "Error retrieving students" });
    }
  }
/**
   * @swagger
   * /student/{id}:
   *   get:
   *     summary: Obtener un estudiante por ID
   *     tags: [Student]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Estudiante encontrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/StudentResponse'
   *       404:
   *         description: Estudiante no encontrado
   *       500:
   *         description: Error al buscar el estudiante
   */
  async findById(req, res) {
    try {
      const id = req.params.id;
      const result = await StudentManagementModel.findById(id);

      if (!result) {
        return res.status(404).json({ error: "Student not found" });
      }

      res.status(200).json({ message: "Student found", data: result });
    } catch (error) {
      res.status(500).json({ error: "Error finding student" });
    }
  }
/**
   * @swagger
   * /student/{id}:
   *   put:
   *     summary: Actualizar un estudiante por ID
   *     tags: [Student]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/StudentInput'
   *     responses:
   *       200:
   *         description: Estudiante actualizado correctamente
   *       404:
   *         description: Estudiante no encontrado
   *       500:
   *         description: Error actualizando estudiante
   */
  async update(req, res) {
    try {
      const id = req.params.id;
      const studentData = req.body;

      const updated = await StudentManagementModel.update(id, studentData);
      if (updated === 0) {
        return res.status(404).json({ error: "Student not updated" });
      }

      res.status(200).json({ message: "Student updated successfully", data: updated });
    } catch (error) {
      res.status(500).json({ error: "Error updating student" });
    }
  }
/**
   * @swagger
   * /student/{id}:
   *   delete:
   *     summary: Eliminar un estudiante por ID
   *     tags: [Student]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Estudiante eliminado correctamente
   *       404:
   *         description: Estudiante no encontrado
   *       500:
   *         description: Error eliminando estudiante
   */
  async delete(req, res) {
    try {
      const id = req.params.id;
      const deleted = await StudentManagementModel.delete(id);

      if (deleted === 0) {
        return res.status(404).json({ error: "Student not found" });
      }

      res.status(200).json({ message: "Student deleted successfully", data: deleted });
    } catch (error) {
      res.status(500).json({ error: "Error deleting student" });
    }
  }
}

export default new StudentManagementController();
