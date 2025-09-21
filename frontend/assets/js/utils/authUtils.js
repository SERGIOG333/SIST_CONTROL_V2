// Funciones de utilidad para autenticación

/**
 * Verifica si el usuario está autenticado
 */
async function checkAuth() {
  const storage = new AppStorage();
  const token = storage.getItem(KEY_TOKEN);
  const currentURL = window.location.href;
  const isOnLogin = currentURL.includes("views/auth/index.html");

  if (!token) {
    if (!isOnLogin) {
      window.location.href = "/frontend/views/auth/index.html";
    }
    return false;
  }

  try {
    const endpointUrl = HOST + "/validate-token";
    const response = await getServicesAuth("", "POST", endpointUrl, token);
    const data = await response.json();

    if (data.valid) {
      // Si está en el login y el token es válido, redirige al dashboard
      if (isOnLogin) {
        window.location.href = "/index.html#dashboard";
      }
      return true;
    } else {
      storage.removeItem(KEY_TOKEN);
      window.location.href = "/frontend/views/auth/index.html";
      return false;
    }
  } catch (error) {
    console.error("Error al validar el token:", error);
    storage.removeItem(KEY_TOKEN);
    window.location.href = "/frontend/views/auth/index.html";
    return false;
  }
}

/**
 * Muestra u oculta el loading screen
 */
function toggleLoading(show) {
  const loadingScreen = document.getElementById('loading-screen');
  if (!loadingScreen) return;

  loadingScreen.style.display = show ? 'flex' : 'none';
}

/**
 * Animación de entrada para elementos
 */
function fadeInElement(element, duration = 1000) {
  element.style.display = 'block';
  let opacity = 0;
  const step = 50;
  const increment = step / duration;

  const interval = setInterval(() => {
    opacity += increment;
    element.style.opacity = opacity;
    if (opacity >= 1) clearInterval(interval);
  }, step);
}
