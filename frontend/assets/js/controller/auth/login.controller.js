document.addEventListener('DOMContentLoaded', async () => {
  document.body.style.display = 'none';
  document.body.style.opacity = 0;

  await checkAuth();
  fadeInElement(document.body, 1000);
  console.log('login controller has been loaded');
});

const objForm = new Form('loginForm', 'edit-input');
const appStorage = new AppStorage();
const myForm = objForm.getForm();

myForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!objForm.validateForm()) {
    console.log("Formulario no válido");
    return;
  }

  toggleLoading(true);
  const formData = objForm.getDataForm();

  try {
    const response = await getDataServices(formData, METHODS[1], URL_ADMIN_LOGIN);
    const data = await response.json();

    if (!response.ok) {
      showError(data.error || "Ocurrió un error al iniciar sesión");
      return;
    }

    // Almacenar token y redirigir
    appStorage.setItem(KEY_TOKEN, data.token);
    console.log("Login Success");
    window.location.href = "../../../index.html#dashboard";

  } catch (error) {
    console.error("Error de red:", error);
    showError("No se pudo conectar con el servidor");
  } finally {
    toggleLoading(false);
  }
});

function showError(message) {
  const container = document.querySelector(".card-body");
  let existingAlert = container.querySelector(".alert");

  if (existingAlert) existingAlert.remove();

  const alert = document.createElement("div");
  alert.className = "alert alert-danger mt-2";
  alert.innerText = translateError(message);
  container.prepend(alert);

  setTimeout(() => {
    if (alert.parentNode) alert.remove();
  }, 5000);
}

function translateError(msg) {
  if (msg === "User not found") return "El usuario no existe";
  if (msg === "Invalid password") return "Contraseña incorrecta";
  if (msg === "Required fields are missing") return "Todos los campos son obligatorios";
  return msg;
}
