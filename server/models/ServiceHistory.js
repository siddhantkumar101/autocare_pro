const mongoose = require('mongoose');

const serviceHistorySchema = new mongoose.Schema(
  {
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null },
    serviceType: { type: String, required: true },
    serviceDate: { type: Date, required: true },
    mileageAtService: { type: Number, default: 0 },
    technicianNotes: { type: String, default: '' },
    partsReplaced: [{ type: String }],
    cost: { type: Number, default: 0 },
    nextServiceDue: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ServiceHistory', serviceHistorySchema);
