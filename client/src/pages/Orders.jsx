import { useState, useEffect } from 'react';
import api from '../utils/axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Package, Truck, CheckCircle } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        setOrders(data.data);
      } catch (error) {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="p-10 text-center">Loading orders...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-brand-navy mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="card p-12 text-center">
          <Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-medium text-gray-600 mb-2">No orders yet</h2>
          <p className="text-gray-500">You haven't placed any orders.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="card overflow-hidden">
              <div className="bg-gray-50 p-4 border-b flex flex-wrap justify-between items-center gap-4">
                <div className="flex gap-6">
                  <div>
                    <span className="block text-xs text-gray-500 uppercase">Order Placed</span>
                    <span className="font-medium text-sm">{format(new Date(order.createdAt), 'MMM dd, yyyy')}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 uppercase">Total</span>
                    <span className="font-medium text-sm">₹{order.totalAmount}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 uppercase">Order #</span>
                    <span className="font-medium text-sm">{order._id.substring(order._id.length - 8)}</span>
                  </div>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {order.items.map(item => (
                    <div key={item.productId} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="font-bold">{item.name}</div>
                        <div className="text-sm text-gray-500">Qty: {item.qty} | Price: ₹{item.price}</div>
                      </div>
                      <div className="font-bold text-lg">₹{item.price * item.qty}</div>
                    </div>
                  ))}
                </div>

                {order.trackingNumber && (
                  <div className="mt-6 pt-4 border-t flex items-center gap-2 text-brand-orange font-medium">
                    <Truck size={20} />
                    <span>Tracking Number: {order.trackingNumber}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
