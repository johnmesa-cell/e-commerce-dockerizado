const express = require('express');
const router = express.Router();
const { cartController } = require('../controllers');
const { authenticateToken } = require('../middlewares');  // ← CAMBIO AQUÍ

// Todas las rutas requieren autenticación
router.use(authenticateToken);  // ← CAMBIO AQUÍ

// GET /api/cart - Obtener carrito del usuario
router.get('/', cartController.getCart);

// GET /api/cart/count - Obtener contador de items
router.get('/count', cartController.getCartCount);

// POST /api/cart - Agregar producto al carrito
router.post('/', cartController.addToCart);

// PUT /api/cart/:id - Actualizar cantidad de un item
router.put('/:id', cartController.updateQuantity);

// DELETE /api/cart/:id - Eliminar un item del carrito
router.delete('/:id', cartController.removeFromCart);

// POST /api/cart/clear - Vaciar todo el carrito
router.post('/clear', cartController.clearCart);

module.exports = router;
