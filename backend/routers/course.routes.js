import { Router } from "express";
import CourseController from "../controllers/course.controller.js";

const router = Router();
const name = "/course";

router.post(name, CourseController.register);
router.get(name + "/", CourseController.show);
router.get(name + "/:id", CourseController.findById);
router.put(name + "/:id", CourseController.update);
router.delete(name + "/:id", CourseController.delete);

export default router;
