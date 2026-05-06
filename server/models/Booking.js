const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    serviceType: {
      type: String,
      enum: ['Oil Change', 'Tire Rotation', 'Brake Service', 'Full Inspection', 'AC Service', 'Engine Tune-Up', 'Custom'],
      required: true,
    },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true }, // e.g. "09:00 AM"
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    workshopId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    notes: { type: String, default: '' },
    price: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
