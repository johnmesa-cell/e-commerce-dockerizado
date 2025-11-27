require('dotenv').config();

module.exports = {
    master: {
        host: process.env.DB_MASTER_HOST,
        user: process.env.DB_MASTER_USER,
        password: process.env.DB_MASTER_PASSWORD,
        database: process.env.DB_MASTER_DATABASE,
        port: process.env.DB_MASTER_PORT,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    },
    slave: {
        host: process.env.DB_SLAVE_HOST,
        user: process.env.DB_SLAVE_USER,
        password: process.env.DB_SLAVE_PASSWORD,
        database: process.env.DB_SLAVE_DATABASE,
        port: process.env.DB_SLAVE_PORT,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    }
};
