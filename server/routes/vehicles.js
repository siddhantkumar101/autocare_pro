const express = require('express');
const { getVehicles, createVehicle, updateVehicle, deleteVehicle } = require('../controllers/vehicleController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // All vehicle routes are protected

router.route('/').get(getVehicles).post(createVehicle);
router.route('/:id').put(updateVehicle).delete(deleteVehicle);

module.exports = router;
