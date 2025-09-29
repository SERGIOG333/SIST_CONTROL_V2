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

const sqlStatements = [
  // ============================================
  // PASO 1: ELIMINAR TABLAS Y PROCEDIMIENTOS
  // ============================================
  `SET FOREIGN_KEY_CHECKS=0;`,
  
  // Eliminar procedimientos almacenados si existen
  `DROP PROCEDURE IF EXISTS sp_create_student;`,
  `DROP PROCEDURE IF EXISTS sp_create_teacher;`,
  `DROP PROCEDURE IF EXISTS sp_create_admin;`,
  `DROP PROCEDURE IF EXISTS sp_enroll_student;`,
  `DROP PROCEDURE IF EXISTS sp_register_attendance;`,
  `DROP PROCEDURE IF EXISTS sp_create_father;`,
  `DROP PROCEDURE IF EXISTS sp_get_student_courses;`,
  `DROP PROCEDURE IF EXISTS sp_get_course_students;`,
  `DROP PROCEDURE IF EXISTS sp_get_student_attendance;`,
  
  // Eliminar tablas en orden inverso
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

  // ============================================
  // PASO 2: CREAR TABLAS BASE
  // ============================================
  
  // Tabla: user_status
  `CREATE TABLE user_status (
    User_status_id INT AUTO_INCREMENT PRIMARY KEY,
    User_status_name VARCHAR(20) UNIQUE NOT NULL,
    User_status_description VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status_name (User_status_name)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;`,

  // Tabla: role
  `CREATE TABLE role (
    Role_id INT AUTO_INCREMENT PRIMARY KEY,
    Role_name VARCHAR(20) UNIQUE NOT NULL,
    Role_description VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_role_name (Role_name)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;`,

  // Tabla: users
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

  // Tabla: student_management
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

  // Tabla: teacher
  `CREATE TABLE teacher (
    teacher_id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_name VARCHAR(50) NOT NULL,
    teacher_last_name VARCHAR(50) NOT NULL,
    teacher_identificacion INT(50) UNIQUE NOT NULL,
    teacher_course_assigned VARCHAR(50) NOT NULL,
    teacher_email VARCHAR(100) UNIQUE NOT NULL,
    Users_fk INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (Users_fk) REFERENCES users(Users_id) ON DELETE CASCADE,
    INDEX idx_identificacion (teacher_identificacion),
    INDEX idx_email (teacher_email)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;`,

  // Tabla: admin
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

  // Tabla: course
  `CREATE TABLE course (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    course_course_name VARCHAR(100) NOT NULL,
    course_description VARCHAR(255) NOT NULL,
    course_assigned_student VARCHAR(100) NOT NULL,
    course_capacity INT DEFAULT 30 COMMENT 'Capacidad máxima del curso',
    course_current_students INT DEFAULT 0 COMMENT 'Estudiantes actuales',
    teacher_fk INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_fk) REFERENCES teacher(teacher_id) ON DELETE RESTRICT,
    INDEX idx_course_name (course_course_name)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;`,

  // Tabla: father_management
  `CREATE TABLE father_management (
    father_id INT AUTO_INCREMENT PRIMARY KEY,
    father_name VARCHAR(50) NOT NULL,
    father_last_name VARCHAR(50) NOT NULL,
    father_email VARCHAR(100) NOT NULL,
    father_number VARCHAR(20) NOT NULL,
    father_relationship VARCHAR(20) DEFAULT 'Padre' COMMENT 'Tipo de relación: Padre, Madre, Acudiente',
    student_fk INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_fk) REFERENCES student_management(student_id) ON DELETE CASCADE,
    INDEX idx_student (student_fk),
    INDEX idx_email (father_email)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;`,

  // Tabla: course_student
  `CREATE TABLE course_student (
    course_student_id INT AUTO_INCREMENT PRIMARY KEY,
    course_fk INT NOT NULL,
    student_fk INT NOT NULL,
    enrollment_date DATE NOT NULL DEFAULT (CURRENT_DATE),
    enrollment_status VARCHAR(20) DEFAULT 'Activo' COMMENT 'Activo, Retirado, Suspendido',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_fk) REFERENCES course(course_id) ON DELETE CASCADE,
    FOREIGN KEY (student_fk) REFERENCES student_management(student_id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (course_fk, student_fk),
    INDEX idx_course (course_fk),
    INDEX idx_student (student_fk)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;`,

  // Tabla: student_attendance
  `CREATE TABLE student_attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    student_fk INT NOT NULL,
    attendance_time TIME NOT NULL,
    attendance_date DATE NOT NULL,
    attendance_type VARCHAR(20) DEFAULT 'Entrada' COMMENT 'Entrada o Salida',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_fk) REFERENCES student_management(student_id) ON DELETE CASCADE,
    INDEX idx_student (student_fk),
    INDEX idx_date (attendance_date),
    INDEX idx_student_date (student_fk, attendance_date)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;`,

  // ============================================
  // PASO 3: INSERTAR DATOS DE PRUEBA
  // ============================================
  
  // Estados de usuario
  `INSERT INTO user_status (User_status_name, User_status_description) VALUES 
    ('Activo', 'Usuario activo en el sistema'),
    ('Inactivo', 'Usuario inactivo temporalmente'),
    ('Suspendido', 'Usuario suspendido por motivos administrativos');`,

  // Roles
  `INSERT INTO role (Role_name, Role_description) VALUES 
    ('Administrador', 'Control total del sistema'),
    ('Coordinador', 'Coordinador académico'),
    ('Profesor', 'Docente del colegio'),
    ('Estudiante', 'Estudiante activo'),
    ('Padre', 'Padre o acudiente');`,

  // Usuarios
  `INSERT INTO users (Users_usuario, Users_password, User_status_fk, Role_fk) VALUES 
    ('admin', '$2b$10$O3X7.aXiTql6rVRPPI0tweAqWwPTXtj9cD3/TYv5mn7jsX4f3S5E.', 1, 1),
    ('coordinador01', '$2b$10$YmSwsh5V/VPSxCjkCuo3leGS9NHAggenFFrz62G26deimW1e7CBHK', 1, 2),
    ('profesor01', '$2b$10$YmSwsh5V/VPSxCjkCuo3leGS9NHAggenFFrz62G26deimW1e7CBHK', 1, 3),
    ('profesor02', '$2b$10$YmSwsh5V/VPSxCjkCuo3leGS9NHAggenFFrz62G26deimW1e7CBHK', 1, 3),
    ('estudiante01', '$2b$10$YmSwsh5V/VPSxCjkCuo3leGS9NHAggenFFrz62G26deimW1e7CBHK', 1, 4);`,

  // Administradores
  `INSERT INTO admin (admin_name, admin_last_name, admin_email, admin_password, Users_fk) VALUES
    ('Juan', 'Pérez', 'admin@sist-control.com', '$2b$10$O3X7.aXiTql6rVRPPI0tweAqWwPTXtj9cD3/TYv5mn7jsX4f3S5E.', 1),
    ('María', 'García', 'maria.garcia@sist-control.com', '$2b$10$QlbjWXN/4l6osZ2EeEBDg.l0XSwiPgLdUQuJsjnxECUM7n6peltY.', 2);`,

  // Profesores
  `INSERT INTO teacher (teacher_name, teacher_last_name, teacher_identificacion, teacher_course_assigned, teacher_email, Users_fk) VALUES
    ('Laura', 'Martínez', 1020304050, 'Matemáticas', 'laura.martinez@sist-control.com', 3),
    ('José', 'Padilla', 1030405060, 'Sociales', 'jose.padilla@sist-control.com', 4);`,

  // Cursos
  `INSERT INTO course (course_course_name, course_description, course_assigned_student, course_capacity, course_current_students, teacher_fk) VALUES
    ('Matemáticas 10-A', 'Curso de álgebra y geometría para grado 10', 'Estudiantes grado 10-A', 35, 0, 1),
    ('Sociales 10-A', 'Historia y geografía para grado 10', 'Estudiantes grado 10-A', 35, 0, 2),
    ('Matemáticas 11-B', 'Cálculo y trigonometría para grado 11', 'Estudiantes grado 11-B', 30, 0, 1),
    ('Inglés Básico', 'Curso introductorio de inglés', 'Todos los grados', 40, 0, 2);`,

  // Estudiantes
  `INSERT INTO student_management (student_name, student_last_name, student_identificacion, student_email, student_date, student_photo, student_qr_code) VALUES
    ('Carlos', 'Ramírez', '1098765432', 'carlos.ramirez@estudiante.com', '2008-03-15', 'carlos_ramirez.jpg', 'QR-STU-001'),
    ('Ana', 'López', '1098765433', 'ana.lopez@estudiante.com', '2008-07-22', 'ana_lopez.jpg', 'QR-STU-002'),
    ('Pedro', 'González', '1098765434', 'pedro.gonzalez@estudiante.com', '2007-11-10', 'pedro_gonzalez.jpg', 'QR-STU-003'),
    ('Laura', 'Gómez', '1098765435', 'laura.gomez@estudiante.com', '2008-05-18', 'laura_gomez.jpg', 'QR-STU-004'),
    ('Sergio', 'Cardona', '1098765436', 'sergio.cardona@estudiante.com', '2007-09-25', 'sergio_cardona.jpg', 'QR-STU-005');`,

  // Padres/Acudientes
  `INSERT INTO father_management (father_name, father_last_name, father_email, father_number, father_relationship, student_fk) VALUES
    ('Roberto', 'Ramírez', 'roberto.ramirez@gmail.com', '3001234567', 'Padre', 1),
    ('Carmen', 'López', 'carmen.lopez@gmail.com', '3007654321', 'Madre', 2),
    ('Miguel', 'González', 'miguel.gonzalez@gmail.com', '3009876543', 'Padre', 3),
    ('Patricia', 'Gómez', 'patricia.gomez@gmail.com', '3002345678', 'Madre', 4),
    ('Manuel', 'Cardona', 'manuel.cardona@gmail.com', '3008765432', 'Acudiente', 5);`,

  // Matrículas (course_student)
  `INSERT INTO course_student (course_fk, student_fk, enrollment_date, enrollment_status) VALUES
    (1, 1, '2025-01-15', 'Activo'),
    (2, 1, '2025-01-15', 'Activo'),
    (1, 2, '2025-01-15', 'Activo'),
    (2, 2, '2025-01-15', 'Activo'),
    (3, 3, '2025-01-15', 'Activo'),
    (4, 4, '2025-01-15', 'Activo'),
    (1, 5, '2025-01-15', 'Activo');`,

  // Actualizar contador de estudiantes en cursos
  `UPDATE course c 
   SET course_current_students = (
     SELECT COUNT(*) 
     FROM course_student cs 
     WHERE cs.course_fk = c.course_id AND cs.enrollment_status = 'Activo'
   );`,

  // Asistencias de prueba
  `INSERT INTO student_attendance (student_fk, attendance_time, attendance_date, attendance_type) VALUES
    (1, '07:30:00', '2025-09-29', 'Entrada'),
    (2, '07:35:00', '2025-09-29', 'Entrada'),
    (3, '07:28:00', '2025-09-29', 'Entrada'),
    (4, '07:40:00', '2025-09-29', 'Entrada'),
    (5, '07:32:00', '2025-09-29', 'Entrada'),
    (1, '14:00:00', '2025-09-29', 'Salida'),
    (2, '14:05:00', '2025-09-29', 'Salida');`,

  // ============================================
  // PASO 4: CREAR PROCEDIMIENTOS ALMACENADOS
  // ============================================

  // Procedimiento: Crear estudiante completo
  `DELIMITER $$
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
    
    -- Insertar estudiante
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
  END$$
  DELIMITER ;`,

  // Procedimiento: Crear profesor
  `DELIMITER $$
  CREATE PROCEDURE sp_create_teacher(
    IN p_name VARCHAR(50),
    IN p_last_name VARCHAR(50),
    IN p_identificacion INT,
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
    
    -- Crear usuario
    INSERT INTO users (Users_usuario, Users_password, User_status_fk, Role_fk)
    VALUES (p_username, p_password, 1, 3);
    
    SET v_user_id = LAST_INSERT_ID();
    
    -- Crear profesor
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
  END$$
  DELIMITER ;`,

  // Procedimiento: Crear administrador
  `DELIMITER $$
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
    
    -- Crear usuario
    INSERT INTO users (Users_usuario, Users_password, User_status_fk, Role_fk)
    VALUES (p_username, p_password, 1, 1);
    
    SET v_user_id = LAST_INSERT_ID();
    
    -- Crear administrador
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
  END$$
  DELIMITER ;`,

  // Procedimiento: Matricular estudiante
  `DELIMITER $$
  CREATE PROCEDURE sp_enroll_student(
    IN p_course_id INT,
    IN p_student_id INT
  )
  BEGIN
    DECLARE v_capacity INT;
    DECLARE v_current_students INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
      ROLLBACK;
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error al matricular estudiante';
    END;
    
    START TRANSACTION;
    
    -- Verificar capacidad del curso
    SELECT course_capacity, course_current_students 
    INTO v_capacity, v_current_students
    FROM course 
    WHERE course_id = p_course_id;
    
    IF v_current_students >= v_capacity THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El curso ha alcanzado su capacidad máxima';
    END IF;
    
    -- Insertar matrícula
    INSERT INTO course_student (course_fk, student_fk, enrollment_date, enrollment_status)
    VALUES (p_course_id, p_student_id, CURRENT_DATE, 'Activo');
    
    -- Actualizar contador de estudiantes
    UPDATE course 
    SET course_current_students = course_current_students + 1
    WHERE course_id = p_course_id;
    
    COMMIT;
    SELECT 'Estudiante matriculado exitosamente' as message;
  END$$
  DELIMITER ;`,

  // Procedimiento: Registrar asistencia
  `DELIMITER $$
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
    
    -- Actualizar hora de llegada/salida en student_management
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
  END$$
  DELIMITER ;`,

  // Procedimiento: Crear padre/acudiente
  `DELIMITER $$
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
  END$$
  DELIMITER ;`,

  // Procedimiento: Obtener cursos de un estudiante
  `DELIMITER $$
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
  END$$
  DELIMITER ;`,

  // Procedimiento: Obtener estudiantes de un curso
  `DELIMITER $$
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
  END$$
  DELIMITER ;`,

  // Procedimiento: Obtener asistencias de un estudiante
  `DELIMITER $$
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
  END$$
  DELIMITER ;`,
];

export async function runMigration() {
  let connection;
  try {
    console.log("🚀 Iniciando migración de base de datos...\n");
    
    connection = await mysql.createConnection(dbConfig);
    console.log("✅ Conectado a MySQL database\n");

    let step = 1;
    for (const sql of sqlStatements) {
      try {
        // Mostrar progreso
        if (sql.includes("DROP PROCEDURE")) {
          console.log(`📦 Paso ${step++}: Eliminando procedimientos almacenados...`);
        } else if (sql.includes("DROP TABLE")) {
          console.log(`🗑️  Paso ${step++}: Eliminando tablas existentes...`);
        } else if (sql.includes("CREATE TABLE")) {
          const tableName = sql.match(/CREATE TABLE `?(\w+)`?/)?.[1];
          console.log(`📋 Paso ${step++}: Creando tabla '${tableName}'...`);
        } else if (sql.includes("INSERT INTO")) {
          const tableName = sql.match(/INSERT INTO `?(\w+)`?/)?.[1];
          console.log(`💾 Paso ${step++}: Insertando datos en '${tableName}'...`);
        } else if (sql.includes("CREATE PROCEDURE")) {
          const procName = sql.match(/CREATE PROCEDURE `?(\w+)`?/)?.[1];
          console.log(`⚙️  Paso ${step++}: Creando procedimiento '${procName}'...`);
        }

        await connection.query(sql);
      } catch (error) {
        console.error(`❌ Error en SQL: ${error.message}`);
        console.error(`   Query: ${sql.substring(0, 100)}...`);
        throw error;
      }
    }

    console.log("\n✨ ¡Migración completada exitosamente!");
    console.log("\n📊 Resumen:");
    console.log("   - 10 tablas creadas");
    console.log("   - 9 procedimientos almacenados creados");
    console.log("   - Datos de prueba insertados");
    console.log("\n🔐 Credenciales de prueba:");
    console.log("   Usuario: admin");
    console.log("   Password: 1234 (hash: $2b$10$O3X7...)");
    console.log("\n🎓 Datos de prueba:");
        console.log("   - 5 estudiantes");
      } catch (error) {
        console.error("\n❌ Migración fallida:", error);
        if (connection) await connection.end();
        process.exit(1);
      } finally {
        if (connection) await connection.end();
      }
    }