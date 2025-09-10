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
  // ---- Borrar tablas en orden inverso ----
  `SET FOREIGN_KEY_CHECKS=0;`,
  `DROP TABLE IF EXISTS course_student;`,
  `DROP TABLE IF EXISTS student_attendance;`,
  `DROP TABLE IF EXISTS father_management;`,
  `DROP TABLE IF EXISTS admin;`,
  `DROP TABLE IF EXISTS course;`,
  `DROP TABLE IF EXISTS teacher;`,
  `DROP TABLE IF EXISTS users;`,
  `DROP TABLE IF EXISTS role;`,
  `DROP TABLE IF EXISTS student_management;`,
  `DROP TABLE IF EXISTS user_status;`,
  `SET FOREIGN_KEY_CHECKS=1;`,

  // ---- Crear tablas base ----
  `CREATE TABLE user_status (
    User_status_id INT AUTO_INCREMENT PRIMARY KEY,
    User_status_name VARCHAR(20) UNIQUE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;`,

  `CREATE TABLE role (
    Role_id INT AUTO_INCREMENT PRIMARY KEY,
    Role_name VARCHAR(20) UNIQUE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;`,

  `CREATE TABLE users (
    Users_id INT AUTO_INCREMENT PRIMARY KEY,
    Users_usuario VARCHAR(30) UNIQUE,
    Users_password VARCHAR(256) NOT NULL,
    User_status_fk INT NOT NULL,
    Role_fk INT NOT NULL,
    FOREIGN KEY (User_status_fk) REFERENCES user_status(User_status_id),
    FOREIGN KEY (Role_fk) REFERENCES role(Role_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;`,

  `CREATE TABLE teacher (
    teacher_id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_name VARCHAR(50) NOT NULL,
    teacher_last_name VARCHAR(50) NOT NULL,
    teacher_identificacion INT(50) NOT NULL,
    teacher_course_assigned VARCHAR(50) NOT NULL,
    teacher_email VARCHAR(100) NOT NULL,
    Users_fk INT NOT NULL,
    FOREIGN KEY (Users_fk) REFERENCES users(Users_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;`,

  `CREATE TABLE student_management (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(50) NOT NULL,
    student_last_name VARCHAR(50) NOT NULL,
    student_identificacion VARCHAR(50) NOT NULL,
    student_arrival_time TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    student_departure_time TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    student_email VARCHAR(100) NOT NULL,
    student_date DATE NOT NULL,
    student_photo VARCHAR(50)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;`,

  `CREATE TABLE admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    admin_name VARCHAR(50) NOT NULL,
    admin_last_name VARCHAR(50) NOT NULL,
    admin_email VARCHAR(50) NOT NULL,
    admin_password VARCHAR(100) NOT NULL,
    Users_fk INT NOT NULL,
    FOREIGN KEY (Users_fk) REFERENCES users(Users_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;`,

  `CREATE TABLE course (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    course_course_name VARCHAR(100) NOT NULL,
    course_description VARCHAR(100) NOT NULL,
    course_assigned_teacher VARCHAR(100) NOT NULL,
    course_assigned_student VARCHAR(100) NOT NULL,
    teacher_fk INT NOT NULL,
    FOREIGN KEY (teacher_fk) REFERENCES teacher(teacher_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;`,

  `CREATE TABLE father_management (
    father_id INT AUTO_INCREMENT PRIMARY KEY,
    father_name VARCHAR(50) NOT NULL,
    father_last_name VARCHAR(50) NOT NULL,
    father_email VARCHAR(50) NOT NULL,
    father_number INT(10) NOT NULL,
    student_fk INT NOT NULL,
    FOREIGN KEY (student_fk) REFERENCES student_management(student_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;`,

  `CREATE TABLE course_student (
    course_student_id INT AUTO_INCREMENT PRIMARY KEY,
    course_fk INT NOT NULL,
    student_fk INT NOT NULL,
    FOREIGN KEY (course_fk) REFERENCES course(course_id),
    FOREIGN KEY (student_fk) REFERENCES student_management(student_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;`,

  `CREATE TABLE student_attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    student_fk INT NOT NULL,
    attendance_time TIME NOT NULL,
    attendance_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_fk) REFERENCES student_management(student_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;`,

  // ---- Datos iniciales ----
  `INSERT INTO user_status (User_status_name) VALUES ('Activo'), ('Inactivo');`,

  `INSERT INTO role (Role_name) VALUES ('Coordinador'), ('dsscsd'), ('prueva 2');`,

  `INSERT INTO users (Users_usuario, Users_password, User_status_fk, Role_fk) VALUES 
    ('admin', '1234', 2, 2),
    ('profesor', '$2b$10$YmSwsh5V/VPSxCjkCuo3leGS9NHAggenFFrz62G26deimW1e7CBHK', 2, 2);`,

  `INSERT INTO teacher (teacher_name, teacher_last_name, teacher_identificacion, teacher_course_assigned, teacher_email, Users_fk) VALUES
    ('Laura', 'Martínez', 1020304050, 'Matemáticas', 'laura.martinez@example.com', 2);`,

  `INSERT INTO course (course_course_name, course_description, course_assigned_teacher, course_assigned_student, teacher_fk) VALUES
    ('sociales', 'sociales', 'jose', 'sdds', 2),
    ('Matemáticas', 'Curso de álgebra y geometría', 'Julián Gómez', 'Laura Gómez', 2);`,

  `INSERT INTO student_management (student_name, student_last_name, student_identificacion, student_email, student_date, student_photo) VALUES
    ('Laura', 'Gómez', '1098765432', 'laura.gomez@example.com', '2025-06-29', ''),
    ('sergio andres', 'cardona', '112222222', 'carbal@gmail.com', '2025-09-09', 'foto.jpg');`,

  `INSERT INTO admin (admin_name, admin_last_name, admin_email, admin_password, Users_fk) VALUES
    ('Juan', 'Pérez', 'juanperez@example.com', '$2b$10$O3X7.aXiTql6rVRPPI0tweAqWwPTXtj9cD3/TYv5mn7jsX4f3S5E.', 2),
    ('mario', 'garcia', 'garcia@example.com', '$2b$10$QlbjWXN/4l6osZ2EeEBDg.l0XSwiPgLdUQuJsjnxECUM7n6peltY.', 2),
    ('juan', 'marino', 'juan@example.com', '$2b$10$o0MWcGPxycu2nXaZ1gIOt.cb1eSh6naxlaHExJpmrFchtTkvXOxmC', 2);`,

  `INSERT INTO father_management (father_name, father_last_name, father_email, father_number, student_fk) VALUES
    ('Carlos', 'Ramírez', 'carlos.ramirez@example.com', 2147483647, 2);`,

  `INSERT INTO course_student (course_fk, student_fk) VALUES
    (2, 2),
    (3, 6);`,

  `INSERT INTO student_attendance (student_fk, attendance_time, attendance_date) VALUES
    (6, '08:00:00', '2025-07-04'),
    (2, '14:17:38', '2025-07-04');`
];

export async function runMigration() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log("Connected to MySQL database");

    for (const sql of sqlStatements) {
      try {
        await connection.query(sql);
        console.log("Executed:", sql.substring(0, 60) + "...");
      } catch (error) {
        console.error("Error executing SQL:", error.message);
        throw error;
      }
    }

    console.log("Database migration completed successfully!");
    return { success: true };
  } catch (error) {
    console.error("Migration failed:", error);
    return { success: false, error };
  } finally {
    if (connection) {
      await connection.end();
      console.log("Database connection closed");
    }
  }
}
