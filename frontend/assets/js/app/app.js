async function checkAuth() {
  if (typeof toggleLoading === "function") toggleLoading(true);

  const storage = new AppStorage();
  const token = storage.getItem(KEY_TOKEN);
  const currentURL = window.location.href;
  const isOnLogin = currentURL.includes("views/auth/index.html");

  if (!token) {
    if (!isOnLogin) {
      window.location.href = "views/auth/index.html";
    }
    if (typeof toggleLoading === "function") toggleLoading(false);
    return false;
  }

  try {
    const endpointUrl = HOST + "/validate-token/";
    const response = await getServicesAuth("", "POST", endpointUrl, token);
    const data = await response.json();

    if (data.valid) {
      // Si está en el login y el token es válido, redirige al dashboard
      if (isOnLogin) {
        window.location.href = "../../index.html#dashboard";
      }
      return true;
    } else {
      storage.removeItem(KEY_TOKEN);
      window.location.href = "views/auth/index.html";
      return false;
    }
  } catch (error) {
    console.error("Error al validar el token:", error);
    storage.removeItem(KEY_TOKEN);
    window.location.href = "views/auth/index.html";
    return false;
  } finally {
    if (typeof toggleLoading === "function") toggleLoading(false);
  }
}

// Define el loader si existe el elemento #loading-screen
function toggleLoading(show) {
  const loadingScreen = document.getElementById('loading-screen');
  if (!loadingScreen) return;

  loadingScreen.style.display = show ? 'flex' : 'none';
}

// Animación de entrada
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
document.getElementById('logoutBtn')?.addEventListener('click', () => {
  const storage = new AppStorage();
  storage.removeItem(KEY_TOKEN);
  window.location.href = 'views/auth/index.html';
});
