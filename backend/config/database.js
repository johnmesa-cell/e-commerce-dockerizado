require('dotenv').config();

module.exports = {
    host: process.env.DB_MASTER_HOST || 'db-primary',
    user: process.env.DB_MASTER_USER,
    password: process.env.DB_MASTER_PASSWORD,
    database: process.env.DB_MASTER_DATABASE,
    port: process.env.DB_MASTER_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

