
import express from 'express';
import cors from 'cors';
/**
 * Routers importados para gestionar diferentes rutas del sistema escolar.
 */
import attendanceRoutes from "../routers/attendance.routes.js";
import uploadFile from '../routers/uploadFile.router.js';
import courseRouter from '../routers/course.routes.js';
import courseStudentRouter from '../routers/courseStudent.routes.js';
import studentRouter from '../routers/studentManagement.routes.js';
import fatherRouter from '../routers/fatherManagement.routes.js';
import adminRouter from '../routers/admin.routes.js';
import roleRouter from '../routers/role.routes.js';
import userStatusRouter from '../routers/userStatus.routes.js';
import userRouter from '../routers/user.routes.js';
import teacherRouter from '../routers/teacher.routes.js';
import tokenRouter from '../routers/token.router.js';
import apiRouter from "../routers/api.router.js";
import emailRouter from "../routers/emails.routes.js";

const app = express();

/**
 * @middleware
 * Habilita CORS y permite recibir datos en formato JSON y urlencoded.
 */

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================== RUTAS DE LA API ==================
app.use('/api_v1', emailRouter);
app.use('/api_v1', attendanceRoutes);
/**
 * @route /api_v1/admin
 * @description Módulo para gestión de administradores.
 */
app.use('/api_v1',adminRouter);
/**
 * @route /api_v1/father
 * @description Módulo para gestión de father.
 */
app.use('/api_v1',fatherRouter);
/**
 * @route /api_v1/course-student
 * @description Módulo para asignar cursos a estudiantes.
 */
app.use('/api_v1',courseStudentRouter);
/**
 * @route /api_v1/course
 * @description Módulo para gestión de cursos.
 */
app.use('/api_v1',courseRouter);
/**
 * @route /api_v1/upload
 * @description Módulo para carga de archivos (fotos, etc.).
 */
app.use('/api_v1',uploadFile);
/**
 * @route /api_v1/student
 * @description Módulo para gestión de estudiantes.
 */
app.use('/api_v1',studentRouter);
/**
 * @route /api_v1/role
 * @description Módulo para gestión de roles.
 */
app.use('/api_v1',roleRouter);
/**
 * @route /api_v1/user-status
 * @description Módulo para gestión de estados de usuario.
 */
app.use('/api_v1',userStatusRouter);	
/**
 * @route /api_v1/user
 * @description Módulo para gestión de usuarios del sistema.
 */
app.use('/api_v1',userRouter);	
/**
 * @route /api_v1/teacher
 * @description Módulo para gestión de profesores.
 */
app.use('/api_v1',teacherRouter );
/**
 * @route /api_v1/token
 * @description Módulo de autenticación y generación de token JWT.
 */
app.use('/api_v1',tokenRouter);	
/**
 * @route /api
 * @description Ruta general de prueba (API pública o sin auth).
 */
app.use("/api",apiRouter);

/**
 * @middleware
 * Middleware de manejo de rutas no encontradas.
 */


app.use((req, res,) => {
  res.status(404).json({
    message: 'Endpoint not found'
  });
});

export default app;