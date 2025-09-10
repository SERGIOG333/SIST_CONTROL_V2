document.addEventListener("DOMContentLoaded", async () => {
  await loadAdmins();

  const form = document.getElementById("adminForm");
  form.addEventListener("submit", handleFormSubmit);
});

let currentId = null;

// Cargar todos los administradores y mostrarlos en tabla
async function loadAdmins() {
  toggleLoading(true);
  try {
    const response = await getDataServices("", METHODS[0], URL_ADMIN);
    const result = await response.json();
    const data = result.data;

    const tbody = document.getElementById("adminTableBody");
    tbody.innerHTML = "";

    data.forEach(admin => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${admin.admin_id}</td>
        <td>${admin.admin_name}</td>
        <td>${admin.admin_last_name}</td>
        <td>${admin.admin_email}</td>
        <td>${admin.Users_fk}</td>
        <td>
          <button class="btn btn-sm btn-warning me-1" onclick='editAdmin(${JSON.stringify(admin)})'>
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="deleteAdmin(${admin.admin_id})">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      `;
      tbody.appendChild(row);
    });

  } catch (err) {
    console.error("Error cargando administradores:", err);
  } finally {
    toggleLoading(false);
  }
}

// Cargar usuarios para el select
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

// Mostrar modal para agregar
async function addAdmin() {
  currentId = null;
  document.getElementById("adminForm").reset();
  await loadUserOptions();
  const modal = new bootstrap.Modal(document.getElementById("adminModal"));
  modal.show();
}

// Mostrar modal para editar
async function editAdmin(admin) {
  currentId = admin.admin_id;
  document.getElementById("admin_name").value = admin.admin_name;
  document.getElementById("admin_last_name").value = admin.admin_last_name;
  document.getElementById("admin_email").value = admin.admin_email;
  document.getElementById("admin_password").value = "";

  await loadUserOptions();
  document.getElementById("Users_fk").value = admin.Users_fk;

  const modal = new bootstrap.Modal(document.getElementById("adminModal"));
  modal.show();
}

// Eliminar
async function deleteAdmin(id) {
  if (!confirm("¿Estás seguro de eliminar este administrador?")) return;

  toggleLoading(true);
  try {
    const response = await getDataServices("", METHODS[3], URL_ADMIN + id);
    if (response.ok) {
      await loadAdmins();
    } else {
      alert("Error al eliminar el administrador");
    }
  } catch (err) {
    console.error("Error al eliminar:", err);
  } finally {
    toggleLoading(false);
  }
}

// Guardar/Actualizar
async function handleFormSubmit(e) {
  e.preventDefault();

  const admin = {
    admin_name: document.getElementById("admin_name").value,
    admin_last_name: document.getElementById("admin_last_name").value,
    admin_email: document.getElementById("admin_email").value,
    admin_password: document.getElementById("admin_password").value,
    Users_fk: parseInt(document.getElementById("Users_fk").value)
  };

  const method = currentId ? METHODS[2] : METHODS[1];
  const url = currentId ? URL_ADMIN + currentId : URL_ADMIN;

  toggleLoading(true);
  try {
    const response = await getDataServices(admin, method, url);
    if (response.ok) {
      const modal = bootstrap.Modal.getInstance(document.getElementById("adminModal"));
      modal.hide();
      await loadAdmins();
    } else {
      alert("Error al guardar el administrador");
    }
  } catch (err) {
    console.error("Error al guardar:", err);
  } finally {
    toggleLoading(false);
  }
}

window.addAdmin = addAdmin;
