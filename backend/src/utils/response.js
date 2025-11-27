class ApiResponse {
    static success(res, data, message = 'Operación exitosa', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    }

    static error(res, message = 'Error en la operación', statusCode = 500, errors = null) {
        return res.status(statusCode).json({
            success: false,
            message,
            ...(errors && { errors })
        });
    }

    static created(res, data, message = 'Recurso creado exitosamente') {
        return res.status(201).json({
            success: true,
            message,
            data
        });
    }

    static notFound(res, message = 'Recurso no encontrado') {
        return res.status(404).json({
            success: false,
            message
        });
    }

    static unauthorized(res, message = 'No autorizado') {
        return res.status(401).json({
            success: false,
            message
        });
    }

    static forbidden(res, message = 'Acceso prohibido') {
        return res.status(403).json({
            success: false,
            message
        });
    }

    static badRequest(res, message = 'Solicitud incorrecta', errors = null) {
        return res.status(400).json({
            success: false,
            message,
            ...(errors && { errors })
        });
    }
}

module.exports = ApiResponse;

