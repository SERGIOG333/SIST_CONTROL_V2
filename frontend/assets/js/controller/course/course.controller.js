// frontend/assets/js/controller/course/course.controller.js

document.addEventListener("DOMContentLoaded", async () => {
  await loadCourses();

  const form = document.getElementById("courseForm");
  form.addEventListener("submit", handleFormSubmit);
});

let currentId = null;

async function loadCourses() {
  toggleLoading(true);
  try {
    const response = await getDataServices("", METHODS[0], URL_COURSE);
    const result = await response.json();
    const data = result.data;

    const tbody = document.getElementById("courseTableBody");
    tbody.innerHTML = "";

    data.forEach(course => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${course.course_id}</td>
        <td>${course.course_course_name}</td>
        <td>${course.course_description}</td>
        
        <td>${course.course_assigned_student}</td>
        <td>${course.teacher_fk}</td>
        <td>
          <button class="btn btn-sm btn-warning me-1" onclick='editCourse(${JSON.stringify(course)})'>
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="deleteCourse(${course.course_id})">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      `;
      tbody.appendChild(row);
    });

  } catch (err) {
    console.error("Error cargando cursos:", err);
  } finally {
    toggleLoading(false);
  }
}

async function loadTeacherOptions() {
  try {
    const response = await getDataServices("", METHODS[0], URL_TEACHER);
    const result = await response.json();
    const teachers = result.data;

    const select = document.getElementById("teacher_fk");
    select.innerHTML = `<option value="">Seleccione un docente</option>`;
    teachers.forEach(t => {
      const option = document.createElement("option");
      option.value = t.teacher_id;
      option.textContent = `${t.teacher_id} - ${t.teacher_name}`;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Error cargando docentes:", err);
  }
}

async function addCourse() {
  currentId = null;
  document.getElementById("courseForm").reset();
  await loadTeacherOptions();
  const modal = new bootstrap.Modal(document.getElementById("courseModal"));
  modal.show();
}

async function editCourse(course) {
  currentId = course.course_id;
  document.getElementById("course_course_name").value = course.course_course_name;
  document.getElementById("course_description").value = course.course_description;
  
  document.getElementById("course_assigned_student").value = course.course_assigned_student;

  await loadTeacherOptions();
  document.getElementById("teacher_fk").value = course.teacher_fk;

  const modal = new bootstrap.Modal(document.getElementById("courseModal"));
  modal.show();
}

async function deleteCourse(id) {
  if (!confirm("¿Deseas eliminar este curso?")) return;

  toggleLoading(true);
  try {
    const response = await getDataServices("", METHODS[3], URL_COURSE + id);
    if (response.ok) {
      await loadCourses();
    } else {
      alert("Error al eliminar curso");
    }
  } catch (err) {
    console.error("Error al eliminar:", err);
  } finally {
    toggleLoading(false);
  }
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const course = {
    course_course_name: document.getElementById("course_course_name").value,
    course_description: document.getElementById("course_description").value,
    
    course_assigned_student: document.getElementById("course_assigned_student").value,
    teacher_fk: parseInt(document.getElementById("teacher_fk").value)
  };

  const method = currentId ? METHODS[2] : METHODS[1];
  const url = currentId ? URL_COURSE + currentId : URL_COURSE;

  toggleLoading(true);
  try {
    const response = await getDataServices(course, method, url);
    if (response.ok) {
      const modal = bootstrap.Modal.getInstance(document.getElementById("courseModal"));
      modal.hide();
      await loadCourses();
    } else {
      alert("Error al guardar el curso");
    }
  } catch (err) {
    console.error("Error al guardar:", err);
  } finally {
    toggleLoading(false);
  }
}

window.addCourse = addCourse;
