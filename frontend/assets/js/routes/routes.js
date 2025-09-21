const routes = {
  '#dashboard': 'frontend/views/dashboard/index.html',
  '#admin': 'frontend/views/admin/index.html',
  '#role': 'frontend/views/role/index.html',
  '#student': 'frontend/views/student/index.html',
  '#userStatus': 'frontend/views/userStatus/index.html',
  '#teacher': 'frontend/views/teacher/index.html',
  '#course': 'frontend/views/course/index.html',
  '#courseStudent': 'frontend/views/courseStudent/index.html',
  '#father': 'frontend/views/father/index.html',
  '#user': 'frontend/views/user/index.html',
};

function loadView() {
  const hash = window.location.hash || '#dashboard';
  const path = routes[hash] || routes['#dashboard'];

  const iframe = document.getElementById('contentFrame');
  if (iframe) {
    iframe.src = path;
  } else {
    console.error("No se encontró el iframe con id 'contentFrame'");
  }
}

window.addEventListener('hashchange', loadView);
window.addEventListener('DOMContentLoaded', loadView);
