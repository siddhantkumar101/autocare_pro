import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User as UserIcon, LogOut, Wrench } from 'lucide-react';
import { useStore } from '../store';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const cartItems = useStore((state) => state.cartItems);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-brand-navy text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Wrench className="h-8 w-8 text-brand-orange" />
            <span className="font-heading font-bold text-xl tracking-tight">AutoCare Pro</span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link to="/store" className="hover:text-brand-orange transition-colors">Store</Link>
            {user && (
              <>
                <Link to="/vehicles" className="hover:text-brand-orange transition-colors">Vehicles</Link>
                <Link to="/book-service" className="hover:text-brand-orange transition-colors">Book Service</Link>
              </>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-brand-orange font-medium">Admin Panel</Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 hover:text-brand-orange transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-brand-orange text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="flex items-center space-x-1 hover:text-brand-orange transition-colors">
                  <UserIcon className="h-5 w-5" />
                  <span className="hidden sm:inline">{user.name}</span>
                </Link>
                <button onClick={handleLogout} className="p-2 hover:text-red-400 transition-colors">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login" className="hover:text-brand-orange transition-colors font-medium">Login</Link>
                <Link to="/register" className="bg-brand-orange px-4 py-1 rounded-md font-medium hover:bg-orange-600 transition-colors">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
