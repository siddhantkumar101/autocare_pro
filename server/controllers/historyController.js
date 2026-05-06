const ServiceHistory = require('../models/ServiceHistory');

// @desc    Get service history for a vehicle
// @route   GET /api/history/:vehicleId
// @access  Private
const getHistoryByVehicle = async (req, res, next) => {
  try {
    const history = await ServiceHistory.find({ vehicleId: req.params.vehicleId, userId: req.user._id })
      .populate('bookingId', 'serviceType date')
      .sort({ serviceDate: -1 });
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
};

// @desc    Create service history record
// @route   POST /api/history
// @access  Private
const createHistory = async (req, res, next) => {
  try {
    const record = await ServiceHistory.create({ ...req.body, userId: req.user._id });
    res.status(201).json({ success: true, message: 'Service record created', data: record });
  } catch (error) {
    next(error);
  }
};

// @desc    Update service history record
// @route   PUT /api/history/:id
// @access  Private
const updateHistory = async (req, res, next) => {
  try {
    const record = await ServiceHistory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Record updated', data: record });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHistoryByVehicle, createHistory, updateHistory };
