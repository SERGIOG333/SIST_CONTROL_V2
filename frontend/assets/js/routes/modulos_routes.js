// ===== RUTAS PARA MÓDULOS SÚPER BONITOS =====

/**
 * Sistema de navegación para los módulos educativos
 * Cada módulo tiene su propio diseño único y espectacular
 */

// URLs de los módulos modernos
const MODULOS_ROUTES = {
  dashboard: 'frontend/views/dashboard/index_modern.html',
  admin: 'frontend/views/admin/index_modern.html',
  student: 'frontend/views/student/index_modern.html',
  teacher: 'frontend/views/teacher/index_modern.html',
  course: 'frontend/views/course/index_modern.html',
  user: 'frontend/views/user/index_modern.html',
  father: 'frontend/views/father/index_modern.html',
  auth: 'frontend/views/auth/index_modern.html'
};

// Función para navegar a un módulo
function navigateToModule(moduleName) {
  const url = MODULOS_ROUTES[moduleName];
  if (url) {
    // Agregar efecto de transición
    document.body.style.opacity = '0.7';
    setTimeout(() => {
      window.location.href = url;
      document.body.style.opacity = '1';
    }, 300);
  } else {
    console.warn(`Módulo ${moduleName} no encontrado`);
  }
}

// Función para cargar módulo en iframe
function loadModuleInFrame(moduleName) {
  const iframe = document.getElementById('contentFrame');
  const url = MODULOS_ROUTES[moduleName];

  if (iframe && url) {
    // Agregar loading spinner
    iframe.style.opacity = '0.5';
    iframe.src = url;

    iframe.onload = function() {
      iframe.style.opacity = '1';
    };
  }
}

// Función para resaltar módulo activo en sidebar
function highlightActiveModule(moduleName) {
  // Remover clase active de todos los links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });

  // Agregar clase active al módulo actual
  const activeLink = document.querySelector(`[href="#${moduleName}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }
}

// Función para animar entrada de módulos
function animateModuleEntry() {
  const cards = document.querySelectorAll('.modulo-card, .stats-card, .modulo-header');

  cards.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';

    setTimeout(() => {
      element.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, index * 100);
  });
}

// Función para inicializar efectos especiales
function initializeSpecialEffects() {
  // Efectos hover en cards
  document.querySelectorAll('.modulo-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px) scale(1.02)';
      this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
      this.style.boxShadow = '';
    });
  });

  // Efectos en botones
  document.querySelectorAll('.btn-modulo').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
      this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
    });

    btn.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '';
    });
  });
}

// Función para actualizar estadísticas en tiempo real
function updateLiveStats() {
  const stats = {
    totalEstudiantes: 247,
    totalProfesores: 23,
    totalCursos: 18,
    totalUsuarios: 293,
    totalAdmins: 3,
    totalPadres: 89
  };

  // Actualizar cada 5 segundos (simulado)
  setInterval(() => {
    Object.keys(stats).forEach(key => {
      const element = document.getElementById(key);
      if (element) {
        const baseValue = stats[key];
        const variation = Math.floor(Math.random() * 10) - 5;
        element.textContent = baseValue + variation;
      }
    });
  }, 5000);
}

// Función para manejar logout
function handleLogout() {
  localStorage.removeItem('token-app');
  localStorage.removeItem('user-role');
  window.location.href = MODULOS_ROUTES.auth;
}

// Función para verificar autenticación
function checkAuthentication() {
  const token = localStorage.getItem('token-app');
  if (!token) {
    window.location.href = MODULOS_ROUTES.auth;
  }
}

// Función para obtener información del usuario actual
function getCurrentUser() {
  const userRole = localStorage.getItem('user-role') || 'guest';
  const userName = localStorage.getItem('user-name') || 'Usuario';

  return {
    role: userRole,
    name: userName
  };
}

// Función para personalizar interfaz según rol
function customizeInterfaceByRole() {
  const user = getCurrentUser();
  const adminMenu = document.getElementById('adminMenu');

  if (adminMenu && user.name) {
    adminMenu.innerHTML = `
      <i class="fas fa-user-circle me-1"></i>${user.name}
    `;
  }

  // Mostrar/ocultar elementos según rol
  const adminOnlyElements = document.querySelectorAll('.admin-only');
  const teacherOnlyElements = document.querySelectorAll('.teacher-only');
  const studentOnlyElements = document.querySelectorAll('.student-only');

  // Ocultar todos primero
  [...adminOnlyElements, ...teacherOnlyElements, ...studentOnlyElements]
    .forEach(el => el.style.display = 'none');

  // Mostrar según rol
  switch (user.role) {
    case 'admin':
      adminOnlyElements.forEach(el => el.style.display = 'block');
      break;
    case 'teacher':
      teacherOnlyElements.forEach(el => el.style.display = 'block');
      break;
    case 'student':
      studentOnlyElements.forEach(el => el.style.display = 'block');
      break;
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  // Verificar autenticación
  checkAuthentication();

  // Personalizar interfaz
  customizeInterfaceByRole();

  // Inicializar efectos especiales
  initializeSpecialEffects();

  // Animar entrada
  animateModuleEntry();

  // Actualizar stats en tiempo real
  updateLiveStats();

  // Manejar navegación
  document.querySelectorAll('[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const moduleName = this.getAttribute('href').substring(1);
      loadModuleInFrame(moduleName);
      highlightActiveModule(moduleName);
    });
  });

  // Manejar logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }

  // Manejar toggle sidebar
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('show');
    });
  }
});

// Exportar funciones para uso global
window.navigateToModule = navigateToModule;
window.loadModuleInFrame = loadModuleInFrame;
window.handleLogout = handleLogout;
