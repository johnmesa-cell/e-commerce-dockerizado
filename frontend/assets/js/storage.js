// Utilidad para manejar localStorage
const Storage = {
  // Obtener datos del localStorage
  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error al leer del localStorage:', error);
      return null;
    }
  },

  // Guardar datos en localStorage
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
      return false;
    }
  },

  // Eliminar datos del localStorage
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error al eliminar del localStorage:', error);
      return false;
    }
  },

  // Limpiar todo el localStorage
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error al limpiar localStorage:', error);
      return false;
    }
  },

  // NUEVO: Obtener clave del carrito específica para el usuario actual
  getCartKey() {
    const currentUser = this.get('currentUser');
    if (currentUser && currentUser.email) {
      return `cart_${currentUser.email}`;
    }
    return 'cart_guest'; // Carrito para usuarios no autenticados
  },

  // NUEVO: Obtener carrito del usuario actual
  getUserCart() {
    const cartKey = this.getCartKey();
    return this.get(cartKey) || [];
  },

  // NUEVO: Guardar carrito del usuario actual
  setUserCart(cart) {
    const cartKey = this.getCartKey();
    return this.set(cartKey, cart);
  },

  // NUEVO: Eliminar carrito del usuario actual
  removeUserCart() {
    const cartKey = this.getCartKey();
    return this.remove(cartKey);
  }
};

