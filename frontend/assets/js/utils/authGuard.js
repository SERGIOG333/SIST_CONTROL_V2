
const AuthGuard = {
  // Constantes
  TOKEN_KEY: 'token-app',
  LOGIN_PATH: '/frontend/views/auth/index.html',
  DASHBOARD_PATH: '/index.html',
  
  /**
   * Obtiene el token del localStorage
   */
  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  },
  
  /**
   * Guarda el token en localStorage
   */
  setToken(token) {
    localStorage.setItem(this.TOKEN_KEY, token);
  },
  
  /**
   * Elimina el token del localStorage
   */
  removeToken() {
    localStorage.removeItem(this.TOKEN_KEY);
  },
  
  /**
   * Verifica si hay un token
   */
  hasToken() {
    return !!this.getToken();
  },
  
  /**
   * Valida el token con el backend
   */
  async validateToken() {
    const token = this.getToken();
    
    if (!token) {
      return false;
    }
    
    try {
      const response = await fetch('http://localhost:3000/api_v1/validate-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ token })
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  },
  
  /**
   * Redirige al login
   */
  redirectToLogin() {
    // Prevenir navegación hacia atrás
    window.history.pushState(null, '', window.location.href);
    window.location.replace(this.LOGIN_PATH);
  },
  
  /**
   * Redirige al dashboard
   */
  redirectToDashboard() {
    window.history.pushState(null, '', window.location.href);
    window.location.replace(this.DASHBOARD_PATH);
  },
  
  /**
   * Protege una página (solo accesible con token válido)
   */
  async protectPage() {
    const isValid = await this.validateToken();
    
    if (!isValid) {
      this.removeToken();
      this.redirectToLogin();
      return false;
    }
    
    return true;
  },
  
  /**
   * Protege la página de login (redirige si ya está autenticado)
   */
  async protectLoginPage() {
    const isValid = await this.validateToken();
    
    if (isValid) {
      this.redirectToDashboard();
      return false;
    }
    
    return true;
  },
  
  /**
   * Cierra sesión
   */
  logout() {
    this.removeToken();
    
    // Limpiar historial para prevenir botón "atrás"
    window.history.pushState(null, '', window.location.href);
    
    // Redirigir al login
    this.redirectToLogin();
  },
  
  /**
   * Previene navegación hacia atrás después de logout
   */
  preventBackNavigation() {
    window.addEventListener('popstate', () => {
      if (!this.hasToken()) {
        window.history.pushState(null, '', window.location.href);
        this.redirectToLogin();
      }
    });
  },
  
  /**
   * Login del usuario
   */
  async login(email, password) {
    try {
      const response = await fetch('http://localhost:3000/api_v1/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          admin_email: email,
          admin_password: password
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.token) {
        this.setToken(data.token);
        return { success: true, data };
      } else {
        return { success: false, message: data.message || 'Error en el login' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Error de conexión con el servidor' };
    }
  }
};

// Exportar para uso global
window.AuthGuard = AuthGuard;