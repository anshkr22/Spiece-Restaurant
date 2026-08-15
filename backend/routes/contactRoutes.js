const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { verifyAdmin } = require('../middleware/authMiddleware');

router.post('/', contactController.submitContactMessage);
router.get('/', verifyAdmin, contactController.getContactMessages);
router.put('/:id/status', verifyAdmin, contactController.updateContactStatus);

module.exports = router;
