const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    description: { type: String, required: [true, 'Description is required'] },
    category: {
      type: String,
      required: true,
      enum: ['Engine Parts', 'Brakes', 'Electrical', 'Filters', 'Tires & Wheels', 'Lighting', 'Fluids & Oils', 'Body Parts', 'Accessories', 'Other'],
    },
    brand: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    images: [{ type: String }],
    sku: { type: String, unique: true, required: true },
    compatibility: {
      make: { type: String, default: '' },
      model: { type: String, default: '' },
      year: { type: String, default: '' },
    },
    ratings: { type: Number, default: 0 },
    reviews: [reviewSchema],
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
