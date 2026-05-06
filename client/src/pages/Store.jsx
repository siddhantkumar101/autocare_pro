import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { Search, Filter, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../store';
import { useAuth } from '../context/AuthContext';

const Store = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', search: '' });
  const setCartItems = useStore(state => state.setCartItems);
  const { user } = useAuth();

  const categories = ['All', 'Engine Parts', 'Brakes', 'Electrical', 'Filters', 'Tires & Wheels', 'Lighting', 'Fluids & Oils', 'Accessories'];

  const fetchProducts = async () => {
    try {
      let url = '/products';
      const params = new URLSearchParams();
      if (filters.category && filters.category !== 'All') params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (params.toString()) url += `?${params.toString()}`;

      const { data } = await api.get(url);
      setProducts(data.data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const handleAddToCart = async (productId) => {
    if (!user) return toast.error('Please login to add items to cart');
    try {
      const { data } = await api.post('/cart/add', { productId, qty: 1 });
      setCartItems(data.data.items);
      toast.success('Added to cart');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-brand-navy">Auto Parts Store</h1>
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Search parts, brands..." 
            className="input-field pl-10"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="card p-5 sticky top-24">
            <h3 className="font-bold flex items-center gap-2 mb-4 border-b pb-2">
              <Filter size={18} /> Categories
            </h3>
            <ul className="space-y-2">
              {categories.map(cat => (
                <li key={cat}>
                  <button 
                    onClick={() => setFilters({ ...filters, category: cat })}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      (filters.category === cat || (cat === 'All' && !filters.category)) 
                        ? 'bg-brand-orange text-white' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="text-center py-20">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 card">No products found matching your criteria.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product._id} className="card flex flex-col">
                  <Link to={`/store/${product._id}`} className="block h-48 bg-gray-100 relative group overflow-hidden">
                    {/* Placeholder image since we don't have real uploads in seed */}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Product Image]
                    </div>
                    {product.stock <= 5 && product.stock > 0 && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        Only {product.stock} left
                      </span>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-bold bg-red-600 px-4 py-1 rounded">Out of Stock</span>
                      </div>
                    )}
                  </Link>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="text-xs text-brand-orange font-bold mb-1">{product.brand}</div>
                    <Link to={`/store/${product._id}`} className="font-bold text-lg hover:text-brand-orange line-clamp-2 mb-2 flex-1">
                      {product.name}
                    </Link>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xl font-extrabold">₹{product.price}</span>
                      <button 
                        onClick={() => handleAddToCart(product._id)}
                        disabled={product.stock === 0}
                        className={`p-2 rounded-full ${product.stock === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-brand-navy text-white hover:bg-slate-800'}`}
                      >
                        <ShoppingCart size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Store;
