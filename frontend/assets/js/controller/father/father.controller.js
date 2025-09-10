// frontend/assets/js/controller/father/father.controller.js

document.addEventListener("DOMContentLoaded", async () => {
  await loadFathers();

  const form = document.getElementById("fatherForm");
  form.addEventListener("submit", handleFormSubmit);
});

let currentId = null;

async function loadFathers() {
  toggleLoading(true);
  try {
    const response = await getDataServices("", METHODS[0], URL_FATHER);
    const result = await response.json();
    const data = result.data;

    const tbody = document.getElementById("fatherTableBody");
    tbody.innerHTML = "";

    data.forEach(father => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${father.father_id}</td>
        <td>${father.father_name}</td>
        <td>${father.father_last_name}</td>
        <td>${father.father_email}</td>
        <td>${father.father_number}</td>
        <td>${father.student_fk}</td>
        <td>
          <button class="btn btn-sm btn-warning me-1" onclick='editFather(${JSON.stringify(father)})'>
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="deleteFather(${father.father_id})">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      `;
      tbody.appendChild(row);
    });

  } catch (err) {
    console.error("Error cargando padres:", err);
  } finally {
    toggleLoading(false);
  }
}

async function loadStudentOptions() {
  try {
    const response = await getDataServices("", METHODS[0], URL_STUDENT);
    const result = await response.json();
    const students = result.data;

    const select = document.getElementById("student_fk");
    select.innerHTML = `<option value="">Seleccione un estudiante</option>`;
    students.forEach(st => {
      const option = document.createElement("option");
      option.value = st.student_id;
      option.textContent = `${st.student_id} - ${st.student_name} ${st.student_last_name}`;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Error cargando estudiantes:", err);
  }
}

async function addFather() {
  currentId = null;
  document.getElementById("fatherForm").reset();
  await loadStudentOptions();
  const modal = new bootstrap.Modal(document.getElementById("fatherModal"));
  modal.show();
}

async function editFather(father) {
  currentId = father.father_id;
  document.getElementById("father_name").value = father.father_name;
  document.getElementById("father_last_name").value = father.father_last_name;
  document.getElementById("father_email").value = father.father_email;
  document.getElementById("father_number").value = father.father_number;

  await loadStudentOptions();
  document.getElementById("student_fk").value = father.student_fk;

  const modal = new bootstrap.Modal(document.getElementById("fatherModal"));
  modal.show();
}

async function deleteFather(id) {
  if (!confirm("¿Deseas eliminar este padre?")) return;

  toggleLoading(true);
  try {
    const response = await getDataServices("", METHODS[3], URL_FATHER + id);
    if (response.ok) {
      await loadFathers();
    } else {
      alert("Error al eliminar padre");
    }
  } catch (err) {
    console.error("Error al eliminar:", err);
  } finally {
    toggleLoading(false);
  }
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const father = {
    father_name: document.getElementById("father_name").value,
    father_last_name: document.getElementById("father_last_name").value,
    father_email: document.getElementById("father_email").value,
    father_number: document.getElementById("father_number").value,
    student_fk: parseInt(document.getElementById("student_fk").value)
  };

  const method = currentId ? METHODS[2] : METHODS[1];
  const url = currentId ? URL_FATHER + currentId : URL_FATHER;

  toggleLoading(true);
  try {
    const response = await getDataServices(father, method, url);
    if (response.ok) {
      const modal = bootstrap.Modal.getInstance(document.getElementById("fatherModal"));
      modal.hide();
      await loadFathers();
    } else {
      alert("Error al guardar el padre");
    }
  } catch (err) {
    console.error("Error al guardar:", err);
  } finally {
    toggleLoading(false);
  }
}

window.addFather = addFather;
