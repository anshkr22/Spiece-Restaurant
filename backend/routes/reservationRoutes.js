const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { verifyAdmin } = require('../middleware/authMiddleware');

router.post('/', reservationController.createReservation);
router.get('/', verifyAdmin, reservationController.getReservations);
router.get('/:id', reservationController.getReservationById);
router.put('/:id/status', verifyAdmin, reservationController.updateReservationStatus);
router.delete('/:id', verifyAdmin, reservationController.deleteReservation);

module.exports = router;
