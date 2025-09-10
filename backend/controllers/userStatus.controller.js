import UserStatusModel from '../models/UserStatusModel.js';

class UserStatusController {
/**
   * @swagger
   * tags:
   *   name: UserStatus
   *   description: Gestión de estados de usuario
   */

  /**
   * @swagger
   * /user-status/register:
   *   post:
   *     summary: Crear un nuevo estado de usuario
   *     tags: [UserStatus]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - User_status_name
   *             properties:
   *               User_status_name:
   *                 type: string
   *                 example: Activo
   *     responses:
   *       201:
   *         description: Estado creado exitosamente
   *       400:
   *         description: Campos requeridos faltantes
   *       500:
   *         description: Error interno del servidor
   */
  async register(req, res) {
    try {
      const { User_status_name } = req.body;

      if (!User_status_name) {
        return res.status(400).json({ error: 'Required field "User_status_name" is missing' });
      }

      const result = await UserStatusModel.create({ User_status_name });

      res.status(201).json({
        message: 'User status created successfully',
        data: result
      });

    } catch (error) {
      console.error('Error in register:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
 /**
   * @swagger
   * /user-status:
   *   get:
   *     summary: Obtener todos los estados de usuario
   *     tags: [UserStatus]
   *     responses:
   *       200:
   *         description: Lista de estados obtenida
   *       404:
   *         description: No se encontraron estados
   *       500:
   *         description: Error interno
   */
  async show(req, res) {
    try {
      const result = await UserStatusModel.show();

      if (!result || result.length === 0) {
        return res.status(404).json({ error: 'No user statuses found' });
      }

      res.status(200).json({
        message: 'User statuses retrieved successfully',
        data: result
      });

    } catch (error) {
      console.error('Error in show:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
/**
   * @swagger
   * /user-status/{id}:
   *   put:
   *     summary: Actualizar estado de usuario por ID
   *     tags: [UserStatus]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - User_status_name
   *             properties:
   *               User_status_name:
   *                 type: string
   *                 example: Inactivo
   *     responses:
   *       200:
   *         description: Estado actualizado correctamente
   *       404:
   *         description: Estado no encontrado
   */
  async update(req, res) {
    try {
      const { User_status_name } = req.body;
      const User_status_id = req.params.id;

      if (!User_status_id || !User_status_name) {
        return res.status(400).json({ error: 'Required fields are missing' });
      }

      const result = await UserStatusModel.update(User_status_id, { User_status_name });

      if (!result || result === 0) {
        return res.status(404).json({ error: 'User status not found or not updated' });
      }

      res.status(200).json({
        message: 'User status updated successfully',
        data: result
      });

    } catch (error) {
      console.error('Error in update:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
/**
   * @swagger
   * /user-status/{id}:
   *   delete:
   *     summary: Eliminar estado de usuario por ID
   *     tags: [UserStatus]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *     responses:
   *       200:
   *         description: Estado eliminado correctamente
   *       404:
   *         description: Estado no encontrado
   */
  async delete(req, res) {
    try {
      const User_status_id = req.params.id;

      if (!User_status_id) {
        return res.status(400).json({ error: 'User status ID is required' });
      }

      const result = await UserStatusModel.delete(User_status_id);

      if (!result || result === 0) {
        return res.status(404).json({ error: 'User status not found or already deleted' });
      }

      res.status(200).json({
        message: 'User status deleted successfully',
        data: result
      });

    } catch (error) {
      console.error('Error in delete:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
 /**
   * @swagger
   * /user-status/{id}:
   *   get:
   *     summary: Obtener estado de usuario por ID
   *     tags: [UserStatus]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Estado encontrado
   *       404:
   *         description: Estado no encontrado
   */
  async findById(req, res) {
    try {
      const User_status_id = req.params.id;

      if (!User_status_id) {
        return res.status(400).json({ error: 'User status ID is required' });
      }

      const result = await UserStatusModel.findById(User_status_id);

      if (!result || result.length === 0) {
        return res.status(404).json({ error: 'User status not found' });
      }

      res.status(200).json({
        message: 'User status retrieved successfully',
        data: result
      });

    } catch (error) {
      console.error('Error in findById:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

}

export default new UserStatusController();
