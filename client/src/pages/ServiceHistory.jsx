import { useState, useEffect } from 'react';
import api from '../utils/axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const ServiceHistory = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const { data } = await api.get('/vehicles');
        setVehicles(data.data);
        if (data.data.length > 0) {
          setSelectedVehicle(data.data[0]._id);
        }
      } catch (error) {
        toast.error('Failed to load vehicles');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (selectedVehicle) {
      const fetchHistory = async () => {
        try {
          const { data } = await api.get(`/history/${selectedVehicle}`);
          setHistory(data.data);
        } catch (error) {
          toast.error('Failed to load service history');
        }
      };
      fetchHistory();
    }
  }, [selectedVehicle]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-brand-navy mb-8">Service History</h1>

      {vehicles.length === 0 ? (
        <p>No vehicles found. Add a vehicle first.</p>
      ) : (
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Vehicle</label>
          <select 
            className="input-field max-w-xs"
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
          >
            {vehicles.map(v => (
              <option key={v._id} value={v._id}>{v.make} {v.model} ({v.licensePlate})</option>
            ))}
          </select>
        </div>
      )}

      {selectedVehicle && (
        <div className="space-y-6">
          {history.length === 0 ? (
            <div className="card p-8 text-center text-gray-500">
              No service history found for this vehicle.
            </div>
          ) : (
            history.map((record, index) => (
              <div key={record._id} className="card p-6 relative">
                {/* Timeline line */}
                {index !== history.length - 1 && (
                  <div className="absolute left-8 top-20 bottom-[-24px] w-0.5 bg-gray-200"></div>
                )}
                
                <div className="flex items-start gap-4">
                  <div className="w-4 h-4 rounded-full bg-brand-orange mt-1 z-10 ring-4 ring-orange-100"></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold">{record.serviceType}</h3>
                      <span className="text-gray-500 text-sm">
                        {format(new Date(record.serviceDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div>
                        <span className="block text-gray-500">Mileage</span>
                        <span className="font-medium">{record.mileageAtService} km</span>
                      </div>
                      <div>
                        <span className="block text-gray-500">Cost</span>
                        <span className="font-medium">₹{record.cost}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="block text-gray-500">Next Due</span>
                        <span className="font-medium text-brand-orange">
                          {record.nextServiceDue ? format(new Date(record.nextServiceDue), 'MMM dd, yyyy') : 'N/A'}
                        </span>
                      </div>
                    </div>
                    {record.technicianNotes && (
                      <div className="bg-gray-50 p-3 rounded-md text-sm mb-3 border border-gray-100">
                        <span className="font-semibold block mb-1">Technician Notes:</span>
                        {record.technicianNotes}
                      </div>
                    )}
                    {record.partsReplaced && record.partsReplaced.length > 0 && (
                      <div className="text-sm">
                        <span className="font-semibold text-gray-700">Parts Replaced: </span>
                        {record.partsReplaced.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ServiceHistory;
