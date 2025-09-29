// backend/migrations/migrate.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "sist_control",
  multipleStatements: true,
};

const preStatements = [
  `SET FOREIGN_KEY_CHECKS=0;`,
  // Eliminar procedimientos (por si existían)
  `DROP PROCEDURE IF EXISTS sp_create_student;`,
  `DROP PROCEDURE IF EXISTS sp_create_teacher;`,
  `DROP PROCEDURE IF EXISTS sp_create_admin;`,
  `DROP PROCEDURE IF EXISTS sp_enroll_student;`,
  `DROP PROCEDURE IF EXISTS sp_register_attendance;`,
  `DROP PROCEDURE IF EXISTS sp_create_father;`,
  `DROP PROCEDURE IF EXISTS sp_get_student_courses;`,
  `DROP PROCEDURE IF EXISTS sp_get_course_students;`,
  `DROP PROCEDURE IF EXISTS sp_get_student_attendance;`,
  // Eliminar tablas (orden inverso a dependencias)
  `DROP TABLE IF EXISTS course_student;`,
  `DROP TABLE IF EXISTS student_attendance;`,
  `DROP TABLE IF EXISTS father_management;`,
  `DROP TABLE IF EXISTS admin;`,
  `DROP TABLE IF EXISTS course;`,
  `DROP TABLE IF EXISTS teacher;`,
  `DROP TABLE IF EXISTS student_management;`,
  `DROP TABLE IF EXISTS users;`,
  `DROP TABLE IF EXISTS role;`,
  `DROP TABLE IF EXISTS user_status;`,
  `SET FOREIGN_KEY_CHECKS=1;`,
];

const tableStatements = [
  `CREATE TABLE user_status (
    User_status_id INT AUTO_INCREMENT PRIMARY KEY,
    User_status_name VARCHAR(20) UNIQUE NOT NULL,
    User_status_description VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status_name (User_status_name)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;`,

  `CREATE TABLE role (
    Role_id INT AUTO_INCREMENT PRIMARY KEY,
    Role_name VARCHAR(20) UNIQUE NOT NULL,
    Role_description VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_role_name (Role_name)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;`,

  `CREATE TABLE users (
    Users_id INT AUTO_INCREMENT PRIMARY KEY,
    Users_usuario VARCHAR(30) UNIQUE NOT NULL,
    Users_password VARCHAR(256) NOT NULL,
    User_status_fk INT NOT NULL,
    Role_fk INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (User_status_fk) REFERENCES user_status(User_status_id) ON DELETE RESTRICT,
    FOREIGN KEY (Role_fk) REFERENCES role(Role_id) ON DELETE RESTRICT,
    INDEX idx_usuario (Users_usuario),
    INDEX idx_status (User_status_fk),
    INDEX idx_role (Role_fk)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;`,

  `CREATE TABLE student_management (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(50) NOT NULL,
    student_last_name VARCHAR(50) NOT NULL,
    student_identificacion VARCHAR(50) UNIQUE NOT NULL,
    student_email VARCHAR(100) UNIQUE NOT NULL,
    student_date DATE NOT NULL COMMENT 'Fecha de nacimiento',
    student_photo VARCHAR(255) DEFAULT NULL,
    student_qr_code VARCHAR(255) DEFAULT NULL COMMENT 'Código QR único',
    student_arrival_time TIMESTAMP(6) NULL DEFAULT NULL,
    student_departure_time TIMESTAMP(6) NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_identificacion (student_identificacion),
    INDEX idx_email (student_email),
    INDEX idx_qr_code (student_qr_code)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;`,

  `CREATE TABLE teacher (
    teacher_id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_name VARCHAR(50) NOT NULL,
    teacher_last_name VARCHAR(50) NOT NULL,
    teacher_identificacion VARCHAR(50) UNIQUE NOT NULL,
    teacher_course_assigned VARCHAR(50) NOT NULL,
    teacher_email VARCHAR(100) UNIQUE NOT NULL,
    Users_fk INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (Users_fk) REFERENCES users(Users_id) ON DELETE CASCADE,
    INDEX idx_identificacion (teacher_identificacion),
    INDEX idx_email (teacher_email)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;`,

  `CREATE TABLE admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    admin_name VARCHAR(50) NOT NULL,
    admin_last_name VARCHAR(50) NOT NULL,
    admin_email VARCHAR(50) UNIQUE NOT NULL,
    admin_password VARCHAR(100) NOT NULL,
    Users_fk INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (Users_fk) REFERENCES users(Users_id) ON DELETE CASCADE,
    INDEX idx_email (admin_email)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;`,

  `CREATE TABLE course (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    course_course_name VARCHAR(100) NOT NULL,
    course_description VARCHAR(255) NOT NULL,
    course_assigned_student VARCHAR(100) NOT NULL,
    course_capacity INT DEFAULT 30,
    course_current_students INT DEFAULT 0,
    teacher_fk INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_fk) REFERENCES teacher(teacher_id) ON DELETE RESTRICT,
    INDEX idx_course_name (course_course_name)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;`,

  `CREATE TABLE father_management (
    father_id INT AUTO_INCREMENT PRIMARY KEY,
    father_name VARCHAR(50) NOT NULL,
    father_last_name VARCHAR(50) NOT NULL,
    father_email VARCHAR(100) NOT NULL,
    father_number VARCHAR(20) NOT NULL,
    father_relationship VARCHAR(20) DEFAULT 'Padre',
    student_fk INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_fk) REFERENCES student_management(student_id) ON DELETE CASCADE,
    INDEX idx_student (student_fk),
    INDEX idx_email (father_email)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;`,

  `CREATE TABLE course_student (
    course_student_id INT AUTO_INCREMENT PRIMARY KEY,
    course_fk INT NOT NULL,
    student_fk INT NOT NULL,
    enrollment_date DATE NOT NULL DEFAULT (CURRENT_DATE),
    enrollment_status VARCHAR(20) DEFAULT 'Activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_fk) REFERENCES course(course_id) ON DELETE CASCADE,
    FOREIGN KEY (student_fk) REFERENCES student_management(student_id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (course_fk, student_fk),
    INDEX idx_course (course_fk),
    INDEX idx_student (student_fk)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;`,

  `CREATE TABLE student_attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    student_fk INT NOT NULL,
    attendance_time TIME NOT NULL,
    attendance_date DATE NOT NULL,
    attendance_type VARCHAR(20) DEFAULT 'Entrada',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_fk) REFERENCES student_management(student_id) ON DELETE CASCADE,
    INDEX idx_student (student_fk),
    INDEX idx_date (attendance_date),
    INDEX idx_student_date (student_fk, attendance_date)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;`,
];

const insertStatements = [
  // user_status
  `INSERT INTO user_status (User_status_name, User_status_description) VALUES 
    ('Activo', 'Usuario activo en el sistema'),
    ('Inactivo', 'Usuario inactivo temporalmente'),
    ('Suspendido', 'Usuario suspendido por motivos administrativos');`,

  // role
  `INSERT INTO role (Role_name, Role_description) VALUES 
    ('Administrador', 'Control total del sistema'),
    ('Coordinador', 'Coordinador académico'),
    ('Profesor', 'Docente del colegio'),
    ('Estudiante', 'Estudiante activo'),
    ('Padre', 'Padre o acudiente');`,

  // users (ejemplo reducido)
  `INSERT INTO users (Users_usuario, Users_password, User_status_fk, Role_fk) VALUES 
    ('admin', '$2b$10$O3X7.aXiTql6rVRPPI0tweAqWwPTXtj9cD3/TYv5mn7jsX4f3S5E.', 1, 1),
    ('coordinador01', '$2b$10$YmSwsh5V/VPSxCjkCuo3leGS9NHAggenFFrz62G26deimW1e7CBHK', 1, 2),
    ('profesor01', '$2b$10$YmSwsh5V/VPSxCjkCuo3leGS9NHAggenFFrz62G26deimW1e7CBHK', 1, 3),
    ('estudiante01', '$2b$10$YmSwsh5V/VPSxCjkCuo3leGS9NHAggenFFrz62G26deimW1e7CBHK', 1, 4);`,

  // admin
  `INSERT INTO admin (admin_name, admin_last_name, admin_email, admin_password, Users_fk) VALUES
    ('Juan', 'Pérez', 'admin@sist-control.com', '$2b$10$O3X7.aXiTql6rVRPPI0tweAqWwPTXtj9cD3/TYv5mn7jsX4f3S5E.', 1);`,

  // teacher
  `INSERT INTO teacher (teacher_name, teacher_last_name, teacher_identificacion, teacher_course_assigned, teacher_email, Users_fk) VALUES
    ('Laura', 'Martínez', '1020304050', 'Matemáticas', 'laura.martinez@sist-control.com', 3),
    ('José', 'Padilla', '1030405060', 'Sociales', 'jose.padilla@sist-control.com', 4);`,

  // course
  `INSERT INTO course (course_course_name, course_description, course_assigned_student, course_capacity, course_current_students, teacher_fk) VALUES
    ('Matemáticas 10-A', 'Curso de álgebra y geometría para grado 10', 'Estudiantes grado 10-A', 35, 0, 1),
    ('Sociales 10-A', 'Historia y geografía para grado 10', 'Estudiantes grado 10-A', 35, 0, 2);`,

  // students
  `INSERT INTO student_management (student_name, student_last_name, student_identificacion, student_email, student_date, student_photo, student_qr_code) VALUES
    ('Carlos', 'Ramírez', '1098765432', 'carlos.ramirez@estudiante.com', '2008-03-15', 'carlos_ramirez.jpg', 'QR-STU-001'),
    ('Ana', 'López', '1098765433', 'ana.lopez@estudiante.com', '2008-07-22', 'ana_lopez.jpg', 'QR-STU-002');`,

  // fathers
  `INSERT INTO father_management (father_name, father_last_name, father_email, father_number, father_relationship, student_fk) VALUES
    ('Roberto', 'Ramírez', 'roberto.ramirez@gmail.com', '3001234567', 'Padre', 1),
    ('Carmen', 'López', 'carmen.lopez@gmail.com', '3007654321', 'Madre', 2);`,

  // course_student
  `INSERT INTO course_student (course_fk, student_fk, enrollment_date, enrollment_status) VALUES
    (1, 1, '2025-01-15', 'Activo'),
    (2, 2, '2025-01-15', 'Activo');`,

  // attendance sample
  `INSERT INTO student_attendance (student_fk, attendance_time, attendance_date, attendance_type) VALUES
    (1, '07:30:00', '2025-09-29', 'Entrada'),
    (2, '07:35:00', '2025-09-29', 'Entrada');`,
];

const procedures = [
  {
    name: "sp_create_student",
    sql: `
CREATE PROCEDURE sp_create_student(
  IN p_name VARCHAR(50),
  IN p_last_name VARCHAR(50),
  IN p_identificacion VARCHAR(50),
  IN p_email VARCHAR(100),
  IN p_birth_date DATE,
  IN p_photo VARCHAR(255),
  IN p_qr_code VARCHAR(255)
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error al crear estudiante';
  END;

  START TRANSACTION;

  INSERT INTO student_management (
    student_name,
    student_last_name,
    student_identificacion,
    student_email,
    student_date,
    student_photo,
    student_qr_code
  ) VALUES (
    p_name,
    p_last_name,
    p_identificacion,
    p_email,
    p_birth_date,
    p_photo,
    p_qr_code
  );

  COMMIT;
  SELECT LAST_INSERT_ID() as student_id;
END;`,
  },

  {
    name: "sp_create_teacher",
    sql: `
CREATE PROCEDURE sp_create_teacher(
  IN p_name VARCHAR(50),
  IN p_last_name VARCHAR(50),
  IN p_identificacion VARCHAR(50),
  IN p_course_assigned VARCHAR(50),
  IN p_email VARCHAR(100),
  IN p_username VARCHAR(30),
  IN p_password VARCHAR(256)
)
BEGIN
  DECLARE v_user_id INT;
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error al crear profesor';
  END;

  START TRANSACTION;

  INSERT INTO users (Users_usuario, Users_password, User_status_fk, Role_fk)
  VALUES (p_username, p_password, 1, 3);

  SET v_user_id = LAST_INSERT_ID();

  INSERT INTO teacher (
    teacher_name,
    teacher_last_name,
    teacher_identificacion,
    teacher_course_assigned,
    teacher_email,
    Users_fk
  ) VALUES (
    p_name,
    p_last_name,
    p_identificacion,
    p_course_assigned,
    p_email,
    v_user_id
  );

  COMMIT;
  SELECT LAST_INSERT_ID() as teacher_id, v_user_id as user_id;
END;`,
  },

  {
    name: "sp_create_admin",
    sql: `
CREATE PROCEDURE sp_create_admin(
  IN p_name VARCHAR(50),
  IN p_last_name VARCHAR(50),
  IN p_email VARCHAR(50),
  IN p_password VARCHAR(100),
  IN p_username VARCHAR(30)
)
BEGIN
  DECLARE v_user_id INT;
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error al crear administrador';
  END;

  START TRANSACTION;

  INSERT INTO users (Users_usuario, Users_password, User_status_fk, Role_fk)
  VALUES (p_username, p_password, 1, 1);

  SET v_user_id = LAST_INSERT_ID();

  INSERT INTO admin (
    admin_name,
    admin_last_name,
    admin_email,
    admin_password,
    Users_fk
  ) VALUES (
    p_name,
    p_last_name,
    p_email,
    p_password,
    v_user_id
  );

  COMMIT;
  SELECT LAST_INSERT_ID() as admin_id, v_user_id as user_id;
END;`,
  },

  {
    name: "sp_enroll_student",
    sql: `
CREATE PROCEDURE sp_enroll_student(
  IN p_course_id INT,
  IN p_student_id INT
)
BEGIN
  DECLARE v_capacity INT DEFAULT 0;
  DECLARE v_current_students INT DEFAULT 0;
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error al matricular estudiante';
  END;

  START TRANSACTION;

  SELECT course_capacity, course_current_students
  INTO v_capacity, v_current_students
  FROM course
  WHERE course_id = p_course_id
  FOR UPDATE;

  IF v_current_students >= v_capacity THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El curso ha alcanzado su capacidad máxima';
  END IF;

  INSERT INTO course_student (course_fk, student_fk, enrollment_date, enrollment_status)
  VALUES (p_course_id, p_student_id, CURRENT_DATE, 'Activo');

  UPDATE course
  SET course_current_students = course_current_students + 1
  WHERE course_id = p_course_id;

  COMMIT;
  SELECT 'Estudiante matriculado exitosamente' as message;
END;`,
  },

  {
    name: "sp_register_attendance",
    sql: `
CREATE PROCEDURE sp_register_attendance(
  IN p_student_id INT,
  IN p_attendance_type VARCHAR(20)
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error al registrar asistencia';
  END;

  START TRANSACTION;

  INSERT INTO student_attendance (
    student_fk,
    attendance_time,
    attendance_date,
    attendance_type
  ) VALUES (
    p_student_id,
    CURRENT_TIME,
    CURRENT_DATE,
    p_attendance_type
  );

  IF p_attendance_type = 'Entrada' THEN
    UPDATE student_management
    SET student_arrival_time = CURRENT_TIMESTAMP
    WHERE student_id = p_student_id;
  ELSE
    UPDATE student_management
    SET student_departure_time = CURRENT_TIMESTAMP
    WHERE student_id = p_student_id;
  END IF;

  COMMIT;
  SELECT 'Asistencia registrada exitosamente' as message;
END;`,
  },

  {
    name: "sp_create_father",
    sql: `
CREATE PROCEDURE sp_create_father(
  IN p_name VARCHAR(50),
  IN p_last_name VARCHAR(50),
  IN p_email VARCHAR(100),
  IN p_number VARCHAR(20),
  IN p_relationship VARCHAR(20),
  IN p_student_id INT
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error al crear padre/acudiente';
  END;

  START TRANSACTION;

  INSERT INTO father_management (
    father_name,
    father_last_name,
    father_email,
    father_number,
    father_relationship,
    student_fk
  ) VALUES (
    p_name,
    p_last_name,
    p_email,
    p_number,
    p_relationship,
    p_student_id
  );

  COMMIT;
  SELECT LAST_INSERT_ID() as father_id;
END;`,
  },

  {
    name: "sp_get_student_courses",
    sql: `
CREATE PROCEDURE sp_get_student_courses(
  IN p_student_id INT
)
BEGIN
  SELECT
    c.course_id,
    c.course_course_name,
    c.course_description,
    t.teacher_name,
    t.teacher_last_name,
    cs.enrollment_date,
    cs.enrollment_status
  FROM course_student cs
  INNER JOIN course c ON cs.course_fk = c.course_id
  INNER JOIN teacher t ON c.teacher_fk = t.teacher_id
  WHERE cs.student_fk = p_student_id
  ORDER BY c.course_course_name;
END;`,
  },

  {
    name: "sp_get_course_students",
    sql: `
CREATE PROCEDURE sp_get_course_students(
  IN p_course_id INT
)
BEGIN
  SELECT
    s.student_id,
    s.student_name,
    s.student_last_name,
    s.student_identificacion,
    s.student_email,
    cs.enrollment_date,
    cs.enrollment_status
  FROM course_student cs
  INNER JOIN student_management s ON cs.student_fk = s.student_id
  WHERE cs.course_fk = p_course_id
  ORDER BY s.student_last_name, s.student_name;
END;`,
  },

  {
    name: "sp_get_student_attendance",
    sql: `
CREATE PROCEDURE sp_get_student_attendance(
  IN p_student_id INT,
  IN p_start_date DATE,
  IN p_end_date DATE
)
BEGIN
  SELECT
    attendance_id,
    attendance_date,
    attendance_time,
    attendance_type,
    created_at
  FROM student_attendance
  WHERE student_fk = p_student_id
    AND attendance_date BETWEEN p_start_date AND p_end_date
  ORDER BY attendance_date DESC, attendance_time DESC;
END;`,
  },
];

export async function runMigration() {
  let connection;
  try {
    console.log("🚀 Iniciando migración de base de datos...\n");
    connection = await mysql.createConnection(dbConfig);
    console.log("✅ Conectado a MySQL/MariaDB\n");

    let step = 1;

    // Ejecutar preStatements (drops)
    for (const sql of preStatements) {
      try {
        if (sql.includes("DROP PROCEDURE")) {
          console.log(`📦 Paso ${step++}: Eliminando procedimientos almacenados...`);
        } else if (sql.includes("DROP TABLE")) {
          console.log(`🗑️  Paso ${step++}: Eliminando tablas existentes...`);
        } else {
          console.log(`➡️  Paso ${step++}: Ejecutando...`);
        }
        await connection.query(sql);
      } catch (err) {
        console.error(`❌ Error en SQL (pre): ${err.message}`);
        throw err;
      }
    }

    // Crear tablas
    for (const sql of tableStatements) {
      try {
        const tableMatch = sql.match(/CREATE TABLE `?(\w+)`?/i);
        const tableName = tableMatch ? tableMatch[1] : "tabla";
        console.log(`📋 Paso ${step++}: Creando tabla '${tableName}'...`);
        await connection.query(sql);
      } catch (err) {
        console.error(`❌ Error en SQL (tabla): ${err.message}`);
        throw err;
      }
    }

    // Inserts
    for (const sql of insertStatements) {
      try {
        const tableMatch = sql.match(/INSERT INTO `?(\w+)`?/i);
        const tableName = tableMatch ? tableMatch[1] : "datos";
        console.log(`💾 Paso ${step++}: Insertando datos en '${tableName}'...`);
        await connection.query(sql);
      } catch (err) {
        console.error(`❌ Error en SQL (insert): ${err.message}`);
        throw err;
      }
    }

    // Procedimientos
    for (const proc of procedures) {
      try {
        console.log(`⚙️  Paso ${step++}: Creando procedimiento '${proc.name}'...`);
        // Asegurar que no exista (ya hicimos DROP antes, pero reforzamos)
        await connection.query(`DROP PROCEDURE IF EXISTS ${proc.name};`);
        await connection.query(proc.sql);
      } catch (err) {
        console.error(`❌ Error al crear procedimiento ${proc.name}: ${err.message}`);
        throw err;
      }
    }

    console.log("\n✨ ¡Migración completada exitosamente!");
  } catch (error) {
    console.error("\n❌ Migración fallida:", error);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

// Permite ejecutar con: node migrate.js
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration();
}
