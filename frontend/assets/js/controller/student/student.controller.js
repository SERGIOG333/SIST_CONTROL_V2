

document.addEventListener("DOMContentLoaded", async () => {
  await loadStudents();

  const form = document.getElementById("studentForm");
  form.addEventListener("submit", handleFormSubmit);
});

let currentStudentId = null;

async function loadStudents() {
  toggleLoading(true);
  try {
    const response = await getDataServices("", METHODS[0], URL_STUDENT);
    const result = await response.json();
    const data = result.data;

    const tbody = document.getElementById("studentTableBody");
    tbody.innerHTML = "";

    data.forEach((student, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${student.student_id}</td>
        <td>${student.student_name}</td>
        <td>${student.student_last_name}</td>
        <td>${student.student_identificacion}</td>
        <td>${student.student_arrival_time}</td>
        <td>${student.student_departure_time}</td>
        <td>${student.student_email}</td>
        <td>${student.student_date}</td>
        <img src="${student.student_photo}" onerror="this.src='../../assets/img/students/laura.jpg'" alt="Foto" width="40">

        <td>
          <button class="btn btn-sm btn-warning" onclick='editStudent(${JSON.stringify(student)})'>Editar</button>
          <button class="btn btn-sm btn-danger" onclick="deleteStudent(${student.student_id})">Eliminar</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error("Error cargando estudiantes:", err);
  } finally {
    toggleLoading(false);
  }
}

function addStudent() {
  currentStudentId = null;
  document.getElementById("studentForm").reset();
  const modal = new bootstrap.Modal(document.getElementById("studentModal"));
  modal.show();
}

function editStudent(student) {
  currentStudentId = student.student_id;
  document.getElementById("student_name").value = student.student_name;
  document.getElementById("student_last_name").value = student.student_last_name;
  document.getElementById("student_identificacion").value = student.student_identificacion;
  document.getElementById("student_arrival_time").value = student.student_arrival_time;
  document.getElementById("student_departure_time").value = student.student_departure_time;
  document.getElementById("student_email").value = student.student_email;
  document.getElementById("student_date").value = student.student_date;
  document.getElementById("student_photo").value = student.student_photo;

  const modal = new bootstrap.Modal(document.getElementById("studentModal"));
  modal.show();
}

async function deleteStudent(id) {
  if (!confirm("¿Estás seguro de eliminar este estudiante?")) return;

  toggleLoading(true);
  try {
    const response = await getDataServices("", METHODS[3], URL_STUDENT + id);
    if (response.ok) {
      await loadStudents();
    } else {
      alert("Error al eliminar el estudiante");
    }
  } catch (err) {
    console.error("Error al eliminar:", err);
  } finally {
    toggleLoading(false);
  }
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const student = {
    student_name: document.getElementById("student_name").value,
    student_last_name: document.getElementById("student_last_name").value,
    student_identificacion: document.getElementById("student_identificacion").value,
    student_arrival_time: document.getElementById("student_arrival_time").value,
    student_departure_time: document.getElementById("student_departure_time").value,
    student_email: document.getElementById("student_email").value,
    student_date: document.getElementById("student_date").value,
    student_photo: document.getElementById("student_photo").value,
  };

  const method = currentStudentId ? METHODS[2] : METHODS[1];
  const url = currentStudentId ? URL_STUDENT + currentStudentId : URL_STUDENT;

  toggleLoading(true);
  try {
    const response = await getDataServices(student, method, url);
    if (response.ok) {
      const modal = bootstrap.Modal.getInstance(document.getElementById("studentModal"));
      modal.hide();
      await loadStudents();
    } else {
      alert("Error al guardar el estudiante");
    }
  } catch (err) {
    console.error("Error al enviar el formulario:", err);
  } finally {
    toggleLoading(false);
  }
}

window.addStudent = addStudent;
