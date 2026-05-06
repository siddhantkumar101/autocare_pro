const express = require('express');
const { getStats, getAllUsers, updateUser, getBookingAnalytics, getRevenueAnalytics, getLowStock } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin')); // All admin routes require admin role

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.get('/analytics/bookings', getBookingAnalytics);
router.get('/analytics/revenue', getRevenueAnalytics);
router.get('/inventory/low-stock', getLowStock);

module.exports = router;
