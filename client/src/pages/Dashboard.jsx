import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Car, Calendar, ShoppingBag, Clock } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-navy">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 mt-2">Manage your vehicles, bookings, and orders from here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/vehicles" className="card p-6 flex items-center space-x-4 hover:border-brand-orange border-2 border-transparent transition-colors">
          <div className="p-4 bg-blue-100 rounded-full text-blue-600">
            <Car size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg">My Vehicles</h3>
            <p className="text-sm text-gray-500">Manage cars</p>
          </div>
        </Link>

        <Link to="/history" className="card p-6 flex items-center space-x-4 hover:border-brand-orange border-2 border-transparent transition-colors">
          <div className="p-4 bg-green-100 rounded-full text-green-600">
            <Calendar size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg">Service History</h3>
            <p className="text-sm text-gray-500">View records</p>
          </div>
        </Link>

        <Link to="/book-service" className="card p-6 flex items-center space-x-4 hover:border-brand-orange border-2 border-transparent transition-colors">
          <div className="p-4 bg-purple-100 rounded-full text-purple-600">
            <Clock size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg">Book Service</h3>
            <p className="text-sm text-gray-500">New appointment</p>
          </div>
        </Link>

        <Link to="/orders" className="card p-6 flex items-center space-x-4 hover:border-brand-orange border-2 border-transparent transition-colors">
          <div className="p-4 bg-orange-100 rounded-full text-brand-orange">
            <ShoppingBag size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg">My Orders</h3>
            <p className="text-sm text-gray-500">Track parts</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
