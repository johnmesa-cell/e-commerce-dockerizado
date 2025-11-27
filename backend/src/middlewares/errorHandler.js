const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Error de base de datos
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            success: false,
            message: 'El registro ya existe en la base de datos',
            error: err.sqlMessage
        });
    }

    // Error de validación
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Error de validación',
            errors: err.errors
        });
    }

    // Error por defecto
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Error interno del servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;
