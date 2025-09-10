/**
 * Envía una solicitud HTTP sin autenticación.
 * @param {Object} data - Datos a enviar (en JSON). Se ignora para GET y DELETE.
 * @param {string} method - Método HTTP: 'GET', 'POST', 'PUT', 'DELETE', etc.
 * @param {string} url - URL del endpoint.
 * @returns {Promise<Response>} - Promesa con la respuesta de fetch.
 */
async function getDataServices(data, method, url) {
  const parameters = {
    method,
    mode: 'cors',
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest"
    }
  };

  // Solo agrega el body si es POST o PUT y hay datos
  if (method !== 'GET' && method !== 'DELETE' && data) {
    parameters.body = JSON.stringify(data);
  }

  return await fetch(url, parameters);
}

/**
 * Envía una solicitud HTTP con autenticación Bearer (JWT).
 * @param {Object} data - Datos a enviar (en JSON). Se ignora para GET y DELETE.
 * @param {string} method - Método HTTP: 'GET', 'POST', 'PUT', 'DELETE', etc.
 * @param {string} url - URL del endpoint.
 * @param {string} token - Token JWT de autorización.
 * @returns {Promise<Response>} - Promesa con la respuesta de fetch.
 */
async function getServicesAuth(data, method, url, token) {
  const parameters = {
    method,
    mode: 'cors',
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest"
    }
  };

  // Solo agrega el body si es POST o PUT y hay datos
  if (method !== 'GET' && method !== 'DELETE' && data) {
    parameters.body = JSON.stringify(data);
  }

  return await fetch(url, parameters);
}
