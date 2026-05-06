import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import toast from 'react-hot-toast';
import { useStore } from '../store';

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const clearCart = useStore(state => state.clearCart);
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: '', address: '', city: '', state: '', pincode: '', phone: ''
  });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await api.get('/cart');
        if (!data.data || !data.data.items || data.data.items.length === 0) {
          toast.error('Cart is empty');
          navigate('/cart');
          return;
        }
        setCart(data.data);
      } catch (error) {
        toast.error('Failed to load cart');
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [navigate]);

  const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPlacingOrder(true);
    try {
      await api.post('/orders/checkout', { shippingAddress: address, paymentMethod: 'cod' });
      toast.success('Order placed successfully!');
      clearCart();
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  const items = cart?.items || [];
  const total = items.reduce((sum, item) => sum + (item.productId.price * item.qty), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-brand-navy mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form */}
        <div className="flex-1">
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input required name="fullName" value={address.fullName} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input required name="phone" value={address.phone} onChange={handleChange} className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input required name="address" value={address.address} onChange={handleChange} className="input-field" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input required name="city" value={address.city} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input required name="state" value={address.state} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
                  <input required name="pincode" value={address.pincode} onChange={handleChange} className="input-field" />
                </div>
              </div>

              <h2 className="text-xl font-bold mt-8 mb-4">Payment Method</h2>
              <div className="p-4 border-2 border-brand-orange rounded-lg bg-orange-50 flex items-center">
                <input type="radio" checked readOnly className="h-4 w-4 text-brand-orange focus:ring-brand-orange" />
                <label className="ml-3 font-bold text-brand-navy">Cash on Delivery (COD)</label>
              </div>
            </form>
          </div>
        </div>

        {/* Summary */}
        <div className="w-full lg:w-96">
          <div className="card p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6 border-b pb-4">Order Summary</h2>
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item.productId._id} className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-500">{item.qty}x</span>
                    <span className="truncate w-40">{item.productId.name}</span>
                  </div>
                  <span className="font-bold">₹{item.productId.price * item.qty}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between font-bold text-xl mt-2 pt-2 border-t">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
            <button 
              type="submit" 
              form="checkout-form"
              disabled={placingOrder}
              className={`w-full btn-primary py-3 ${placingOrder ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {placingOrder ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
