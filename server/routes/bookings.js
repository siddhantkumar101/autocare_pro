const express = require('express');
const { getBookings, createBooking, updateBooking, deleteBooking, getAvailableSlots } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // All booking routes are protected

router.get('/available-slots', getAvailableSlots);
router.route('/').get(getBookings).post(createBooking);
router.route('/:id').put(updateBooking).delete(deleteBooking);

module.exports = router;
