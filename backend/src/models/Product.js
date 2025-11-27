const db = require('../db');

class Product {
    static async create(productData) {
        const { nombre, descripcion, precio, stock, categoria_id, imagen_url } = productData;

        const [result] = await db.master.execute(
            `INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, imagen_url, fecha_creacion) 
             VALUES (?, ?, ?, ?, ?, ?, NOW())`,
            [nombre, descripcion, precio, stock, categoria_id, imagen_url || null]
        );

        return result.insertId;
    }

    static async findAll(limit = 50, offset = 0) {
    // Asegurarnos de que limit y offset sean números enteros
    const limitInt = parseInt(limit) || 50;
    const offsetInt = parseInt(offset) || 0;
    
    const [rows] = await db.slave.execute(
        `SELECT p.*, c.nombre as categoria_nombre 
         FROM productos p 
         LEFT JOIN categorias c ON p.categoria_id = c.id 
         WHERE p.activo = 1
         LIMIT ${limitInt} OFFSET ${offsetInt}`
    );
    return rows;
    }


    static async findById(id) {
        const [rows] = await db.slave.execute(
            `SELECT p.*, c.nombre as categoria_nombre 
             FROM productos p 
             LEFT JOIN categorias c ON p.categoria_id = c.id 
             WHERE p.id = ? AND p.activo = 1`,
            [id]
        );
        return rows[0];
    }

    static async findByCategory(categoriaId, limit = 50) {
        const [rows] = await db.slave.execute(
            `SELECT * FROM productos 
             WHERE categoria_id = ? AND activo = 1 
             LIMIT ?`,
            [categoriaId, limit]
        );
        return rows;
    }

    static async update(id, productData) {
        const { nombre, descripcion, precio, stock, categoria_id, imagen_url } = productData;

        const [result] = await db.master.execute(
            `UPDATE productos 
             SET nombre = ?, descripcion = ?, precio = ?, stock = ?, categoria_id = ?, imagen_url = ? 
             WHERE id = ?`,
            [nombre, descripcion, precio, stock, categoria_id, imagen_url, id]
        );

        return result.affectedRows > 0;
    }

    static async updateStock(id, quantity) {
        const [result] = await db.master.execute(
            'UPDATE productos SET stock = stock - ? WHERE id = ? AND stock >= ?',
            [quantity, id, quantity]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.master.execute(
            'UPDATE productos SET activo = 0 WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = Product;
