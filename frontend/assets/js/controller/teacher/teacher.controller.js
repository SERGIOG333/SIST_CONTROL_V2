// frontend/assets/js/controller/teacher/teacher.controller.js

document.addEventListener("DOMContentLoaded", async () => {
  await loadTeachers();

  const form = document.getElementById("teacherForm");
  form.addEventListener("submit", handleFormSubmit);
});

let currentId = null;

async function loadTeachers() {
  toggleLoading(true);
  try {
    const response = await getDataServices("", METHODS[0], URL_TEACHER);
    const result = await response.json();
    const data = result.data;

    const tbody = document.getElementById("teacherTableBody");
    tbody.innerHTML = "";

    data.forEach((teacher) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${teacher.teacher_id}</td>
        <td>${teacher.teacher_name}</td>
        <td>${teacher.teacher_last_name}</td>
        <td>${teacher.teacher_identificacion}</td>
        <td>${teacher.teacher_course_assigned}</td>
        <td>${teacher.teacher_email}</td>
        <td>${teacher.Users_fk}</td>
        <td>
          <button class="btn btn-sm btn-warning me-1" onclick='editTeacher(${JSON.stringify(teacher)})'>
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="deleteTeacher(${teacher.teacher_id})">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      `;
      tbody.appendChild(row);
    });

  } catch (err) {
    console.error("Error cargando docentes:", err);
  } finally {
    toggleLoading(false);
  }
}

async function loadUserOptions() {
  try {
    const response = await getDataServices("", METHODS[0], URL_USERS);
    const result = await response.json();
    const users = result.data;

    const select = document.getElementById("Users_fk");
    select.innerHTML = `<option value="">Seleccione un usuario</option>`;
    users.forEach(user => {
      const option = document.createElement("option");
      option.value = user.Users_id;
      option.textContent = `${user.Users_id} - ${user.Users_usuario}`;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Error cargando usuarios:", err);
  }
}

async function addTeacher() {
  currentId = null;
  document.getElementById("teacherForm").reset();
  await loadUserOptions();
  const modal = new bootstrap.Modal(document.getElementById("teacherModal"));
  modal.show();
}

async function editTeacher(teacher) {
  currentId = teacher.teacher_id;
  document.getElementById("teacher_name").value = teacher.teacher_name;
  document.getElementById("teacher_last_name").value = teacher.teacher_last_name;
  document.getElementById("teacher_identificacion").value = teacher.teacher_identificacion;
  document.getElementById("teacher_course_assigned").value = teacher.teacher_course_assigned;
  document.getElementById("teacher_email").value = teacher.teacher_email;

  await loadUserOptions();
  document.getElementById("Users_fk").value = teacher.Users_fk;

  const modal = new bootstrap.Modal(document.getElementById("teacherModal"));
  modal.show();
}

async function deleteTeacher(id) {
  if (!confirm("¿Estás seguro de eliminar este docente?")) return;

  toggleLoading(true);
  try {
    const response = await getDataServices("", METHODS[3], URL_TEACHER + id);
    if (response.ok) {
      await loadTeachers();
    } else {
      alert("Error al eliminar el docente");
    }
  } catch (err) {
    console.error("Error al eliminar:", err);
  } finally {
    toggleLoading(false);
  }
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const teacher = {
    teacher_name: document.getElementById("teacher_name").value,
    teacher_last_name: document.getElementById("teacher_last_name").value,
    teacher_identificacion: document.getElementById("teacher_identificacion").value,
    teacher_course_assigned: document.getElementById("teacher_course_assigned").value,
    teacher_email: document.getElementById("teacher_email").value,
    Users_fk: parseInt(document.getElementById("Users_fk").value)
  };

  const method = currentId ? METHODS[2] : METHODS[1];
  const url = currentId ? URL_TEACHER + currentId : URL_TEACHER;

  toggleLoading(true);
  try {
    const response = await getDataServices(teacher, method, url);
    if (response.ok) {
      const modal = bootstrap.Modal.getInstance(document.getElementById("teacherModal"));
      modal.hide();
      await loadTeachers();
    } else {
      alert("Error al guardar el docente");
    }
  } catch (err) {
    console.error("Error al guardar:", err);
  } finally {
    toggleLoading(false);
  }
}

window.addTeacher = addTeacher;
