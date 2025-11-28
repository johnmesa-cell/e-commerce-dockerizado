const Cart = require('../models/Cart');

// Obtener carrito del usuario
const getCart = async (req, res, next) => {
    try {
        const items = await Cart.findByUserId(req.user.id);
        
        res.json({
            success: true,
            data: items,
            count: items.length
        });
    } catch (error) {
        next(error);
    }
};

// Agregar producto al carrito
const addToCart = async (req, res, next) => {
    try {
        const { producto_id, cantidad = 1 } = req.body;
        const userId = req.user.id;

        if (!producto_id) {
            return res.status(400).json({
                success: false,
                message: 'El ID del producto es requerido'
            });
        }

        // Verificar si el producto ya está en el carrito
        const existing = await Cart.findByUserAndProduct(userId, producto_id);

        if (existing) {
            // Incrementar cantidad
            await Cart.incrementQuantity(existing.id, cantidad);
            
            res.json({
                success: true,
                message: 'Cantidad actualizada en el carrito',
                data: { 
                    id: existing.id, 
                    cantidad: existing.cantidad + cantidad 
                }
            });
        } else {
            // Crear nuevo item
            const cartItemId = await Cart.create(userId, producto_id, cantidad);
            
            res.status(201).json({
                success: true,
                message: 'Producto agregado al carrito',
                data: { 
                    id: cartItemId, 
                    cantidad 
                }
            });
        }
    } catch (error) {
        next(error);
    }
};

// Actualizar cantidad
const updateQuantity = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { cantidad } = req.body;
        const userId = req.user.id;

        if (!cantidad || cantidad < 1) {
            return res.status(400).json({
                success: false,
                message: 'La cantidad debe ser mayor a 0'
            });
        }

        const updated = await Cart.updateQuantity(id, userId, cantidad);

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Item no encontrado en el carrito'
            });
        }

        res.json({
            success: true,
            message: 'Cantidad actualizada',
            data: { id, cantidad }
        });
    } catch (error) {
        next(error);
    }
};

// Eliminar del carrito
const removeFromCart = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const deleted = await Cart.delete(id, userId);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Item no encontrado en el carrito'
            });
        }

        res.json({
            success: true,
            message: 'Producto eliminado del carrito'
        });
    } catch (error) {
        next(error);
    }
};

// Vaciar carrito
const clearCart = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const deletedCount = await Cart.clearByUserId(userId);

        res.json({
            success: true,
            message: 'Carrito vaciado',
            deletedCount
        });
    } catch (error) {
        next(error);
    }
};

// Obtener contador de items
const getCartCount = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const count = await Cart.countByUserId(userId);

        res.json({
            success: true,
            count
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartCount
};
