const db = require('../db');
const bcrypt = require('bcrypt');

class User {
    static async create(userData) {
        const { nombre, email, password, telefono, direccion } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            `INSERT INTO usuarios (nombre, email, password, telefono, direccion, role, fecha_registro) 
             VALUES (?, ?, ?, ?, ?, 'cliente', NOW())`,
            [nombre, email, hashedPassword, telefono || null, direccion || null]
        );

        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await db.query(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.query(
            'SELECT id, nombre, email, telefono, direccion, role, fecha_registro FROM usuarios WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async update(id, userData) {
        const { nombre, telefono, direccion } = userData;
        const [result] = await db.query(
            'UPDATE usuarios SET nombre = ?, telefono = ?, direccion = ? WHERE id = ?',
            [nombre, telefono, direccion, id]
        );
        return result.affectedRows > 0;
    }

    static async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = User;
