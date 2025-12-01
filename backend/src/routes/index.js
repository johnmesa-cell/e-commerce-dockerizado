const express = require('express');
const router = express.Router();

// Importar rutas específicas
const authRoutes = require('./auth.routes');
const productRoutes = require('./product.routes');
const categoryRoutes = require('./category.routes');
const orderRoutes = require('./order.routes');
const cartRoutes = require('./cart.routes');

const healthRoutes = require('./health.routes');
router.use('/health', healthRoutes);

// Usar las rutas
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/cart', cartRoutes);

module.exports = router;


