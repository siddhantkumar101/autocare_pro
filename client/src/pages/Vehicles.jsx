import { useState, useEffect } from 'react';
import api from '../utils/axios';
import toast from 'react-hot-toast';
import { Plus, Trash2, Car } from 'lucide-react';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    make: '', model: '', year: '', licensePlate: '', fuelType: 'petrol',
  });

  const fetchVehicles = async () => {
    try {
      const { data } = await api.get('/vehicles');
      setVehicles(data.data);
    } catch (error) {
      toast.error('Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/vehicles', formData);
      toast.success('Vehicle added successfully');
      setShowModal(false);
      setFormData({ make: '', model: '', year: '', licensePlate: '', fuelType: 'petrol' });
      fetchVehicles();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add vehicle');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      await api.delete(`/vehicles/${id}`);
      toast.success('Vehicle deleted');
      fetchVehicles();
    } catch (error) {
      toast.error('Failed to delete vehicle');
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brand-navy">My Vehicles</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Add Vehicle
        </button>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <Car size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-medium text-gray-600">No vehicles found</h2>
          <p className="text-gray-500 mt-2">Add your first vehicle to start booking services.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <div key={v._id} className="card p-6 border-t-4 border-t-brand-orange">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{v.make} {v.model}</h3>
                  <p className="text-gray-500">{v.year} • {v.fuelType}</p>
                </div>
                <button onClick={() => handleDelete(v._id)} className="text-red-500 hover:text-red-700 p-2">
                  <Trash2 size={20} />
                </button>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg flex justify-between items-center">
                <span className="text-sm text-gray-500">License Plate</span>
                <span className="font-mono font-bold tracking-wider">{v.licensePlate}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-black">
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6">Add New Vehicle</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input name="make" placeholder="Make (e.g. Honda)" required className="input-field" value={formData.make} onChange={handleChange} />
                <input name="model" placeholder="Model (e.g. Civic)" required className="input-field" value={formData.model} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input name="year" type="number" placeholder="Year" required className="input-field" value={formData.year} onChange={handleChange} />
                <input name="licensePlate" placeholder="License Plate" required className="input-field uppercase" value={formData.licensePlate} onChange={handleChange} />
              </div>
              <select name="fuelType" className="input-field" value={formData.fuelType} onChange={handleChange}>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
              </select>
              <button type="submit" className="w-full btn-primary py-3">Save Vehicle</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vehicles;
