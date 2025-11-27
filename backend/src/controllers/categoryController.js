const { Category } = require('../models');

const getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.findAll();

        res.json({
            success: true,
            data: categories
        });

    } catch (error) {
        next(error);
    }
};

const getCategoryById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            });
        }

        res.json({
            success: true,
            data: category
        });

    } catch (error) {
        next(error);
    }
};

const createCategory = async (req, res, next) => {
    try {
        const { nombre, descripcion } = req.body;

        if (!nombre) {
            return res.status(400).json({
                success: false,
                message: 'El nombre es requerido'
            });
        }

        const categoryId = await Category.create(nombre, descripcion);

        res.status(201).json({
            success: true,
            message: 'Categoría creada exitosamente',
            data: { categoryId }
        });

    } catch (error) {
        next(error);
    }
};

const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

        const updated = await Category.update(id, nombre, descripcion);

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Categoría actualizada exitosamente'
        });

    } catch (error) {
        next(error);
    }
};

const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await Category.delete(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Categoría eliminada exitosamente'
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
