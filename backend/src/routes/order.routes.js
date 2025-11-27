const express = require('express');
const router = express.Router();
const { orderController } = require('../controllers');
const { authenticateToken, isAdmin } = require('../middlewares');

// Todas las rutas de pedidos requieren autenticación
router.post('/', authenticateToken, orderController.createOrder);
router.get('/', authenticateToken, orderController.getUserOrders);
router.get('/:id', authenticateToken, orderController.getOrderById);

// Solo admin puede actualizar estado de pedidos
router.put('/:id/status', authenticateToken, isAdmin, orderController.updateOrderStatus);

module.exports = router;
