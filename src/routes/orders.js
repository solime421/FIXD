import express from 'express';
import orderController from '../controllers/orderController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

//MAYBE REMOVE
// POST /api/orders
router.post('/', verifyToken, orderController.createOrder);

// GET /api/orders
router.get('/', verifyToken, orderController.getOrders);

// Change order status
router.put('/:orderId/status', verifyToken, orderController.updateOrderStatus);

export default router;