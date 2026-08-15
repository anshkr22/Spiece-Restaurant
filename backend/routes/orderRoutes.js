const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyAdmin } = require('../middleware/authMiddleware');

router.post('/', orderController.createOrder);
router.post('/create-razorpay-order', orderController.createRazorpayOrder);
router.post('/verify-razorpay-payment', orderController.verifyRazorpayPayment);
router.get('/', verifyAdmin, orderController.getOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id/status', verifyAdmin, orderController.updateOrderStatus);

module.exports = router;
