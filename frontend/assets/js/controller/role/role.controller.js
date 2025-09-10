// frontend/assets/js/controller/role/role.controller.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("roleForm");
  const tbody = document.getElementById("roleTableBody");

  // Validación de existencia
  if (!form || !tbody) {
    console.error("⚠ No se encontraron elementos requeridos en el DOM.");
    return;
  }

  form.addEventListener("submit", handleFormSubmit);
  loadRoles();
});

let currentId = null;

async function loadRoles() {
  toggleLoading(true);
  try {
    const response = await getDataServices("", METHODS[0], URL_ROLE);
    const result = await response.json();
    const data = result.data;

    const tbody = document.getElementById("roleTableBody");
    tbody.innerHTML = "";

    data.forEach((role) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${role.Role_id}</td>
        <td>${role.Role_name}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick='editRole(${JSON.stringify(role)})'>Editar</button>
          <button class="btn btn-sm btn-danger" onclick="deleteRole(${role.Role_id})">Eliminar</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error("Error cargando roles:", err);
  } finally {
    toggleLoading(false);
  }
}

function addRole() {
  currentId = null;
  const form = document.getElementById("roleForm");
  if (form) form.reset();
  const modal = new bootstrap.Modal(document.getElementById("roleModal"));
  modal.show();
}

function editRole(role) {
  currentId = role.Role_id;
  document.getElementById("Role_Name").value = role.Role_name;

  const modal = new bootstrap.Modal(document.getElementById("roleModal"));
  modal.show();
}

async function deleteRole(id) {
  if (!confirm("¿Estás seguro de eliminar este rol?")) return;

  toggleLoading(true);
  try {
    const response = await getDataServices("", METHODS[3], URL_ROLE + id);
    if (response.ok) {
      await loadRoles();
    } else {
      alert("Error al eliminar el rol");
    }
  } catch (err) {
    console.error("Error al eliminar:", err);
  } finally {
    toggleLoading(false);
  }
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const role = {
    Role_name: document.getElementById("Role_Name").value
  };

  const method = currentId ? METHODS[2] : METHODS[1];
  const url = currentId ? URL_ROLE + currentId : URL_ROLE;

  toggleLoading(true);
  try {
    const response = await getDataServices(role, method, url);
    if (response.ok) {
      const modal = bootstrap.Modal.getInstance(document.getElementById("roleModal"));
      modal.hide();
      await loadRoles();
    } else {
      alert("Error al guardar el rol");
    }
  } catch (err) {
    console.error("Error al enviar el formulario:", err);
  } finally {
    toggleLoading(false);
  }
}

window.addRole = addRole;
