// ============================================
// GESTIÓN DE AUTENTICACIÓN
// ============================================

// Actualizar UI de autenticación en todas las páginas
function updateAuthUI() {
  const token = Storage.get('authToken');
  const currentUser = Storage.get('currentUser');
  const loginBtn = document.getElementById('login-btn');
  const userInfo = document.getElementById('user-info');
  const userName = document.getElementById('user-name');

  if (token && currentUser) {
    // Usuario logueado
    if (loginBtn) loginBtn.style.display = 'none';
    if (userInfo) userInfo.style.display = 'flex';
    if (userName) userName.textContent = currentUser.nombre || currentUser.email;
  } else {
    // Usuario NO logueado
    if (loginBtn) loginBtn.style.display = 'block';
    if (userInfo) userInfo.style.display = 'none';
  }
}

// Evento para cerrar sesión
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', function() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      Storage.remove('authToken');
      Storage.remove('currentUser');
      updateAuthUI();
      alert('Sesión cerrada exitosamente');
      window.location.href = 'index.html';
    }
  });
}

// ============================================
// REGISTRO DE USUARIO
// ============================================
const registerForm = document.getElementById('register-form');
if (registerForm) {
  registerForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const terms = document.getElementById('terms').checked;
    const messageDiv = document.getElementById('register-message');
    
    // Validaciones
    if (!nombre || !email || !password || !confirmPassword) {
      showMessage(messageDiv, 'Por favor completa todos los campos', 'error');
      return;
    }
    
    if (password.length < 6) {
      showMessage(messageDiv, 'La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }
    
    if (password !== confirmPassword) {
      showMessage(messageDiv, 'Las contraseñas no coinciden', 'error');
      return;
    }
    
    if (!terms) {
      showMessage(messageDiv, 'Debes aceptar los términos y condiciones', 'error');
      return;
    }
    
    try {
      // Llamar a la API de registro
      const response = await apiRequest(API_CONFIG.endpoints.register, {
        method: 'POST',
        body: JSON.stringify({ nombre, email, password })
      });
      
      if (response.success) {
        showMessage(messageDiv, 'Cuenta creada exitosamente. Ahora puedes iniciar sesión.', 'success');
        
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1500);
      }
    } catch (error) {
      showMessage(messageDiv, error.message || 'Error al crear la cuenta', 'error');
    }
  });
}

// ============================================
// INICIO DE SESIÓN
// ============================================
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('login-message');
    
    // Validaciones
    if (!email || !password) {
      showMessage(messageDiv, 'Por favor completa todos los campos', 'error');
      return;
    }
    
    try {
      // Llamar a la API de login
      const response = await apiRequest(API_CONFIG.endpoints.login, {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      
      if (response.success && response.data) {
        // Guardar token y datos del usuario
        Storage.set('authToken', response.data.token);
        Storage.set('currentUser', response.data.user);
        
        showMessage(messageDiv, 'Inicio de sesión exitoso. Redirigiendo...', 'success');
        
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1000);
      }
    } catch (error) {
      showMessage(messageDiv, error.message || 'Credenciales incorrectas', 'error');
    }
  });
}

// NUEVO: Función mejorada para cerrar sesión y limpiar carrito
function logout() {
  const currentUser = Storage.get('currentUser');
  
  if (currentUser) {
    // Preguntar si desea conservar el carrito
    const keepCart = confirm(
      `${currentUser.name || 'Usuario'}, ¿deseas conservar tu carrito de compras para la próxima vez que inicies sesión?\n\n` +
      'Si seleccionas "Cancelar", tu carrito se vaciará.'
    );
    
    if (!keepCart) {
      // Eliminar carrito del usuario actual
      Storage.removeUserCart();
    }
    
    // Eliminar sesión del usuario
    Storage.remove('currentUser');
    
    alert('Sesión cerrada exitosamente');
    window.location.href = 'index.html';
  }
}

// Actualizar el event listener del botón de logout
document.addEventListener('DOMContentLoaded', function() {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
});

// ============================================
// FUNCIONES AUXILIARES
// ============================================
function showMessage(element, message, type) {
  if (!element) return;
  
  element.textContent = message;
  element.className = 'message ' + type;
  element.style.display = 'block';
  
  if (type === 'success') {
    setTimeout(() => {
      element.style.display = 'none';
    }, 3000);
  }
}

// Inicializar autenticación al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  updateAuthUI();
});

