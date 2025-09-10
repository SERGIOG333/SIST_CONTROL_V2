import FatherManagementModel from "../models/fatherManagement.model.js";
/**
 * @swagger
 * tags:
 *   name: Father
 *   description: Gestión de padres de familia
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     FatherInput:
 *       type: object
 *       required:
 *         - father_name
 *         - father_last_name
 *         - father_email
 *         - father_number
 *         - student_fk
 *       properties:
 *         father_name:
 *           type: string
 *           example: Juan
 *         father_last_name:
 *           type: string
 *           example: Pérez
 *         father_email:
 *           type: string
 *           example: juanperez@example.com
 *         father_number:
 *           type: string
 *           example: "3201234567"
 *         student_fk:
 *           type: integer
 *           example: 2
 *     FatherResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         father_name:
 *           type: string
 *         father_last_name:
 *           type: string
 *         father_email:
 *           type: string
 *         father_number:
 *           type: string
 *         student_fk:
 *           type: integer
 */
class FatherManagementController {
  /**
   * @swagger
   * /father:
   *   post:
   *     summary: Crear nuevo padre
   *     tags: [Father]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/FatherInput'
   *     responses:
   *       201:
   *         description: Padre creado exitosamente
   *       400:
   *         description: Campos requeridos faltantes
   *       500:
   *         description: Error del servidor
   */

  async register(req, res) {
    try {
      const { father_name, father_last_name, father_email, father_number, student_fk } = req.body;

      if (!father_name || !father_last_name || !father_email || !father_number || !student_fk) {
        return res.status(400).json({ error: "Required fields are missing" });
      }

      const id = await FatherManagementModel.create({
        father_name,
        father_last_name,
        father_email,
        father_number,
        student_fk
      });

      res.status(201).json({ message: "Father created successfully", data: id });
    } catch (error) {
      console.error("Father register error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
/**
   * @swagger
   * /father:
   *   get:
   *     summary: Obtener todos los padres
   *     tags: [Father]
   *     responses:
   *       200:
   *         description: Lista de padres obtenida correctamente
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
   *                     $ref: '#/components/schemas/FatherResponse'
   *       500:
   *         description: Error del servidor
   */
  async show(req, res) {
    try {
      const result = await FatherManagementModel.show();
      res.status(200).json({ message: "Fathers retrieved successfully", data: result });
    } catch (error) {
      console.error("Show fathers error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
/**
   * @swagger
   * /father/{id}:
   *   get:
   *     summary: Obtener un padre por ID
   *     tags: [Father]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Padre encontrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/FatherResponse'
   *       404:
   *         description: Padre no encontrado
   *       500:
   *         description: Error del servidor
   */
  async findById(req, res) {
    try {
      const id = req.params.id;
      const result = await FatherManagementModel.findById(id);

      if (!result) {
        return res.status(404).json({ error: "Father not found" });
      }

      res.status(200).json({ message: "Father found", data: result });
    } catch (error) {
      console.error("Find father error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
 /**
   * @swagger
   * /father/{id}:
   *   put:
   *     summary: Actualizar un padre por ID
   *     tags: [Father]
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
   *             $ref: '#/components/schemas/FatherInput'
   *     responses:
   *       200:
   *         description: Padre actualizado correctamente
   *       400:
   *         description: Campos requeridos faltantes
   *       404:
   *         description: Padre no actualizado
   *       500:
   *         description: Error del servidor
   */
  async update(req, res) {
    try {
      const id = req.params.id;
      const { father_name, father_last_name, father_email, father_number, student_fk } = req.body;

      if (!father_name || !father_last_name || !father_email || !father_number || !student_fk) {
        return res.status(400).json({ error: "Required fields are missing" });
      }

      const result = await FatherManagementModel.update(id, {
        father_name,
        father_last_name,
        father_email,
        father_number,
        student_fk
      });

      if (result === 0) {
        return res.status(404).json({ error: "Father not updated" });
      }

      res.status(200).json({ message: "Father updated successfully", data: result });
    } catch (error) {
      console.error("Update father error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
/**
   * @swagger
   * /father/{id}:
   *   delete:
   *     summary: Eliminar un padre por ID
   *     tags: [Father]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Padre eliminado correctamente
   *       404:
   *         description: Padre no encontrado
   *       500:
   *         description: Error del servidor
   */
  async delete(req, res) {
    try {
      const id = req.params.id;
      const result = await FatherManagementModel.delete(id);

      if (result === 0) {
        return res.status(404).json({ error: "Father not found" });
      }

      res.status(200).json({ message: "Father deleted successfully", data: result });
    } catch (error) {
      console.error("Delete father error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default new FatherManagementController();
