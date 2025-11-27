const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');
const { validateRegister, validateLogin, authenticateToken } = require('../middlewares');

// Rutas públicas
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

// Rutas protegidas
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, authController.updateProfile);

module.exports = router;
