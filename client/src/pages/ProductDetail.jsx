import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import toast from 'react-hot-toast';
import { ShoppingCart, Star, Shield, ArrowLeft } from 'lucide-react';
import { useStore } from '../store';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const setCartItems = useStore(state => state.setCartItems);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.data);
      } catch (error) {
        toast.error('Product not found');
        navigate('/store');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!user) return toast.error('Please login to add items to cart');
    try {
      const { data } = await api.post('/cart/add', { productId: product._id, qty });
      setCartItems(data.data.items);
      toast.success('Added to cart');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-brand-orange mb-6 transition-colors">
        <ArrowLeft size={20} className="mr-1" /> Back to Store
      </button>

      <div className="card overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Image Placeholder */}
          <div className="bg-gray-100 min-h-[400px] flex items-center justify-center p-8">
             <div className="text-gray-400 text-xl border-4 border-dashed border-gray-300 p-20 rounded-xl">
               Product Image Space
             </div>
          </div>

          {/* Details */}
          <div className="p-8 md:p-12 flex flex-col">
            <div className="text-brand-orange font-bold text-sm tracking-wider uppercase mb-2">
              {product.brand}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center text-yellow-400">
                <Star className="fill-current" size={20} />
                <span className="text-gray-700 ml-1 font-medium">{product.ratings || 0} ({product.numReviews} reviews)</span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-500">SKU: {product.sku}</span>
            </div>

            <div className="text-4xl font-extrabold text-brand-navy mb-6">
              ₹{product.price}
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center gap-4 mb-8 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <Shield className="text-green-500" size={24} />
              <div className="text-sm">
                <span className="font-bold block">Guaranteed Fit</span>
                <span className="text-gray-500">For supported vehicles</span>
              </div>
            </div>

            <div className="mt-auto pt-8 border-t border-gray-100 flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button 
                  className="px-4 py-3 hover:bg-gray-100 rounded-l-lg transition-colors"
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  disabled={product.stock === 0}
                >-</button>
                <span className="px-6 py-3 font-medium border-x border-gray-300">{qty}</span>
                <button 
                  className="px-4 py-3 hover:bg-gray-100 rounded-r-lg transition-colors"
                  onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  disabled={product.stock === 0}
                >+</button>
              </div>
              <button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 flex justify-center items-center gap-2 py-3 px-6 rounded-lg font-bold text-lg transition-all ${
                  product.stock === 0 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-brand-orange text-white hover:bg-orange-600 shadow-md hover:shadow-lg'
                }`}
              >
                <ShoppingCart size={20} />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
            {product.stock > 0 && product.stock <= 5 && (
              <div className="text-red-500 text-sm mt-3 font-medium">Hurry! Only {product.stock} items left in stock.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
