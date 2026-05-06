const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get cart for current user
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    if (!cart) return res.status(200).json({ success: true, data: { items: [] } });
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, qty = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    if (product.stock < qty) return res.status(400).json({ success: false, message: 'Insufficient stock' });

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [{ productId, qty }] });
    } else {
      const itemIndex = cart.items.findIndex((i) => i.productId.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].qty += qty;
      } else {
        cart.items.push({ productId, qty });
      }
      await cart.save();
    }

    const populated = await Cart.findById(cart._id).populate('items.productId');
    res.status(200).json({ success: true, message: 'Added to cart', data: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item qty
// @route   PUT /api/cart/update
// @access  Private
const updateCart = async (req, res, next) => {
  try {
    const { productId, qty } = req.body;
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const itemIndex = cart.items.findIndex((i) => i.productId.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ success: false, message: 'Item not in cart' });

    if (qty <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].qty = qty;
    }
    await cart.save();

    const populated = await Cart.findById(cart._id).populate('items.productId');
    res.status(200).json({ success: true, message: 'Cart updated', data: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
const removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.items = cart.items.filter((i) => i.productId.toString() !== req.params.productId);
    await cart.save();

    const populated = await Cart.findById(cart._id).populate('items.productId');
    res.status(200).json({ success: true, message: 'Item removed', data: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] });
    res.status(200).json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, updateCart, removeFromCart, clearCart };
