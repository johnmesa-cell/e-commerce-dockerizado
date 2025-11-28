const authController = require('./authController');
const productController = require('./productController');
const categoryController = require('./categoryController');
const orderController = require('./orderController');
const cartController = require('./cartController'); // ← ESTA LÍNEA

module.exports = {
    authController,
    productController,
    categoryController,
    orderController,
    cartController  // ← ESTA LÍNEA
};
