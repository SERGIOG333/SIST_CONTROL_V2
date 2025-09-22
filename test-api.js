/**
 * Script de prueba para verificar la funcionalidad de la API
 * Ejecuta: node test-api.js
 */

const HOST = "http://localhost:3000/api_v1";

async function testAPI() {
  console.log("🧪 Probando conexión al servidor...");

  try {
    // Probar endpoint de login
    console.log("\n📝 Probando endpoint de login...");
    const loginResponse = await fetch(`${HOST}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        admin_email: 'admin@test.com',
        admin_password: 'password123'
      })
    });

    console.log("Status:", loginResponse.status);
    console.log("Headers:", Object.fromEntries(loginResponse.headers.entries()));
    const loginBody = await loginResponse.text();
    console.log("Body:", loginBody);

    // Probar endpoint de validación de token
    console.log("\n📝 Probando endpoint de validación de token...");
    const tokenResponse = await fetch(`${HOST}/validate-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: 'test-token'
      })
    });

    console.log("Status:", tokenResponse.status);
    const tokenBody = await loginResponse.text();
    console.log("Body:", tokenBody);

    console.log("\n✅ Pruebas completadas!");

  } catch (error) {
    console.error("❌ Error al probar la API:", error.message);
  }
}

testAPI();
