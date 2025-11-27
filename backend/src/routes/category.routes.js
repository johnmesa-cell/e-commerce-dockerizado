const express = require('express');
const router = express.Router();
const { categoryController } = require('../controllers');
const { authenticateToken, isAdmin } = require('../middlewares');

// Rutas públicas
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Rutas protegidas (solo admin)
router.post('/', authenticateToken, isAdmin, categoryController.createCategory);
router.put('/:id', authenticateToken, isAdmin, categoryController.updateCategory);
router.delete('/:id', authenticateToken, isAdmin, categoryController.deleteCategory);

module.exports = router;
