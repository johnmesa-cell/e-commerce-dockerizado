const mysql = require('mysql2/promise');
const dbConfig = require('../../config/database');

const slavePool = mysql.createPool(dbConfig.slave);

// Verificar conexión
slavePool.getConnection()
    .then(connection => {
        console.log('✓ Conexión exitosa a la base de datos SLAVE');
        connection.release();
    })
    .catch(err => {
        console.error('✗ Error al conectar a la base de datos SLAVE:', err.message);
    });

module.exports = slavePool;
