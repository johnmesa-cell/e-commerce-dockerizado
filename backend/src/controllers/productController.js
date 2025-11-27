const { Product } = require('../models');

const getAllProducts = async (req, res, next) => {
    try {
        const { limit = 50, offset = 0 } = req.query;
        const products = await Product.findAll(parseInt(limit), parseInt(offset));

        res.json({
            success: true,
            data: products,
            count: products.length
        });

    } catch (error) {
        next(error);
    }
};

const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        res.json({
            success: true,
            data: product
        });

    } catch (error) {
        next(error);
    }
};

const getProductsByCategory = async (req, res, next) => {
    try {
        const { categoriaId } = req.params;
        const { limit = 50 } = req.query;

        const products = await Product.findByCategory(categoriaId, parseInt(limit));

        res.json({
            success: true,
            data: products,
            count: products.length
        });

    } catch (error) {
        next(error);
    }
};

const createProduct = async (req, res, next) => {
    try {
        const { nombre, descripcion, precio, stock, categoria_id, imagen_url } = req.body;

        if (!nombre || !precio || !stock || !categoria_id) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos requeridos'
            });
        }

        const productId = await Product.create({
            nombre,
            descripcion,
            precio,
            stock,
            categoria_id,
            imagen_url
        });

        res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            data: { productId }
        });

    } catch (error) {
        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio, stock, categoria_id, imagen_url } = req.body;

        const updated = await Product.update(id, {
            nombre,
            descripcion,
            precio,
            stock,
            categoria_id,
            imagen_url
        });

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Producto actualizado exitosamente'
        });

    } catch (error) {
        next(error);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await Product.delete(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Producto eliminado exitosamente'
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    getProductsByCategory,
    createProduct,
    updateProduct,
    deleteProduct
};
