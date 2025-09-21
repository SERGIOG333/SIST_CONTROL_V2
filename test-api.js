// Script de prueba para verificar que la API esté funcionando
const testAPI = async () => {
  const baseURL = 'http://localhost:3000';

  try {
    console.log('🧪 Probando conexión al servidor...');

    // Probar endpoint de login de admin
    const loginResponse = await fetch(`${baseURL}/api_v1/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        admin_email: 'test@example.com',
        admin_password: 'test123'
      })
    });

    console.log('📝 Respuesta del endpoint de login:');
    console.log('Status:', loginResponse.status);
    console.log('Headers:', Object.fromEntries(loginResponse.headers.entries()));

    const loginData = await loginResponse.text();
    console.log('Body:', loginData);

    // Probar endpoint de validación de token
    const tokenResponse = await fetch(`${baseURL}/api_v1/validate-token`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
      }
    });

    console.log('\n📝 Respuesta del endpoint de validación de token:');
    console.log('Status:', tokenResponse.status);
    const tokenData = await tokenResponse.text();
    console.log('Body:', tokenData);

  } catch (error) {
    console.error('❌ Error al probar la API:', error.message);
  }
};

// Ejecutar las pruebas
testAPI();
