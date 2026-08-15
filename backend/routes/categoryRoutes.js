const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyAdmin } = require('../middleware/authMiddleware');

router.get('/', categoryController.getCategories);
router.post('/', verifyAdmin, categoryController.createCategory);
router.put('/:id', verifyAdmin, categoryController.updateCategory);
router.delete('/:id', verifyAdmin, categoryController.deleteCategory);

module.exports = router;
