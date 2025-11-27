const mysql = require('mysql2/promise');
const dbConfig = require('../../config/database');

const masterPool = mysql.createPool(dbConfig.master);

// Verificar conexión
masterPool.getConnection()
    .then(connection => {
        console.log('✓ Conexión exitosa a la base de datos MASTER');
        connection.release();
    })
    .catch(err => {
        console.error('✗ Error al conectar a la base de datos MASTER:', err.message);
    });

module.exports = masterPool;
