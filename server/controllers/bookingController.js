const Booking = require('../models/Booking');

const SERVICE_PRICES = {
  'Oil Change': 1500,
  'Tire Rotation': 800,
  'Brake Service': 3500,
  'Full Inspection': 2000,
  'AC Service': 2500,
  'Engine Tune-Up': 5000,
  Custom: 0,
};

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM',
];

// @desc    Get bookings for current user (or all if admin)
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { userId: req.user._id };
    const bookings = await Booking.find(query)
      .populate('vehicleId', 'make model year licensePlate')
      .populate('userId', 'name email')
      .populate('technicianId', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const { vehicleId, serviceType, date, timeSlot, notes } = req.body;
    const price = SERVICE_PRICES[serviceType] || 0;
    const booking = await Booking.create({
      userId: req.user._id, vehicleId, serviceType, date, timeSlot, notes, price,
    });
    res.status(201).json({ success: true, message: 'Booking created successfully', data: booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a booking
// @route   PUT /api/bookings/:id
// @access  Private
const updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    // Only owner or admin can update
    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: 'Booking updated', data: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete/Cancel a booking
// @route   DELETE /api/bookings/:id
// @access  Private
const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await booking.deleteOne();
    res.status(200).json({ success: true, message: 'Booking cancelled' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get available time slots for a date
// @route   GET /api/bookings/available-slots
// @access  Private
const getAvailableSlots = async (req, res, next) => {
  try {
    const { date, workshopId } = req.query;
    if (!date) return res.status(400).json({ success: false, message: 'Date is required' });

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBookings = await Booking.find({
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: 'cancelled' },
    });

    const bookedSlots = existingBookings.map((b) => b.timeSlot);
    const availableSlots = TIME_SLOTS.filter((slot) => !bookedSlots.includes(slot));

    res.status(200).json({ success: true, data: availableSlots });
  } catch (error) {
    next(error);
  }
};

module.exports = { getBookings, createBooking, updateBooking, deleteBooking, getAvailableSlots };
