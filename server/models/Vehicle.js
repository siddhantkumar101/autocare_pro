const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    make: { type: String, required: [true, 'Make is required'], trim: true },
    model: { type: String, required: [true, 'Model is required'], trim: true },
    year: { type: Number, required: [true, 'Year is required'], min: 1900, max: new Date().getFullYear() + 1 },
    licensePlate: { type: String, required: [true, 'License plate is required'], uppercase: true, trim: true },
    vin: { type: String, default: '', trim: true },
    fuelType: {
      type: String,
      enum: ['petrol', 'diesel', 'electric', 'hybrid', 'cng'],
      default: 'petrol',
    },
    mileage: { type: Number, default: 0 },
    color: { type: String, default: '' },
    image: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);
