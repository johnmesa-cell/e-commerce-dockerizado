const mysql = require('mysql2/promise');
const dbConfig = require('../../config/database');

const masterPool = mysql.createPool(dbConfig);

// Verificar conexión
masterPool.getConnection()
  .then(conn => {
    console.log('✓ Conexión exitosa a la base de datos');
    conn.release();
  })
  .catch(err => {
    console.error('✗ Error al conectar a la base de datos:', err.message);
  });

module.exports = masterPool;
