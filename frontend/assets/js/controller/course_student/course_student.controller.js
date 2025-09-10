// frontend/assets/js/controller/course_student/course_student.controller.js

document.addEventListener("DOMContentLoaded", async () => {
  await loadCourseStudent();

  const form = document.getElementById("courseStudentForm");
  form.addEventListener("submit", handleFormSubmit);
});

let currentId = null;

async function loadCourseStudent() {
  toggleLoading(true);
  try {
    const response = await getDataServices("", METHODS[0], URL_COURSE_STUDENT);
    const result = await response.json();
    const data = result.data;

    const tbody = document.getElementById("courseStudentTableBody");
    tbody.innerHTML = "";

    data.forEach(item => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.course_student_id}</td>
        <td>${item.course_fk}</td>
        <td>${item.student_fk}</td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="deleteCourseStudent(${item.course_student_id})">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      `;
      tbody.appendChild(row);
    });

  } catch (err) {
    console.error("Error cargando asignaciones:", err);
  } finally {
    toggleLoading(false);
  }
}

async function loadCourseAndStudentOptions() {
  // Cargar cursos
  try {
    const resCourse = await getDataServices("", METHODS[0], URL_COURSE);
    const resStudent = await getDataServices("", METHODS[0], URL_STUDENT);

    const courses = (await resCourse.json()).data;
    const students = (await resStudent.json()).data;

    const courseSelect = document.getElementById("course_fk");
    const studentSelect = document.getElementById("student_fk");

    courseSelect.innerHTML = `<option value="">Seleccione un curso</option>`;
    courses.forEach(course => {
      const option = document.createElement("option");
      option.value = course.course_id;
      option.textContent = `${course.course_id} - ${course.course_course_name}`;
      courseSelect.appendChild(option);
    });

    studentSelect.innerHTML = `<option value="">Seleccione un estudiante</option>`;
    students.forEach(student => {
      const option = document.createElement("option");
      option.value = student.student_id;
      option.textContent = `${student.student_id} - ${student.student_name} ${student.student_last_name}`;
      studentSelect.appendChild(option);
    });

  } catch (err) {
    console.error("Error cargando opciones:", err);
  }
}

async function addCourseStudent() {
  currentId = null;
  document.getElementById("courseStudentForm").reset();
  await loadCourseAndStudentOptions();

  const modal = new bootstrap.Modal(document.getElementById("courseStudentModal"));
  modal.show();
}

async function deleteCourseStudent(id) {
  if (!confirm("¿Deseas eliminar esta asignación?")) return;

  toggleLoading(true);
  try {
    const response = await getDataServices("", METHODS[3], URL_COURSE_STUDENT + id);
    if (response.ok) {
      await loadCourseStudent();
    } else {
      alert("Error al eliminar");
    }
  } catch (err) {
    console.error("Error al eliminar:", err);
  } finally {
    toggleLoading(false);
  }
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const data = {
    course_fk: parseInt(document.getElementById("course_fk").value),
    student_fk: parseInt(document.getElementById("student_fk").value)
  };

  const method = METHODS[1];
  const url = URL_COURSE_STUDENT;

  toggleLoading(true);
  try {
    const response = await getDataServices(data, method, url);
    if (response.ok) {
      const modal = bootstrap.Modal.getInstance(document.getElementById("courseStudentModal"));
      modal.hide();
      await loadCourseStudent();
    } else {
      alert("Error al guardar asignación");
    }
  } catch (err) {
    console.error("Error al guardar:", err);
  } finally {
    toggleLoading(false);
  }
}

window.addCourseStudent = addCourseStudent;
