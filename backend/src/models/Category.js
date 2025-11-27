const db = require('../db');

class Category {
    static async create(nombre, descripcion) {
        const [result] = await db.master.execute(
            'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)',
            [nombre, descripcion || null]
        );
        return result.insertId;
    }

    static async findAll() {
        const [rows] = await db.slave.execute(
            'SELECT * FROM categorias WHERE activo = 1 ORDER BY nombre'
        );
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.slave.execute(
            'SELECT * FROM categorias WHERE id = ? AND activo = 1',
            [id]
        );
        return rows[0];
    }

    static async update(id, nombre, descripcion) {
        const [result] = await db.master.execute(
            'UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?',
            [nombre, descripcion, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.master.execute(
            'UPDATE categorias SET activo = 0 WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = Category;
