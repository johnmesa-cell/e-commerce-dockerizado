const { authenticateToken, isAdmin } = require('./auth');
const errorHandler = require('./errorHandler');
const { validateRegister, validateLogin } = require('./validator');

module.exports = {
    authenticateToken,
    isAdmin,
    errorHandler,
    validateRegister,
    validateLogin
};
