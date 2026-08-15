const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { verifyAdmin } = require('../middleware/authMiddleware');

router.get('/dashboard', verifyAdmin, analyticsController.getDashboardMetrics);
router.get('/popular-items', verifyAdmin, analyticsController.getPopularItems);
router.get('/revenue', verifyAdmin, analyticsController.getRevenueAnalytics);

module.exports = router;
