// frontend/assets/js/controller/user/user.controller.js

document.addEventListener("DOMContentLoaded", async () => {
  await loadUsers();

  const form = document.getElementById("userForm");
  form.addEventListener("submit", handleFormSubmit);
});

let currentId = null;

async function loadUsers() {
  toggleLoading(true);
  try {
    const response = await getDataServices("", METHODS[0], URL_USERS);
    const result = await response.json();
    const data = result.data;

    const tbody = document.getElementById("userTableBody");
    if (!tbody) throw new Error("No se encontró la tabla");

    tbody.innerHTML = "";

    data.forEach((user) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.Users_id}</td>
        <td>${user.Users_usuario}</td>
        <td>${user.User_status_fk}</td>
        <td>${user.Role_fk}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick='editUser(${JSON.stringify(user)})'>Editar</button>
          <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.Users_id})">Eliminar</button>
        </td>
      `;
      tbody.appendChild(row);
    });

  } catch (err) {
    console.error("Error cargando usuarios:", err);
  } finally {
    toggleLoading(false);
  }
}

function addUser() {
  currentId = null;
  document.getElementById("userForm").reset();
  const modal = new bootstrap.Modal(document.getElementById("userModal"));
  modal.show();
}

function editUser(user) {
  currentId = user.Users_id;
  document.getElementById("Users_usuario").value = user.Users_usuario;
  document.getElementById("Users_password").value = ""; // no se muestra la contraseña
  document.getElementById("User_status_fk").value = user.User_status_fk;
  document.getElementById("Role_fk").value = user.Role_fk;

  const modal = new bootstrap.Modal(document.getElementById("userModal"));
  modal.show();
}

async function deleteUser(id) {
  if (!confirm("¿Estás seguro de eliminar este usuario?")) return;

  toggleLoading(true);
  try {
    const response = await getDataServices("", METHODS[3], URL_USERS + id);
    if (response.ok) {
      await loadUsers();
    } else {
      alert("Error al eliminar el usuario");
    }
  } catch (err) {
    console.error("Error al eliminar:", err);
  } finally {
    toggleLoading(false);
  }
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const user = {
    Users_usuario: document.getElementById("Users_usuario").value,
    Users_password: document.getElementById("Users_password").value,
    User_status_fk: parseInt(document.getElementById("User_status_fk").value),
    Role_fk: parseInt(document.getElementById("Role_fk").value)
  };

  const method = currentId ? METHODS[2] : METHODS[1];
  const url = currentId ? URL_USERS + currentId : URL_USERS;

  toggleLoading(true);
  try {
    const response = await getDataServices(user, method, url);
    if (response.ok) {
      const modal = bootstrap.Modal.getInstance(document.getElementById("userModal"));
      modal.hide();
      await loadUsers();
    } else {
      alert("Error al guardar el usuario");
    }
  } catch (err) {
    console.error("Error al enviar el formulario:", err);
  } finally {
    toggleLoading(false);
  }
}

window.addUser = addUser;
