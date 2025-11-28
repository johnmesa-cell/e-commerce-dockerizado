// ============================================
// GESTIÓN DEL CARRITO DE COMPRAS CON BASE DE DATOS
// ============================================

const API_URL = 'http://localhost:3000/api/cart';

// Obtener carrito desde el servidor
async function getCart() {
  const token = Storage.get('authToken');  // ← CAMBIO AQUÍ
  if (!token) return [];
  
  try {
    const response = await fetch(API_URL, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error('Error al obtener carrito');
    
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    return [];
  }
}

// Actualizar contador del carrito en el header
async function updateCartCount() {
  const token = Storage.get('authToken');  // ← CAMBIO AQUÍ
  const cartCountElement = document.getElementById('cart-count');
  
  if (!cartCountElement) return;
  
  if (!token) {
    cartCountElement.textContent = '0';
    return;
  }

  try {
    const response = await fetch(`${API_URL}/count`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (response.ok) {
      const data = await response.json();
      cartCountElement.textContent = data.success ? data.count : '0';
    }
  } catch (error) {
    console.error('Error al actualizar contador:', error);
    cartCountElement.textContent = '0';
  }
}

// Agregar producto al carrito
async function addToCart(productId, productData = null) {
  const currentUser = Storage.get('currentUser');
  const token = Storage.get('authToken');  // ← CAMBIO AQUÍ
  
  if (!currentUser || !token) {
    if (confirm('Debes iniciar sesión para agregar productos al carrito. ¿Deseas ir a la página de inicio de sesión?')) {
      window.location.href = 'login.html';
    }
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        producto_id: productId, 
        cantidad: 1 
      })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      alert(data.message);
      await updateCartCount();
    } else {
      alert(data.message || 'Error al agregar producto');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error de conexión al agregar producto');
  }
}

// Eliminar producto del carrito
async function removeFromCart(cartItemId) {
  const token = Storage.get('authToken');  // ← CAMBIO AQUÍ
  
  if (!confirm('¿Deseas eliminar este producto del carrito?')) return;
  
  try {
    const response = await fetch(`${API_URL}/${cartItemId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      alert(data.message);
      renderCart();
      updateCartCount();
    } else {
      alert(data.message || 'Error al eliminar producto');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error de conexión al eliminar producto');
  }
}

// Actualizar cantidad de un producto
async function updateQuantity(cartItemId, newQuantity) {
  if (newQuantity <= 0) {
    removeFromCart(cartItemId);
    return;
  }

  const token = Storage.get('authToken');  // ← CAMBIO AQUÍ
  
  try {
    const response = await fetch(`${API_URL}/${cartItemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ cantidad: newQuantity })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      renderCart();
      updateCartCount();
    } else {
      alert(data.message || 'Error al actualizar cantidad');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error de conexión al actualizar cantidad');
  }
}

// Vaciar carrito completo
async function clearCart() {
  if (!confirm('¿Estás seguro de que deseas vaciar el carrito?')) return;
  
  const token = Storage.get('authToken');  // ← CAMBIO AQUÍ
  
  try {
    const response = await fetch(`${API_URL}/clear`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      alert(data.message);
      renderCart();
      updateCartCount();
    } else {
      alert(data.message || 'Error al vaciar carrito');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error de conexión al vaciar carrito');
  }
}

// Renderizar carrito en cart.html
async function renderCart() {
  const currentUser = Storage.get('currentUser');
  const cartContent = document.getElementById('cart-content');
  const emptyCart = document.getElementById('empty-cart');
  const cartSummary = document.getElementById('cart-summary');
  
  if (!cartContent) return;
  
  // Verificar autenticación
  if (!currentUser) {
    cartContent.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <h2>⚠️ Sesión requerida</h2>
        <p>Debes iniciar sesión para ver tu carrito de compras</p>
        <button class="cta-btn" onclick="window.location.href='login.html'" style="margin-top: 20px;">
          Iniciar Sesión
        </button>
      </div>
    `;
    if (emptyCart) emptyCart.style.display = 'none';
    if (cartSummary) cartSummary.style.display = 'none';
    return;
  }

  // Obtener carrito
  const cart = await getCart();
  
  // Carrito vacío
  if (cart.length === 0) {
    cartContent.innerHTML = '';
    if (emptyCart) emptyCart.style.display = 'block';
    if (cartSummary) cartSummary.style.display = 'none';
    return;
  }
  
  // Mostrar carrito con productos
  if (emptyCart) emptyCart.style.display = 'none';
  if (cartSummary) cartSummary.style.display = 'block';
  
  const userInfo = `<div class="cart-user-info">
    <p><strong>🛒 Carrito de:</strong> ${currentUser.nombre || currentUser.email}</p>
  </div>`;
  
  cartContent.innerHTML = userInfo + cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img src="${item.imagen_url || 'assets/images/placeholder.jpg'}" alt="${item.nombre}">
      <div class="item-details">
        <h3>${item.nombre}</h3>
        <p class="item-price">$${parseFloat(item.precio).toLocaleString('es-CO')}</p>
      </div>
      <div class="item-quantity">
        <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.cantidad - 1})">-</button>
        <span>${item.cantidad}</span>
        <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.cantidad + 1})">+</button>
      </div>
      <div class="item-total">
        <p>$${(parseFloat(item.precio) * item.cantidad).toLocaleString('es-CO')}</p>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${item.id})">🗑️</button>
    </div>
  `).join('');
  
  updateCartSummary(cart);
}

// Actualizar resumen del carrito
function updateCartSummary(cart) {
  let subtotal = 0;
  
  cart.forEach(item => {
    subtotal += parseFloat(item.precio) * item.cantidad;
  });
  
  const shipping = subtotal > 100000 ? 0 : 10000;
  const total = subtotal + shipping;
  
  const subtotalElement = document.getElementById('subtotal');
  const shippingElement = document.getElementById('shipping');
  const totalElement = document.getElementById('total');
  
  if (subtotalElement) subtotalElement.textContent = '$' + subtotal.toLocaleString('es-CO');
  if (shippingElement) shippingElement.textContent = shipping === 0 ? 'GRATIS' : '$' + shipping.toLocaleString('es-CO');
  if (totalElement) totalElement.textContent = '$' + total.toLocaleString('es-CO');
}

// Evento para botón de checkout
const checkoutBtn = document.getElementById('checkout-btn');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', async function() {
    const currentUser = Storage.get('currentUser');
    
    if (!currentUser) {
      alert('Debes iniciar sesión para proceder al pago');
      window.location.href = 'login.html';
      return;
    }
    
    const cart = await getCart();
    if (cart.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }
    
    alert(`Procesando pedido para ${currentUser.nombre || currentUser.email}...\n\nFuncionalidad de pago en desarrollo.`);
  });
}

// Evento para botón de vaciar carrito
const clearCartBtn = document.getElementById('clear-cart-btn');
if (clearCartBtn) {
  clearCartBtn.addEventListener('click', clearCart);
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  updateCartCount();
  
  // Si estamos en la página del carrito, renderizarlo
  if (document.getElementById('cart-content')) {
    renderCart();
  }
});

