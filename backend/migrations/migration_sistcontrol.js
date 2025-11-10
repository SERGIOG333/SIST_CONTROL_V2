import mysql from "mysql2/promise";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "sistcontrol",
  password: process.env.DB_PASSWORD || "sistcontrol123",
  database: process.env.DB_NAME || "sist_control",
};

// Genera hash de contraseña para sergio
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export async function runMigration() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log("✅ Connected to MySQL database");

    // ---- PASO 1: Eliminar tablas en orden inverso ----
    console.log("\n🗑️  Eliminando tablas existentes...");
    await connection.query(`SET FOREIGN_KEY_CHECKS=0;`);
    
    const tablesToDrop = [
      'course_student',
      'student_attendance',
      'father_management',
      'admin',
      'course',
      'teacher',
      'users',
      'role',
      'student_management',
      'user_status'
    ];

    for (const table of tablesToDrop) {
      await connection.query(`DROP TABLE IF EXISTS ${table};`);
      console.log(`   ✓ Eliminada tabla: ${table}`);
    }
    
    await connection.query(`SET FOREIGN_KEY_CHECKS=1;`);

    // ---- PASO 2: Crear tablas base ----
    console.log("\n📦 Creando tablas...");

    await connection.query(`
      CREATE TABLE user_status (
        User_status_id INT AUTO_INCREMENT PRIMARY KEY,
        User_status_name VARCHAR(20) UNIQUE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
    `);
    console.log("   ✓ Tabla user_status creada");

    await connection.query(`
      CREATE TABLE role (
        Role_id INT AUTO_INCREMENT PRIMARY KEY,
        Role_name VARCHAR(20) UNIQUE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
    `);
    console.log("   ✓ Tabla role creada");

    await connection.query(`
      CREATE TABLE users (
        Users_id INT AUTO_INCREMENT PRIMARY KEY,
        Users_usuario VARCHAR(30) UNIQUE,
        Users_password VARCHAR(256) NOT NULL,
        User_status_fk INT NOT NULL,
        Role_fk INT NOT NULL,
        FOREIGN KEY (User_status_fk) REFERENCES user_status(User_status_id),
        FOREIGN KEY (Role_fk) REFERENCES role(Role_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
    `);
    console.log("   ✓ Tabla users creada");

    await connection.query(`
      CREATE TABLE teacher (
        teacher_id INT AUTO_INCREMENT PRIMARY KEY,
        teacher_name VARCHAR(50) NOT NULL,
        teacher_last_name VARCHAR(50) NOT NULL,
        teacher_identificacion VARCHAR(50) NOT NULL,
        teacher_course_assigned VARCHAR(50) NOT NULL,
        teacher_email VARCHAR(100) NOT NULL,
        Users_fk INT NOT NULL,
        FOREIGN KEY (Users_fk) REFERENCES users(Users_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
    `);
    console.log("   ✓ Tabla teacher creada");

    await connection.query(`
      CREATE TABLE student_management (
        student_id INT AUTO_INCREMENT PRIMARY KEY,
        student_name VARCHAR(50) NOT NULL,
        student_last_name VARCHAR(50) NOT NULL,
        student_identificacion VARCHAR(50) NOT NULL,
        student_arrival_time TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        student_departure_time TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        student_email VARCHAR(100) NOT NULL,
        student_date DATE NOT NULL,
        student_photo VARCHAR(50)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
    `);
    console.log("   ✓ Tabla student_management creada");

    await connection.query(`
      CREATE TABLE admin (
        admin_id INT AUTO_INCREMENT PRIMARY KEY,
        admin_name VARCHAR(50) NOT NULL,
        admin_last_name VARCHAR(50) NOT NULL,
        admin_email VARCHAR(50) NOT NULL,
        admin_password VARCHAR(100) NOT NULL,
        Users_fk INT NOT NULL,
        FOREIGN KEY (Users_fk) REFERENCES users(Users_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
    `);
    console.log("   ✓ Tabla admin creada");

    await connection.query(`
      CREATE TABLE course (
        course_id INT AUTO_INCREMENT PRIMARY KEY,
        course_course_name VARCHAR(100) NOT NULL,
        course_description VARCHAR(100) NOT NULL,
        course_assigned_teacher VARCHAR(100) NOT NULL,
        course_assigned_student VARCHAR(100) NOT NULL,
        teacher_fk INT NOT NULL,
        FOREIGN KEY (teacher_fk) REFERENCES teacher(teacher_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
    `);
    console.log("   ✓ Tabla course creada");

    await connection.query(`
      CREATE TABLE father_management (
        father_id INT AUTO_INCREMENT PRIMARY KEY,
        father_name VARCHAR(50) NOT NULL,
        father_last_name VARCHAR(50) NOT NULL,
        father_email VARCHAR(50) NOT NULL,
        father_number VARCHAR(20) NOT NULL,
        student_fk INT NOT NULL,
        FOREIGN KEY (student_fk) REFERENCES student_management(student_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
    `);
    console.log("   ✓ Tabla father_management creada");

    await connection.query(`
      CREATE TABLE course_student (
        course_student_id INT AUTO_INCREMENT PRIMARY KEY,
        course_fk INT NOT NULL,
        student_fk INT NOT NULL,
        FOREIGN KEY (course_fk) REFERENCES course(course_id),
        FOREIGN KEY (student_fk) REFERENCES student_management(student_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
    `);
    console.log("   ✓ Tabla course_student creada");

    await connection.query(`
      CREATE TABLE student_attendance (
        attendance_id INT AUTO_INCREMENT PRIMARY KEY,
        student_fk INT NOT NULL,
        attendance_time TIME NOT NULL,
        attendance_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_fk) REFERENCES student_management(student_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);
    console.log("   ✓ Tabla student_attendance creada");

    // ---- PASO 3: Insertar datos iniciales ----
    console.log("\n📝 Insertando datos iniciales...");

    // User Status
    await connection.query(`
      INSERT INTO user_status (User_status_name) VALUES ('Activo'), ('Inactivo');
    `);
    console.log("   ✓ Estados de usuario insertados");

    // Roles
    await connection.query(`
      INSERT INTO role (Role_name) VALUES ('Coordinador'), ('Profesor'), ('Administrador');
    `);
    console.log("   ✓ Roles insertados");

    // Generar hash para la contraseña de sergio
    const sergioPassword = await hashPassword('sergioG123');
    const adminPassword = await hashPassword('admin123');
    const profesorPassword = await hashPassword('profesor123');

    // Users
    await connection.query(`
      INSERT INTO users (Users_usuario, Users_password, User_status_fk, Role_fk) VALUES 
        ('admin', ?, 1, 1),
        ('profesor', ?, 1, 2),
        ('sergio', ?, 1, 3);
    `, [adminPassword, profesorPassword, sergioPassword]);
    console.log("   ✓ Usuarios insertados");
    console.log("   📌 Usuario: sergio | Contraseña: sergioG123");

    // Teachers
    await connection.query(`
      INSERT INTO teacher (teacher_name, teacher_last_name, teacher_identificacion, teacher_course_assigned, teacher_email, Users_fk) VALUES
        ('Laura', 'Martínez', '1020304050', 'Matemáticas', 'laura.martinez@example.com', 2);
    `);
    console.log("   ✓ Profesores insertados");

    // Students
    await connection.query(`
      INSERT INTO student_management (student_name, student_last_name, student_identificacion, student_email, student_date, student_photo) VALUES
        ('Laura', 'Gómez', '1098765432', 'laura.gomez@example.com', '2025-06-29', ''),
        ('Sergio Andres', 'Cardona', '112222222', 'carbal@gmail.com', '2025-09-09', 'foto.jpg'),
        ('María', 'López', '1023456789', 'maria.lopez@example.com', '2024-01-15', '');
    `);
    console.log("   ✓ Estudiantes insertados");

    // Courses
    await connection.query(`
      INSERT INTO course (course_course_name, course_description, course_assigned_teacher, course_assigned_student, teacher_fk) VALUES
        ('Sociales', 'Historia y geografía', 'Laura Martínez', 'Múltiples estudiantes', 1),
        ('Matemáticas', 'Curso de álgebra y geometría', 'Laura Martínez', 'Múltiples estudiantes', 1);
    `);
    console.log("   ✓ Cursos insertados");

    // Admins
    await connection.query(`
      INSERT INTO admin (admin_name, admin_last_name, admin_email, admin_password, Users_fk) VALUES
        ('Juan', 'Pérez', 'juanperez@example.com', ?, 1),
        ('Sergio', 'García', 'sergio@example.com', ?, 3);
    `, [adminPassword, sergioPassword]);
    console.log("   ✓ Administradores insertados");
    console.log("   📌 Admin: Sergio García | Usuario: sergio | Contraseña: sergioG123");

    // Fathers
    await connection.query(`
      INSERT INTO father_management (father_name, father_last_name, father_email, father_number, student_fk) VALUES
        ('Carlos', 'Ramírez', 'carlos.ramirez@example.com', '3001234567', 2),
        ('Pedro', 'Gómez', 'pedro.gomez@example.com', '3009876543', 1);
    `);
    console.log("   ✓ Padres insertados");

    // Course Students
    await connection.query(`
      INSERT INTO course_student (course_fk, student_fk) VALUES
        (1, 1),
        (1, 2),
        (2, 2),
        (2, 3);
    `);
    console.log("   ✓ Relaciones curso-estudiante insertadas");

    // Student Attendance
    await connection.query(`
      INSERT INTO student_attendance (student_fk, attendance_time, attendance_date) VALUES
        (1, '08:00:00', '2025-07-04'),
        (2, '14:17:38', '2025-07-04'),
        (3, '07:45:00', '2025-07-04');
    `);
    console.log("   ✓ Asistencias insertadas");

    console.log("\n✅ Database migration completed successfully!");
    console.log("\n📊 Resumen de datos insertados:");
    console.log("   • Estados de usuario: 2");
    console.log("   • Roles: 3");
    console.log("   • Usuarios: 3");
    console.log("   • Profesores: 1");
    console.log("   • Estudiantes: 3");
    console.log("   • Cursos: 2");
    console.log("   • Administradores: 2");
    console.log("   • Padres: 2");
    console.log("   • Relaciones curso-estudiante: 4");
    console.log("   • Asistencias: 3");
    console.log("\n🔐 Credenciales de acceso:");
    console.log("   Usuario: sergio");
    console.log("   Contraseña: sergioG123");

    return { success: true };
  } catch (error) {
    console.error("\n❌ Migration failed:", error.message);
    console.error("Stack trace:", error.stack);
    return { success: false, error };
  } finally {
    if (connection) {
      await connection.end();
      console.log("\n🔌 Database connection closed");
    }
  }
}