import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import toast from 'react-hot-toast';

const SERVICES = ['Oil Change', 'Tire Rotation', 'Brake Service', 'Full Inspection', 'AC Service', 'Engine Tune-Up'];

const BookService = () => {
  const [step, setStep] = useState(1);
  const [vehicles, setVehicles] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [formData, setFormData] = useState({
    vehicleId: '', serviceType: '', date: '', timeSlot: '', notes: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const { data } = await api.get('/vehicles');
        setVehicles(data.data);
      } catch (err) { toast.error('Failed to load vehicles'); }
    };
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (formData.date) {
      const fetchSlots = async () => {
        try {
          const { data } = await api.get(`/bookings/available-slots?date=${formData.date}`);
          setAvailableSlots(data.data);
        } catch (err) { toast.error('Failed to load time slots'); }
      };
      fetchSlots();
    }
  }, [formData.date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/bookings', formData);
      toast.success('Service booked successfully!');
      navigate('/history'); // Redirect to history/bookings
    } catch (err) {
      toast.error('Failed to book service');
    }
  };

  const isStepValid = () => {
    if (step === 1) return !!formData.vehicleId;
    if (step === 2) return !!formData.serviceType;
    if (step === 3) return !!formData.date && !!formData.timeSlot;
    return true;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Book a Service</h1>
      
      {/* Stepper Header */}
      <div className="flex justify-between items-center mb-10 relative">
        <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
        <div className={`absolute left-0 top-1/2 h-1 bg-brand-orange -z-10 transform -translate-y-1/2 transition-all duration-300`} style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
        
        {[1, 2, 3, 4].map(s => (
          <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-colors ${step >= s ? 'bg-brand-orange' : 'bg-gray-300'}`}>
            {s}
          </div>
        ))}
      </div>

      <div className="card p-8 min-h-[400px] flex flex-col justify-between">
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Select Vehicle</h2>
            {vehicles.length === 0 ? (
              <p className="text-red-500">Please add a vehicle first in your dashboard.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vehicles.map(v => (
                  <div 
                    key={v._id} 
                    onClick={() => setFormData({ ...formData, vehicleId: v._id })}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${formData.vehicleId === v._id ? 'border-brand-orange bg-orange-50' : 'border-gray-200 hover:border-brand-orange'}`}
                  >
                    <div className="font-bold text-lg">{v.make} {v.model}</div>
                    <div className="text-gray-500">{v.licensePlate}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Select Service Type</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SERVICES.map(s => (
                <div 
                  key={s} 
                  onClick={() => setFormData({ ...formData, serviceType: s })}
                  className={`p-4 border-2 rounded-lg cursor-pointer text-center font-medium transition-colors ${formData.serviceType === s ? 'border-brand-orange bg-brand-orange text-white' : 'border-gray-200 hover:border-brand-orange'}`}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Select Date & Time</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input 
                type="date" 
                className="input-field" 
                min={new Date().toISOString().split('T')[0]}
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value, timeSlot: '' })}
              />
            </div>
            {formData.date && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Time Slots</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {availableSlots.map(slot => (
                    <div 
                      key={slot}
                      onClick={() => setFormData({ ...formData, timeSlot: slot })}
                      className={`p-2 border rounded-md text-center text-sm cursor-pointer ${formData.timeSlot === slot ? 'bg-brand-navy text-white border-brand-navy' : 'hover:border-brand-navy border-gray-300'}`}
                    >
                      {slot}
                    </div>
                  ))}
                  {availableSlots.length === 0 && <p className="col-span-full text-red-500 text-sm">No slots available for this date.</p>}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Review & Confirm</h2>
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Vehicle</span>
                <span className="font-bold">{vehicles.find(v => v._id === formData.vehicleId)?.make}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Service</span>
                <span className="font-bold">{formData.serviceType}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Date</span>
                <span className="font-bold">{formData.date}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Time</span>
                <span className="font-bold">{formData.timeSlot}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes (Optional)</label>
                <textarea 
                  className="input-field" 
                  rows="3" 
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                ></textarea>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t">
          <button 
            className={`btn-outline ${step === 1 ? 'invisible' : ''}`}
            onClick={() => setStep(s => s - 1)}
          >
            Back
          </button>
          
          {step < 4 ? (
            <button 
              className="btn-primary" 
              disabled={!isStepValid()}
              onClick={() => setStep(s => s + 1)}
            >
              Next Step
            </button>
          ) : (
            <button className="btn-primary bg-green-600 hover:bg-green-700" onClick={handleSubmit}>
              Confirm Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookService;
