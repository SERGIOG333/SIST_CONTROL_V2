import CourseModel from "../models/course.model.js";
/**
 * @swagger
 * tags:
 *   name: Course
 *   description: Endpoints para gestionar cursos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CourseInput:
 *       type: object
 *       required:
 *         - course_course_name
 *         - course_description
 *         - course_assigned_teacher
 *         - course_assigned_student
 *         - teacher_fk
 *       properties:
 *         course_course_name:
 *           type: string
 *           example: Matemáticas
 *         course_description:
 *           type: string
 *           example: Curso básico de matemáticas para primaria
 *         course_assigned_teacher:
 *           type: string
 *           example: Juan Pérez
 *         course_assigned_student:
 *           type: string
 *           example: Todos los estudiantes de grado 5
 *         teacher_fk:
 *           type: integer
 *           example: 1
 * 
 *     CourseResponse:
 *       type: object
 *       properties:
 *         course_id:
 *           type: integer
 *         course_course_name:
 *           type: string
 *         course_description:
 *           type: string
 *         course_assigned_teacher:
 *           type: string
 *         course_assigned_student:
 *           type: string
 *         teacher_fk:
 *           type: integer
 */
class CourseController {
   /**
   * @swagger
   * /course:
   *   post:
   *     summary: Crear un nuevo curso
   *     tags: [Course]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CourseInput'
   *     responses:
   *       201:
   *         description: Curso creado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Course created successfully
   *                 data:
   *                   type: integer
   *       400:
   *         description: Campos requeridos faltantes
   *       500:
   *         description: Error interno del servidor
   */
  async register(req, res) {
    try {
      const {
        course_course_name,
        course_description,
        course_assigned_teacher,
        course_assigned_student,
        teacher_fk
      } = req.body;

      if (!course_course_name || !course_description || !course_assigned_teacher || 
          !course_assigned_student || !teacher_fk) {
        return res.status(400).json({ error: "Required fields are missing" });
      }

      const id = await CourseModel.create({
        course_course_name,
        course_description,
        course_assigned_teacher,
        course_assigned_student,
        teacher_fk
      });

      res.status(201).json({ message: "Course created successfully", data: id });
    } catch (error) {
      console.error("Register course error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
/**
   * @swagger
   * /course:
   *   get:
   *     summary: Obtener todos los cursos
   *     tags: [Course]
   *     responses:
   *       200:
   *         description: Lista de cursos obtenida exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Courses retrieved successfully
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/CourseResponse'
   *       500:
   *         description: Error al obtener los cursos
   */
  async show(req, res) {
    try {
      const result = await CourseModel.show();
      res.status(200).json({ message: "Courses retrieved successfully", data: result });
    } catch (error) {
      res.status(500).json({ error: "Error retrieving courses" });
    }
  }
 /**
   * @swagger
   * /course/{id}:
   *   get:
   *     summary: Obtener un curso por ID
   *     tags: [Course]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID del curso
   *     responses:
   *       200:
   *         description: Curso encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Course found
   *                 data:
   *                   $ref: '#/components/schemas/CourseResponse'
   *       404:
   *         description: Curso no encontrado
   *       500:
   *         description: Error al buscar el curso
   */
  async findById(req, res) {
    try {
      const id = req.params.id;
      const result = await CourseModel.findById(id);

      if (!result) {
        return res.status(404).json({ error: "Course not found" });
      }

      res.status(200).json({ message: "Course found", data: result });
    } catch (error) {
      res.status(500).json({ error: "Error finding course" });
    }
  }
/**
   * @swagger
   * /course/{id}:
   *   put:
   *     summary: Actualizar un curso por ID
   *     tags: [Course]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID del curso
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CourseInput'
   *     responses:
   *       200:
   *         description: Curso actualizado exitosamente
   *       404:
   *         description: Curso no actualizado
   *       500:
   *         description: Error al actualizar el curso
   */
  async update(req, res) {
    try {
      const id = req.params.id;
      const courseData = req.body;

      const updated = await CourseModel.update(id, courseData);
      if (updated === 0) {
        return res.status(404).json({ error: "Course not updated" });
      }

      res.status(200).json({ message: "Course updated successfully", data: updated });
    } catch (error) {
      res.status(500).json({ error: "Error updating course" });
    }
  }
/**
   * @swagger
   * /course/{id}:
   *   delete:
   *     summary: Eliminar un curso por ID
   *     tags: [Course]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del curso
   *     responses:
   *       200:
   *         description: Curso eliminado exitosamente
   *       404:
   *         description: Curso no encontrado
   *       500:
   *         description: Error al eliminar curso
   */
  async delete(req, res) {
    try {
      const id = req.params.id;
      const deleted = await CourseModel.delete(id);

      if (deleted === 0) {
        return res.status(404).json({ error: "Course not found" });
      }

      res.status(200).json({ message: "Course deleted successfully", data: deleted });
    } catch (error) {
      res.status(500).json({ error: "Error deleting course" });
    }
  }
}

export default new CourseController();
