const db = require('../db');

class Cart {
    // Obtener todos los items del carrito de un usuario
    static async findByUserId(userId) {
        const [rows] = await db.slave.query(`
            SELECT c.id, c.usuario_id, c.producto_id, c.cantidad, c.fecha_agregado,
                   p.nombre, p.descripcion, p.precio, p.imagen_url, p.stock
            FROM carrito c
            INNER JOIN productos p ON c.producto_id = p.id
            WHERE c.usuario_id = ? AND p.activo = 1
        `, [userId]);
        return rows;
    }

    // Buscar un item específico del carrito
    static async findByUserAndProduct(userId, productId) {
        const [rows] = await db.slave.query(`
            SELECT id, cantidad 
            FROM carrito 
            WHERE usuario_id = ? AND producto_id = ?
        `, [userId, productId]);
        return rows[0] || null;
    }

    // Agregar producto al carrito
    static async create(userId, productId, cantidad = 1) {
        const [result] = await db.master.query(`
            INSERT INTO carrito (usuario_id, producto_id, cantidad) 
            VALUES (?, ?, ?)
        `, [userId, productId, cantidad]);
        return result.insertId;
    }

    // Actualizar cantidad de un item
    static async updateQuantity(cartItemId, userId, cantidad) {
        const [result] = await db.master.query(`
            UPDATE carrito 
            SET cantidad = ? 
            WHERE id = ? AND usuario_id = ?
        `, [cantidad, cartItemId, userId]);
        return result.affectedRows > 0;
    }

    // Incrementar cantidad existente
    static async incrementQuantity(cartItemId, incremento = 1) {
        const [result] = await db.master.query(`
            UPDATE carrito 
            SET cantidad = cantidad + ? 
            WHERE id = ?
        `, [incremento, cartItemId]);
        return result.affectedRows > 0;
    }

    // Eliminar un item del carrito
    static async delete(cartItemId, userId) {
        const [result] = await db.master.query(`
            DELETE FROM carrito 
            WHERE id = ? AND usuario_id = ?
        `, [cartItemId, userId]);
        return result.affectedRows > 0;
    }

    // Vaciar todo el carrito de un usuario
    static async clearByUserId(userId) {
        const [result] = await db.master.query(`
            DELETE FROM carrito 
            WHERE usuario_id = ?
        `, [userId]);
        return result.affectedRows;
    }

    // Contar items en el carrito
    static async countByUserId(userId) {
        const [rows] = await db.slave.query(`
            SELECT COALESCE(SUM(cantidad), 0) as total
            FROM carrito 
            WHERE usuario_id = ?
        `, [userId]);
        return rows[0].total;
    }
}

module.exports = Cart;
