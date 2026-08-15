const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { verifyAdmin } = require('../middleware/authMiddleware');

router.get('/', verifyAdmin, customerController.getCustomers);
router.get('/:id', verifyAdmin, customerController.getCustomerById);

module.exports = router;
