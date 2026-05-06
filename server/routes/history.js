const express = require('express');
const { getHistoryByVehicle, createHistory, updateHistory } = require('../controllers/historyController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/').post(createHistory);
router.route('/:vehicleId').get(getHistoryByVehicle);
router.route('/record/:id').put(updateHistory); // adjusted path to avoid conflict with vehicleId

module.exports = router;
