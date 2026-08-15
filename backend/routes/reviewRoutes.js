const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { verifyAdmin } = require('../middleware/authMiddleware');

router.get('/', reviewController.getReviews);
router.post('/', reviewController.createReview);
router.put('/:id', verifyAdmin, reviewController.updateReview);
router.delete('/:id', verifyAdmin, reviewController.deleteReview);

module.exports = router;
