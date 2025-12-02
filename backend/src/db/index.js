const masterPool = require('./masterPool');

module.exports = {
  // Uso recomendado: const [rows] = await db.query(sql, params);
  query: (sql, params) => masterPool.query(sql, params),

  // Si necesitas la conexión para transacciones:
  getConnection: () => masterPool.getConnection(),

  // Por si quieres usar métodos bajos del pool:
  pool: masterPool
};
