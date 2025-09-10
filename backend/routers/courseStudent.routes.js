import { Router } from "express";
import CourseStudentController from "../controllers/courseStudent.controller.js";

const router = Router();
const name = "/course-student";

router.post(name, CourseStudentController.register);
router.get(name + "/", CourseStudentController.show);
router.get(name + "/:id", CourseStudentController.findById);
router.put(name + "/:id", CourseStudentController.update);
router.delete(name + "/:id", CourseStudentController.delete);

export default router;
