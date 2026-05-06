const User = require('../models/User');
const Booking = require('../models/Booking');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalUsers, totalBookings, todayBookings, weekBookings, monthBookings,
      pendingBookings, totalOrders, totalRevenue, lowStockProducts,
    ] = await Promise.all([
      User.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ createdAt: { $gte: today } }),
      Booking.countDocuments({ createdAt: { $gte: startOfWeek } }),
      Booking.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Booking.countDocuments({ status: 'pending' }),
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      Product.countDocuments({ stock: { $lte: 5 } }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers, totalBookings, todayBookings, weekBookings, monthBookings,
        pendingBookings, totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        lowStockProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role / activate-deactivate
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, message: 'User updated', data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get monthly booking analytics
// @route   GET /api/admin/analytics/bookings
// @access  Private/Admin
const getBookingAnalytics = async (req, res, next) => {
  try {
    const data = await Booking.aggregate([
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 },
    ]);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// @desc    Get monthly revenue analytics
// @route   GET /api/admin/analytics/revenue
// @access  Private/Admin
const getRevenueAnalytics = async (req, res, next) => {
  try {
    const data = await Order.aggregate([
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 },
    ]);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// @desc    Get low stock products
// @route   GET /api/admin/inventory/low-stock
// @access  Private/Admin
const getLowStock = async (req, res, next) => {
  try {
    const products = await Product.find({ stock: { $lte: 5 } }).sort({ stock: 1 });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats, getAllUsers, updateUser, getBookingAnalytics, getRevenueAnalytics, getLowStock };
