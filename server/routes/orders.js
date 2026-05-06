const express = require('express');
const { checkout, getOrders, getOrder, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);

router.route('/').get(getOrders);
router.post('/checkout', checkout);
router.route('/:id').get(getOrder);
router.put('/:id/status', authorize('admin'), updateOrderStatus);

module.exports = router;
