document.addEventListener("DOMContentLoaded", async () => {
  await loadUserStatuses();

  const form = document.getElementById("userStatusForm");
  form.addEventListener("submit", handleFormSubmit);
});

let currentId = null;

async function loadUserStatuses() {
  toggleLoading(true);
  try {
    const response = await getDataServices("", METHODS[0], URL_USER_STATUS);
    const result = await response.json();
    const data = result.data;

    const tbody = document.getElementById("userStatusTableBody");
    tbody.innerHTML = "";

    data.forEach((status) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${status.User_status_id}</td>
        <td>${status.User_status_name}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick='editUserStatus(${JSON.stringify(status)})'>Editar</button>
          <button class="btn btn-danger btn-sm" onclick="deleteUserStatus(${status.User_status_id})">Eliminar</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error("Error cargando estados de usuario:", err);
  } finally {
    toggleLoading(false);
  }
}

function addUserStatus() {
  currentId = null;
  document.getElementById("userStatusForm").reset();
  const modal = new bootstrap.Modal(document.getElementById("userStatusModal"));
  modal.show();
}

function editUserStatus(status) {
  currentId = status.User_status_id;
  document.getElementById("User_status_name").value = status.User_status_name;
  const modal = new bootstrap.Modal(document.getElementById("userStatusModal"));
  modal.show();
}

async function deleteUserStatus(id) {
  if (!confirm("¿Estás seguro de eliminar este estado de usuario?")) return;

  toggleLoading(true);
  try {
    const response = await getDataServices("", METHODS[3], URL_USER_STATUS + id);
    if (response.ok) {
      await loadUserStatuses();
    } else {
      alert("Error al eliminar el estado");
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
    User_status_name: document.getElementById("User_status_name").value
  };

  const method = currentId ? METHODS[2] : METHODS[1];
  const url = currentId ? URL_USER_STATUS + currentId : URL_USER_STATUS;

  toggleLoading(true);
  try {
    const response = await getDataServices(data, method, url);
    if (response.ok) {
      const modal = bootstrap.Modal.getInstance(document.getElementById("userStatusModal"));
      modal.hide();
      await loadUserStatuses();
    } else {
      alert("Error al guardar el estado");
    }
  } catch (err) {
    console.error("Error al enviar el formulario:", err);
  } finally {
    toggleLoading(false);
  }
}

window.addUserStatus = addUserStatus;
