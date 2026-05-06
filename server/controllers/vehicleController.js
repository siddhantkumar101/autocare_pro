const Vehicle = require('../models/Vehicle');

// @desc    Get all vehicles for user
// @route   GET /api/vehicles
// @access  Private
const getVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: vehicles });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a vehicle
// @route   POST /api/vehicles
// @access  Private
const createVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.create({ ...req.body, userId: req.user._id });
    res.status(201).json({ success: true, message: 'Vehicle added successfully', data: vehicle });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a vehicle
// @route   PUT /api/vehicles/:id
// @access  Private
const updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOne({ _id: req.params.id, userId: req.user._id });
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });

    const updated = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: 'Vehicle updated', data: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private
const deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOne({ _id: req.params.id, userId: req.user._id });
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });

    await vehicle.deleteOne();
    res.status(200).json({ success: true, message: 'Vehicle deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getVehicles, createVehicle, updateVehicle, deleteVehicle };
