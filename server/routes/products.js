const express = require('express');
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, addReview } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.route('/').get(getProducts).post(protect, authorize('seller', 'admin'), createProduct);
router.route('/:id').get(getProduct).put(protect, authorize('seller', 'admin'), updateProduct).delete(protect, authorize('admin'), deleteProduct);
router.post('/:id/review', protect, addReview);

module.exports = router;
