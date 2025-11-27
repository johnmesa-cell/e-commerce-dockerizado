const jwt = require('jsonwebtoken');
const { User } = require('../models');
const serverConfig = require('../../config/server');

const register = async (req, res, next) => {
    try {
        const { nombre, email, password, telefono, direccion } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'El email ya está registrado'
            });
        }

        // Crear usuario
        const userId = await User.create({ nombre, email, password, telefono, direccion });

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: { userId }
        });

    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Verificar contraseña
        const isValidPassword = await User.comparePassword(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Generar token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            serverConfig.jwt.secret,
            { expiresIn: serverConfig.jwt.expiresIn }
        );

        res.json({
            success: true,
            message: 'Login exitoso',
            data: {
                token,
                user: {
                    id: user.id,
                    nombre: user.nombre,
                    email: user.email,
                    role: user.role
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

const getProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            data: user
        });

    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { nombre, telefono, direccion } = req.body;

        const updated = await User.update(userId, { nombre, telefono, direccion });

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'No se pudo actualizar el perfil'
            });
        }

        res.json({
            success: true,
            message: 'Perfil actualizado exitosamente'
        });

    } catch (error) {
        next(error);
    }
};

module.exports = { register, login, getProfile, updateProfile };
