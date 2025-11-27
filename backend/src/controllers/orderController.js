const { Order } = require('../models');

const createOrder = async (req, res, next) => {
    try {
        const usuarioId = req.user.id;
        const { items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'El pedido debe contener al menos un producto'
            });
        }

        // Calcular total
        const total = items.reduce((sum, item) => sum + item.subtotal, 0);

        const orderId = await Order.create({
            usuario_id: usuarioId,
            total,
            items
        });

        res.status(201).json({
            success: true,
            message: 'Pedido creado exitosamente',
            data: { orderId, total }
        });

    } catch (error) {
        next(error);
    }
};

const getUserOrders = async (req, res, next) => {
    try {
        const usuarioId = req.user.id;
        const orders = await Order.findByUser(usuarioId);

        res.json({
            success: true,
            data: orders
        });

    } catch (error) {
        next(error);
    }
};

const getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Pedido no encontrado'
            });
        }

        // Verificar que el pedido pertenece al usuario (o es admin)
        if (order.usuario_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para ver este pedido'
            });
        }

        // Obtener detalles del pedido
        const details = await Order.getOrderDetails(id);

        res.json({
            success: true,
            data: {
                ...order,
                items: details
            }
        });

    } catch (error) {
        next(error);
    }
};

const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const validStates = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'];
        if (!validStates.includes(estado)) {
            return res.status(400).json({
                success: false,
                message: 'Estado no válido'
            });
        }

        const updated = await Order.updateStatus(id, estado);

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Pedido no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Estado del pedido actualizado exitosamente'
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus
};
