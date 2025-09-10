import CourseStudentModel from "../models/courseStudent.model.js";
/**
 * @swagger
 * tags:
 *   name: CourseStudent
 *   description: Relación entre cursos y estudiantes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CourseStudentInput:
 *       type: object
 *       required:
 *         - course_fk
 *         - student_fk
 *       properties:
 *         course_fk:
 *           type: integer
 *           example: 1
 *         student_fk:
 *           type: integer
 *           example: 10
 *     CourseStudentResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         course_fk:
 *           type: integer
 *         student_fk:
 *           type: integer
 */

class CourseStudentController {
  /**
   * @swagger
   * /courseStudent:
   *   post:
   *     summary: Crear una relación entre curso y estudiante
   *     tags: [CourseStudent]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CourseStudentInput'
   *     responses:
   *       201:
   *         description: Relación creada exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Relation created successfully
   *                 data:
   *                   type: integer
   *       400:
   *         description: Campos requeridos faltantes
   *       500:
   *         description: Error interno del servidor
   */
  async register(req, res) {
    try {
      const { course_fk, student_fk } = req.body;

      if (!course_fk || !student_fk) {
        return res.status(400).json({ error: "Required fields are missing" });
      }

      const id = await CourseStudentModel.create({ course_fk, student_fk });
      res.status(201).json({ message: "Relation created successfully", data: id });
    } catch (error) {
      console.error("Error creating relation:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  /**
   * @swagger
   * /courseStudent:
   *   get:
   *     summary: Obtener todas las relaciones curso-estudiante
   *     tags: [CourseStudent]
   *     responses:
   *       200:
   *         description: Lista de relaciones obtenida correctamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Relations retrieved successfully
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/CourseStudentResponse'
   *       500:
   *         description: Error al obtener relaciones
   */

  async show(req, res) {
    try {
      const result = await CourseStudentModel.show();
      res.status(200).json({ message: "Relations retrieved successfully", data: result });
    } catch (error) {
      res.status(500).json({ error: "Error retrieving relations" });
    }
  }
/**
   * @swagger
   * /courseStudent/{id}:
   *   get:
   *     summary: Obtener relación por ID
   *     tags: [CourseStudent]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID de la relación
   *     responses:
   *       200:
   *         description: Relación encontrada
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Relation found
   *                 data:
   *                   $ref: '#/components/schemas/CourseStudentResponse'
   *       404:
   *         description: Relación no encontrada
   *       500:
   *         description: Error al buscar relación
   */
  async findById(req, res) {
    try {
      const id = req.params.id;
      const result = await CourseStudentModel.findById(id);

      if (!result) {
        return res.status(404).json({ error: "Relation not found" });
      }

      res.status(200).json({ message: "Relation found", data: result });
    } catch (error) {
      res.status(500).json({ error: "Error finding relation" });
    }
  }
 /**
   * @swagger
   * /courseStudent/{id}:
   *   put:
   *     summary: Actualizar relación curso-estudiante
   *     tags: [CourseStudent]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID de la relación
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CourseStudentInput'
   *     responses:
   *       200:
   *         description: Relación actualizada exitosamente
   *       404:
   *         description: Relación no encontrada o no actualizada
   *       500:
   *         description: Error al actualizar relación
   */
  async update(req, res) {
    try {
      const id = req.params.id;
      const { course_fk, student_fk } = req.body;

      if (!course_fk || !student_fk) {
        return res.status(400).json({ error: "Required fields are missing" });
      }

      const updated = await CourseStudentModel.update(id, { course_fk, student_fk });

      if (updated === 0) {
        return res.status(404).json({ error: "Relation not updated" });
      }

      res.status(200).json({ message: "Relation updated successfully", data: updated });
    } catch (error) {
      res.status(500).json({ error: "Error updating relation" });
    }
  }
/**
   * @swagger
   * /courseStudent/{id}:
   *   delete:
   *     summary: Eliminar relación curso-estudiante
   *     tags: [CourseStudent]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID de la relación
   *     responses:
   *       200:
   *         description: Relación eliminada exitosamente
   *       404:
   *         description: Relación no encontrada
   *       500:
   *         description: Error al eliminar relación
   */
  async delete(req, res) {
    try {
      const id = req.params.id;
      const deleted = await CourseStudentModel.delete(id);

      if (deleted === 0) {
        return res.status(404).json({ error: "Relation not found" });
      }

      res.status(200).json({ message: "Relation deleted successfully", data: deleted });
    } catch (error) {
      res.status(500).json({ error: "Error deleting relation" });
    }
  }
}

export default new CourseStudentController();
