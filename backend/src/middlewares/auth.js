const jwt = require('jsonwebtoken');
const serverConfig = require('../../config/server');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Token no proporcionado' 
        });
    }

    jwt.verify(token, serverConfig.jwt.secret, (err, user) => {
        if (err) {
            return res.status(403).json({ 
                success: false, 
                message: 'Token inválido o expirado' 
            });
        }
        req.user = user;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ 
            success: false, 
            message: 'Acceso denegado. Se requieren permisos de administrador' 
        });
    }
};

module.exports = { authenticateToken, isAdmin };
