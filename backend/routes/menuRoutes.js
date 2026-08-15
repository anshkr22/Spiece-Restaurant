const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { verifyAdmin } = require('../middleware/authMiddleware');

router.get('/', menuController.getMenuItems);
router.get('/:id', menuController.getMenuItemById);
router.post('/', verifyAdmin, menuController.createMenuItem);
router.put('/:id', verifyAdmin, menuController.updateMenuItem);
router.delete('/:id', verifyAdmin, menuController.deleteMenuItem);

module.exports = router;
