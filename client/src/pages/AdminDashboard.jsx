import { useState, useEffect } from 'react';
import api from '../utils/axios';
import { Users, Calendar as CalendarIcon, DollarSign, PackageOpen, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [bookingAnalytics, setBookingAnalytics] = useState([]);
  const [revenueAnalytics, setRevenueAnalytics] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, bookingsRes, revenueRes, stockRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/analytics/bookings'),
          api.get('/admin/analytics/revenue'),
          api.get('/admin/inventory/low-stock'),
        ]);

        setStats(statsRes.data.data);
        
        // Format analytics for charts
        setBookingAnalytics(bookingsRes.data.data.map(d => ({
          name: `${MONTHS[d._id.month - 1]} ${d._id.year}`,
          bookings: d.count
        })));
        
        setRevenueAnalytics(revenueRes.data.data.map(d => ({
          name: `${MONTHS[d._id.month - 1]} ${d._id.year}`,
          revenue: d.revenue
        })));

        setLowStock(stockRes.data.data);
      } catch (error) {
        toast.error('Failed to load admin dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdminData();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading dashboard...</div>;
  if (!stats) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brand-navy">Admin Dashboard</h1>
        <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm">
          System Overview
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 border-l-4 border-l-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <h3 className="text-3xl font-bold text-brand-navy mt-1">{stats.totalUsers}</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="card p-6 border-l-4 border-l-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <h3 className="text-3xl font-bold text-brand-navy mt-1">₹{stats.totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-lg text-green-600">
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        <div className="card p-6 border-l-4 border-l-purple-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Bookings</p>
              <h3 className="text-3xl font-bold text-brand-navy mt-1">{stats.pendingBookings}</h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
              <CalendarIcon size={24} />
            </div>
          </div>
        </div>

        <div className="card p-6 border-l-4 border-l-red-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Low Stock Items</p>
              <h3 className="text-3xl font-bold text-brand-navy mt-1">{stats.lowStockProducts}</h3>
            </div>
            <div className="p-3 bg-red-100 rounded-lg text-red-600">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Chart */}
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-6">Revenue Over Time</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueAnalytics}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#FF6B35" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bookings Chart */}
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-6">Bookings Over Time</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingAnalytics}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="bookings" fill="#0A0F1E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <PackageOpen className="text-brand-orange" /> Inventory Alerts
        </h2>
        {lowStock.length === 0 ? (
          <p className="text-gray-500">All products have sufficient stock levels.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600 text-sm">
                  <th className="p-3 font-medium rounded-tl-lg">Product</th>
                  <th className="p-3 font-medium">SKU</th>
                  <th className="p-3 font-medium">Category</th>
                  <th className="p-3 font-medium rounded-tr-lg">Current Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {lowStock.map(product => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="p-3 font-medium text-brand-navy">{product.name}</td>
                    <td className="p-3 text-sm text-gray-500">{product.sku}</td>
                    <td className="p-3 text-sm">{product.category}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock === 0 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {product.stock} left
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
