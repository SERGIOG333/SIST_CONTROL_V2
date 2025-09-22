const routes = {
  '#dashboard': 'frontend/views/dashboard/index.html',
  '#admin': 'frontend/views/admin/index.html',
  '#role': 'frontend/views/role/index.html',
  '#student': 'frontend/views/student/index.html',
  '#attendance': 'frontend/views/attendance/index.html',
  '#userStatus': 'frontend/views/userStatus/index.html',
  '#teacher': 'frontend/views/teacher/index.html',
  '#course': 'frontend/views/course/index.html',
  '#courseStudent': 'frontend/views/courseStudent/index.html',
  '#father': 'frontend/views/father/index.html',
  '#user': 'frontend/views/user/index.html',
  '#login': 'frontend/views/auth/index.html',
};

function loadView() {
  const hash = window.location.hash || '#dashboard';
  const path = routes[hash] || routes['#dashboard'];

  console.log(`🔄 Intentando cargar vista para hash: ${hash}`);
  console.log(`📁 Ruta del archivo: ${path}`);

  const iframe = document.getElementById('contentFrame');
  if (iframe) {
    iframe.src = path;
    console.log(`✅ Vista cargada exitosamente: ${path}`);
  } else {
    console.error("❌ No se encontró el iframe con id 'contentFrame'");
    console.error("🔍 Verifica que el iframe esté presente en tu index.html principal");
  }
}

window.addEventListener('hashchange', loadView);
window.addEventListener('DOMContentLoaded', loadView);
