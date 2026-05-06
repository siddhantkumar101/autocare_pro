const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Create order from cart (checkout)
// @route   POST /api/orders/checkout
// @access  Private
const checkout = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod = 'cod' } = req.body;

    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = item.productId;
      if (!product || product.stock < item.qty) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product?.name}` });
      }
      const price = product.discountPrice > 0 ? product.discountPrice : product.price;
      totalAmount += price * item.qty;
      orderItems.push({ productId: product._id, name: product.name, qty: item.qty, price, image: product.images?.[0] || '' });

      // Decrement stock
      await Product.findByIdAndUpdate(product._id, { $inc: { stock: -item.qty } });
    }

    const order = await Order.create({
      userId: req.user._id, items: orderItems, totalAmount, shippingAddress, paymentMethod,
    });

    // Clear cart after order
    await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] });

    res.status(201).json({ success: true, message: 'Order placed successfully', data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get orders for current user
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { userId: req.user._id };
    const orders = await Order.find(query).populate('userId', 'name email').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId', 'name email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus, trackingNumber } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus, paymentStatus, trackingNumber },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.status(200).json({ success: true, message: 'Order updated', data: order });
  } catch (error) {
    next(error);
  }
};

module.exports = { checkout, getOrders, getOrder, updateOrderStatus };
