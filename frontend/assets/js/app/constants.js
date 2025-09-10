const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

// Backend API host
const HOST = "http://localhost:3000/api_v1";

// Frontend views host (si lo necesitas para redirecciones absolutas)
const HOST_VIEWS = "http://localhost:3000/views";

// API Endpoints
const URL_ADMIN_LOGIN = HOST + "/login";
const URL_ADMIN = HOST + "/admin/";
const URL_ATTENDANCE = HOST + "/attendance";

const URL_COURSE = HOST + "/course/";
const URL_COURSE_STUDENT = HOST + "/course-student/";
const URL_FATHER = HOST + "/father/";
const URL_ROLE = HOST + "/role/";
const URL_STUDENT = HOST + "/student/";
const URL_TEACHER = HOST + "/teacher/";
const URL_USERS = HOST + "/users/";
const URL_USER_STATUS = HOST + "/userStatus/";

// Clave para guardar el token en localStorage
const KEY_TOKEN = "token-app";
