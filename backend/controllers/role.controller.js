import RoleModel from '../models/role.model.js';
/**
 * @swagger
 * tags:
 *   name: Role
 *   description: Gestión de roles de usuario
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RoleInput:
 *       type: object
 *       required:
 *         - Role_name
 *       properties:
 *         Role_name:
 *           type: string
 *           example: Administrador
 *     RoleResponse:
 *       type: object
 *       properties:
 *         Role_id:
 *           type: integer
 *         Role_name:
 *           type: string
 */

class RoleController {
/**
   * @swagger
   * /role:
   *   post:
   *     summary: Crear un nuevo rol
   *     tags: [Role]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RoleInput'
   *     responses:
   *       201:
   *         description: Rol creado exitosamente
   *       400:
   *         description: Faltan campos requeridos
   *       500:
   *         description: Error del servidor
   */
  async register(req, res) {
    try {
      const { Role_name } = req.body;

      if (!Role_name) {
        return res.status(400).json({ error: 'Required field "Role_name" is missing' });
      }

      const roleId = await RoleModel.create({ Role_name });

      res.status(201).json({ 
        message: 'Role created successfully',
        data: roleId 
      });

    } catch (error) {
      console.error('Error in register:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
/**
   * @swagger
   * /role:
   *   get:
   *     summary: Obtener todos los roles
   *     tags: [Role]
   *     responses:
   *       200:
   *         description: Lista de roles obtenida exitosamente
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
   *                     $ref: '#/components/schemas/RoleResponse'
   *       404:
   *         description: No se encontraron roles
   *       500:
   *         description: Error del servidor
   */
  async show(req, res) {
    try {
      const roles = await RoleModel.show();

      if (!roles || roles.length === 0) {
        return res.status(404).json({ error: 'No roles found' });
      }

      res.status(200).json({ 
        message: 'Roles retrieved successfully',
        data: roles 
      });

    } catch (error) {
      console.error('Error in show:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
/**
   * @swagger
   * /role/{id}:
   *   put:
   *     summary: Actualizar un rol por ID
   *     tags: [Role]
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
   *             $ref: '#/components/schemas/RoleInput'
   *     responses:
   *       200:
   *         description: Rol actualizado exitosamente
   *       400:
   *         description: Campos requeridos faltantes
   *       404:
   *         description: Rol no encontrado o no actualizado
   *       500:
   *         description: Error del servidor
   */
  async update(req, res) {
    try {
      const { Role_name } = req.body;
      const Role_id = req.params.id;

      if (!Role_id || !Role_name) {
        return res.status(400).json({ error: 'Required fields are missing' });
      }

      const result = await RoleModel.update(Role_id, { Role_name });

      if (!result || result === 0) {
        return res.status(404).json({ error: 'Role not found or not updated' });
      }

      res.status(200).json({ 
        message: 'Role updated successfully',
        data: result 
      });

    } catch (error) {
      console.error('Error in update:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
 /**
   * @swagger
   * /role/{id}:
   *   delete:
   *     summary: Eliminar un rol por ID
   *     tags: [Role]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Rol eliminado exitosamente
   *       404:
   *         description: Rol no encontrado o ya eliminado
   *       500:
   *         description: Error del servidor
   */
  async delete(req, res) {
    try {
      const Role_id = req.params.id;

      if (!Role_id) {
        return res.status(400).json({ error: 'Role ID is required' });
      }

      const result = await RoleModel.delete(Role_id);

      if (!result || result === 0) {
        return res.status(404).json({ error: 'Role not found or already deleted' });
      }

      res.status(200).json({ 
        message: 'Role deleted successfully',
        data: result 
      });

    } catch (error) {
      console.error('Error in delete:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
/**
   * @swagger
   * /role/{id}:
   *   get:
   *     summary: Obtener un rol por ID
   *     tags: [Role]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Rol obtenido exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/RoleResponse'
   *       404:
   *         description: Rol no encontrado
   *       500:
   *         description: Error del servidor
   */
  async findById(req, res) {
    try {
      const Role_id = req.params.id;

      if (!Role_id) {
        return res.status(400).json({ error: 'Role ID is required' });
      }

      const role = await RoleModel.findById(Role_id);

      if (!role || role.length === 0) {
        return res.status(404).json({ error: 'Role not found' });
      }

      res.status(200).json({ 
        message: 'Role retrieved successfully',
        data: role 
      });

    } catch (error) {
      console.error('Error in findById:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default new RoleController();
