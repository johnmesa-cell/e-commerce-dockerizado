const express = require('express');
const router = express.Router();
const { productController } = require('../controllers');
const { authenticateToken, isAdmin } = require('../middlewares');

// Rutas públicas
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/category/:categoriaId', productController.getProductsByCategory);

// Rutas protegidas (solo admin)
router.post('/', authenticateToken, isAdmin, productController.createProduct);
router.put('/:id', authenticateToken, isAdmin, productController.updateProduct);
router.delete('/:id', authenticateToken, isAdmin, productController.deleteProduct);

module.exports = router;
