import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import toast from 'react-hot-toast';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useStore } from '../store';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const setCartItems = useStore(state => state.setCartItems);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const { data } = await api.get('/cart');
      setCart(data.data);
      setCartItems(data.data.items || []);
    } catch (error) {
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQty = async (productId, qty) => {
    try {
      const { data } = await api.put('/cart/update', { productId, qty });
      setCart(data.data);
      setCartItems(data.data.items);
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (productId) => {
    try {
      const { data } = await api.delete(`/cart/remove/${productId}`);
      setCart(data.data);
      setCartItems(data.data.items);
      toast.success('Item removed');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  if (loading) return <div className="p-10 text-center">Loading cart...</div>;

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => sum + (item.productId.price * item.qty), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-brand-navy mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="card p-12 text-center flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag size={48} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-brand-navy mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added any parts to your cart yet.</p>
          <Link to="/store" className="btn-primary">Continue Shopping</Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-4">
            {items.map((item) => (
              <div key={item.productId._id} className="card p-4 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-24 h-24 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center text-xs text-gray-400">
                  Img
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <Link to={`/store/${item.productId._id}`} className="font-bold hover:text-brand-orange text-lg block mb-1">
                    {item.productId.name}
                  </Link>
                  <div className="text-gray-500 text-sm">SKU: {item.productId.sku}</div>
                </div>
                <div className="text-xl font-bold w-24 text-center">
                  ₹{item.productId.price}
                </div>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button 
                    onClick={() => updateQty(item.productId._id, item.qty - 1)}
                    className="px-3 py-1 hover:bg-gray-100"
                  >-</button>
                  <span className="px-3 py-1 border-x border-gray-300 w-10 text-center">{item.qty}</span>
                  <button 
                    onClick={() => updateQty(item.productId._id, item.qty + 1)}
                    className="px-3 py-1 hover:bg-gray-100"
                  >+</button>
                </div>
                <div className="text-xl font-bold w-24 text-center">
                  ₹{item.productId.price * item.qty}
                </div>
                <button 
                  onClick={() => removeItem(item.productId._id)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          <div className="w-full lg:w-80">
            <div className="card p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6 border-b pb-4">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.length} items)</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span>₹{subtotal}</span>
                </div>
              </div>
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full btn-primary flex items-center justify-center gap-2 py-3"
              >
                Proceed to Checkout <ArrowRight size={20} />
              </button>
              <div className="mt-4 text-center">
                <Link to="/store" className="text-brand-orange hover:underline text-sm font-medium">
                  or Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
