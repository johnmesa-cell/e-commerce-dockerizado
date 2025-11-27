const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../../logs');

// Crear carpeta de logs si no existe
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

const log = (level, message, data = null) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        level,
        message,
        ...(data && { data })
    };

    const logString = JSON.stringify(logEntry) + '\n';
    const logFile = path.join(logsDir, `${level}.log`);

    // Escribir en archivo
    fs.appendFileSync(logFile, logString);

    // Mostrar en consola en desarrollo
    if (process.env.NODE_ENV === 'development') {
        console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`, data || '');
    }
};

module.exports = {
    info: (message, data) => log('info', message, data),
    error: (message, data) => log('error', message, data),
    warn: (message, data) => log('warn', message, data),
    debug: (message, data) => log('debug', message, data)
};

