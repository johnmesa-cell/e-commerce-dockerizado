const masterPool = require('./masterPool');
const slavePool = require('./slavePool');

module.exports = {
    master: masterPool,  // Para operaciones de escritura (INSERT, UPDATE, DELETE)
    slave: slavePool     // Para operaciones de lectura (SELECT)
};
