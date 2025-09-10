import TeacherModel from '../models/TeacherModel.js';
/**
 * @swagger
 * tags:
 *   name: Teacher
 *   description: Gestión de docentes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TeacherInput:
 *       type: object
 *       required:
 *         - teacher_name
 *         - teacher_last_name
 *         - teacher_identificacion
 *         - teacher_course_assigned
 *         - teacher_email
 *         - Users_fk
 *       properties:
 *         teacher_name:
 *           type: string
 *           example: Ana
 *         teacher_last_name:
 *           type: string
 *           example: Martínez
 *         teacher_identificacion:
 *           type: string
 *           example: 12345678
 *         teacher_course_assigned:
 *           type: string
 *           example: Matemáticas 7°
 *         teacher_email:
 *           type: string
 *           example: ana.martinez@colegio.edu
 *         Users_fk:
 *           type: integer
 *           example: 1
 *     TeacherResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/TeacherInput'
 *         - type: object
 *           properties:
 *             teacher_id:
 *               type: integer
 */
class TeacherController {
  /**
   * @swagger
   * /teacher:
   *   post:
   *     summary: Registrar un nuevo docente
   *     tags: [Teacher]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/TeacherInput'
   *     responses:
   *       201:
   *         description: Docente registrado exitosamente
   *       400:
   *         description: Campos requeridos faltantes
   *       500:
   *         description: Error del servidor
   */

  async register(req, res) {
    try {
      const { teacher_name, teacher_last_name, teacher_identificacion, teacher_course_assigned, teacher_email, Users_fk } = req.body;

      if (!teacher_name || !teacher_last_name || !teacher_identificacion || !teacher_course_assigned || !teacher_email || !Users_fk) {
        return res.status(400).json({ error: 'Required fields are missing' });
      }

      const result = await TeacherModel.create({
        teacher_name,
        teacher_last_name,
        teacher_identificacion,
        teacher_course_assigned,
        teacher_email,
        Users_fk
      });

      res.status(201).json({
        message: 'Teacher created successfully',
        data: result
      });

    } catch (error) {
      console.error('Error in register:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
/**
   * @swagger
   * /teacher:
   *   get:
   *     summary: Obtener todos los docentes
   *     tags: [Teacher]
   *     responses:
   *       200:
   *         description: Lista de docentes obtenida exitosamente
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
   *                     $ref: '#/components/schemas/TeacherResponse'
   *       404:
   *         description: No se encontraron docentes
   *       500:
   *         description: Error del servidor
   */
  async show(req, res) {
    try {
      const result = await TeacherModel.show();

      if (!result || result.length === 0) {
        return res.status(404).json({ error: 'No teachers found' });
      }

      res.status(200).json({
        message: 'Teachers retrieved successfully',
        data: result
      });

    } catch (error) {
      console.error('Error in show:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
 /**
   * @swagger
   * /teacher/{id}:
   *   put:
   *     summary: Actualizar un docente por ID
   *     tags: [Teacher]
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
   *             $ref: '#/components/schemas/TeacherInput'
   *     responses:
   *       200:
   *         description: Docente actualizado correctamente
   *       400:
   *         description: Campos requeridos faltantes
   *       404:
   *         description: Docente no encontrado o no actualizado
   *       500:
   *         description: Error del servidor
   */
  async update(req, res) {
    try {
      const teacher_id = req.params.id;
      const { teacher_name, teacher_last_name, teacher_identificacion, teacher_course_assigned, teacher_email, Users_fk } = req.body;

      if (!teacher_id || !teacher_name || !teacher_last_name || !teacher_identificacion || !teacher_course_assigned || !teacher_email || !Users_fk) {
        return res.status(400).json({ error: 'Required fields are missing' });
      }

      const result = await TeacherModel.update(teacher_id, {
        teacher_name,
        teacher_last_name,
        teacher_identificacion,
        teacher_course_assigned,
        teacher_email,
        Users_fk
      });

      if (!result || result === 0) {
        return res.status(404).json({ error: 'Teacher not found or not updated' });
      }

      res.status(200).json({
        message: 'Teacher updated successfully',
        data: result
      });

    } catch (error) {
      console.error('Error in update:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
/**
   * @swagger
   * /teacher/{id}:
   *   delete:
   *     summary: Eliminar un docente por ID
   *     tags: [Teacher]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Docente eliminado correctamente
   *       400:
   *         description: ID del docente requerido
   *       404:
   *         description: Docente no encontrado o ya eliminado
   *       500:
   *         description: Error del servidor
   */
  async delete(req, res) {
    try {
      const teacher_id = req.params.id;

      if (!teacher_id) {
        return res.status(400).json({ error: 'Teacher ID is required' });
      }

      const result = await TeacherModel.delete(teacher_id);

      if (!result || result === 0) {
        return res.status(404).json({ error: 'Teacher not found or already deleted' });
      }

      res.status(200).json({
        message: 'Teacher deleted successfully',
        data: result
      });

    } catch (error) {
      console.error('Error in delete:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
 /**
   * @swagger
   * /teacher/{id}:
   *   get:
   *     summary: Obtener un docente por ID
   *     tags: [Teacher]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Docente encontrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TeacherResponse'
   *       400:
   *         description: ID no válido
   *       404:
   *         description: Docente no encontrado
   *       500:
   *         description: Error del servidor
   */
  async findById(req, res) {
    try {
      const teacher_id = req.params.id;

      if (!teacher_id) {
        return res.status(400).json({ error: 'Teacher ID is required' });
      }

      const result = await TeacherModel.findById(teacher_id);

      if (!result || result.length === 0) {
        return res.status(404).json({ error: 'Teacher not found' });
      }

      res.status(200).json({
        message: 'Teacher retrieved successfully',
        data: result
      });

    } catch (error) {
      console.error('Error in findById:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

}

export default new TeacherController();
