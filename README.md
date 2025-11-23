# SistControl - Sistema de Control Escolar

Sistema completo de gestión escolar con autenticación JWT, panel de administración y módulos para estudiantes, profesores, cursos y más.

##  **Inicio Rápido**

### 1. **Configurar la Base de Datos**

1. Crea una base de datos MySQL llamada `sist_control`
2. Ejecuta las migraciones desde `backend/migrations/`

### 2. **Configurar Variables de Entorno**

Crea un archivo `.env` en la carpeta `backend/` con el siguiente contenido:

```env
# Configuración de la base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=sist_control
DB_PORT=3306

# Configuración del servidor
SERVER_PORT=3000

# JWT Secret para tokens de autenticación
JWT_SECRET=tu_jwt_secret_key_aqui_debe_ser_muy_seguro_y_largo

# Configuración de email (opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_password_de_aplicacion
```

### 3. **Instalar Dependencias**

```bash
cd backend
npm install
```

### 4. **Iniciar el Servidor**

```bash
cd backend
node server
```

El servidor estará disponible en: `http://localhost:3000`


##  **Acceso al Sistema**

### **Login de Administrador:**
- **URL:** `http://localhost:3000/frontend/views/auth/index.html`
- **Email:** `sergio@example.com`
- **Password:** `sergioG123`

### **Panel Principal:**
- **URL:** `http://localhost:3000/index.html`


##  **Flujo de Funcionamiento Corregido**

1. **Dashboard** → `index.html#dashboard`
2. **Botón Estudiantes** → `index.html#student`
3. **Botón Profesores** → `index.html#teacher`
4. **Botón Cursos** → `index.html#course`
5. **Botón Usuarios** → `index.html#user`
6. **Botón Roles** → `index.html#role`
7. **Botón Administrador** → `index.html#admin`
8. **Botón Estado Usuario** → `index.html#userStatus`
9. **Botón Cursos y Estudiantes** → `index.html#courseStudent`
10. **Botón Padres** → `index.html#father`

##  **Estructura del Proyecto**

```
/
├── backend/                 # API REST (Node.js + Express)
│   ├── controllers/        # Controladores de la API
│   ├── models/            # Modelos de datos
│   ├── routers/           # Rutas de la API
│   ├── middlewares/       # Middlewares de autenticación
│   └── migrations/        # Scripts de base de datos
├── frontend/               # Interfaz de usuario
│   ├── assets/            # CSS, JS, imágenes
│   ├── views/             # Páginas HTML
│   └── index.html         # Dashboard principal
└── README.md              # Este archivo
```

##  **Módulos Disponibles**

-  **Dashboard** - Panel principal con botones funcionales
-  **Administrador** - Gestión de administradores
-  **Estudiantes** - Gestión de estudiantes
-  **Profesores** - Gestión de profesores
-  **Cursos** - Gestión de cursos
-  **Usuarios** - Gestión de usuarios
-  **Roles** - Gestión de roles
-  **Estado de Usuario** - Gestión de estados
-  **Cursos y Estudiantes** - Asignación de cursos
-  **Padres** - Gestión de padres/acudientes

##  **Autenticación**

El sistema utiliza JWT (JSON Web Tokens) para la autenticación:

- **Login:** `POST /api_v1/admin/login`
- **Validar Token:** `POST /api_v1/validate-token`
- **Token expira:** 2 horas

##  **API Endpoints**

### **Autenticación:**
- `POST /api_v1/admin/login` - Login de administrador
- `POST /api_v1/validate-token` - Validar token JWT

### **Administradores:**
- `GET /api_v1/admin` - Listar administradores
- `POST /api_v1/admin` - Crear administrador
- `GET /api_v1/admin/:id` - Obtener administrador
- `PUT /api_v1/admin/:id` - Actualizar administrador
- `DELETE /api_v1/admin/:id` - Eliminar administrador

### **Estudiantes:**
- `GET /api_v1/student` - Listar estudiantes
- `POST /api_v1/student` - Crear estudiante
- `GET /api_v1/student/:id` - Obtener estudiante
- `PUT /api_v1/student/:id` - Actualizar estudiante
- `DELETE /api_v1/student/:id` - Eliminar estudiante

### **Profesores:**
- `GET /api_v1/teacher` - Listar profesores
- `POST /api_v1/teacher` - Crear profesor
- `GET /api_v1/teacher/:id` - Obtener profesor
- `PUT /api_v1/teacher/:id` - Actualizar profesor
- `DELETE /api_v1/teacher/:id` - Eliminar profesor

### **Cursos:**
- `GET /api_v1/course` - Listar cursos
- `POST /api_v1/course` - Crear curso
- `GET /api_v1/course/:id` - Obtener curso
- `PUT /api_v1/course/:id` - Actualizar curso
- `DELETE /api_v1/course/:id` - Eliminar curso

##  **Solución de Problemas**

### **Error: "Cannot GET /frontend/index.html"**
-  **Solución:** Asegúrate de que el servidor esté corriendo en `http://localhost:3000`
-  **Solución:** Verifica que la ruta de redirección sea correcta: `/index.html#dashboard`

### **Error: "Failed to load resource"**
-  **Solución:** Verifica que todas las rutas en los archivos HTML usen rutas absolutas (`/frontend/...`)
-  **Solución:** Asegúrate de que el servidor esté sirviendo archivos estáticos correctamente

### **Error de Autenticación**
-  **Solución:** Verifica que el archivo `.env` tenga `JWT_SECRET` configurado
-  **Solución:** Asegúrate de que el token se esté guardando correctamente en localStorage

### **Error de Base de Datos**
-  **Solución:** Verifica la configuración de conexión en `.env`
-  **Solución:** Ejecuta las migraciones para crear las tablas necesarias

##  **Características**

-  **Responsive Design** - Funciona en móviles y tablets
-  **Autenticación JWT** - Sistema de login seguro
-  **Panel de Administración** - Interfaz intuitiva
-  **Módulos Completos** - Gestión integral del colegio
-  **API REST** - Backend escalable
-  **Base de Datos MySQL** - Almacenamiento robusto
-  **Botones del Dashboard** - Funcionan correctamente
-  **Navegación Fluida** - Entre todos los módulos

##  **Flujo de Funcionamiento**

1. **Usuario accede al login** → `frontend/views/auth/index.html`
2. **Ingresa credenciales** → Validación en frontend
3. **Envía datos al backend** → `POST /api_v1/admin/login`
4. **Backend valida usuario** → Consulta base de datos
5. **Genera token JWT** → Firma con JWT_SECRET
6. **Redirige al dashboard** → `index.html#dashboard`
7. **Sistema valida token** → `POST /api_v1/validate-token`
8. **Carga módulos** → Navegación por hash (#)
9. **Botones del dashboard** → Redirigen al panel principal con hash correspondiente

