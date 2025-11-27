const db = require('../db');

class Order {
    static async create(orderData) {
        const connection = await db.master.getConnection();
        
        try {
            await connection.beginTransaction();

            const { usuario_id, total, items } = orderData;

            // Crear el pedido
            const [orderResult] = await connection.execute(
                `INSERT INTO pedidos (usuario_id, total, estado, fecha_pedido) 
                 VALUES (?, ?, 'pendiente', NOW())`,
                [usuario_id, total]
            );

            const pedidoId = orderResult.insertId;

            // Insertar los items del pedido
            for (const item of items) {
                await connection.execute(
                    `INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario, subtotal) 
                     VALUES (?, ?, ?, ?, ?)`,
                    [pedidoId, item.producto_id, item.cantidad, item.precio, item.subtotal]
                );

                // Actualizar stock
                await connection.execute(
                    'UPDATE productos SET stock = stock - ? WHERE id = ?',
                    [item.cantidad, item.producto_id]
                );
            }

            await connection.commit();
            return pedidoId;

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async findByUser(usuarioId) {
        const [rows] = await db.slave.execute(
            'SELECT * FROM pedidos WHERE usuario_id = ? ORDER BY fecha_pedido DESC',
            [usuarioId]
        );
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.slave.execute(
            `SELECT p.*, u.nombre as cliente_nombre, u.email as cliente_email 
             FROM pedidos p 
             JOIN usuarios u ON p.usuario_id = u.id 
             WHERE p.id = ?`,
            [id]
        );
        return rows[0];
    }

    static async getOrderDetails(pedidoId) {
        const [rows] = await db.slave.execute(
            `SELECT dp.*, pr.nombre as producto_nombre 
             FROM detalle_pedido dp 
             JOIN productos pr ON dp.producto_id = pr.id 
             WHERE dp.pedido_id = ?`,
            [pedidoId]
        );
        return rows;
    }

    static async updateStatus(id, estado) {
        const [result] = await db.master.execute(
            'UPDATE pedidos SET estado = ? WHERE id = ?',
            [estado, id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = Order;
