import { Router } from "express";
import TeacherController from '../controllers/teacher.controller.js';

const router = Router();
const name = '/teacher';

router.post(name, TeacherController.register);
router.get(name + '/', TeacherController.show);
router.get(name + '/:id', TeacherController.findById);
router.put(name + '/:id', TeacherController.update);
router.delete(name + '/:id', TeacherController.delete);

export default router;
