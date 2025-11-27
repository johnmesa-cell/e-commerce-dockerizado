const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    // Mínimo 6 caracteres
    return password && password.length >= 6;
};

const validatePhoneNumber = (phone) => {
    // Validar formato de teléfono colombiano (opcional)
    const phoneRegex = /^[0-9]{7,10}$/;
    return phone ? phoneRegex.test(phone) : true;
};

const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input.trim().replace(/[<>]/g, '');
};

const validatePrice = (price) => {
    return !isNaN(price) && parseFloat(price) > 0;
};

const validateStock = (stock) => {
    return !isNaN(stock) && parseInt(stock) >= 0;
};

module.exports = {
    validateEmail,
    validatePassword,
    validatePhoneNumber,
    sanitizeInput,
    validatePrice,
    validateStock
};
