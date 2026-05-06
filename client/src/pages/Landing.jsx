import { Link } from 'react-router-dom';
import { ShieldCheck, Wrench, Clock, Settings } from 'lucide-react';

const Landing = () => {
  return (
    <div className="bg-brand-light">
      {/* Hero Section */}
      <div className="bg-brand-navy text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            Premium Auto Care <span className="text-brand-orange">&</span> Parts
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-300 mb-10">
            Your one-stop destination for professional car servicing and high-quality auto parts.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/book-service" className="btn-primary text-lg px-8 py-3">
              Book Service
            </Link>
            <Link to="/store" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-brand-navy transition-colors text-lg">
              Shop Parts
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-brand-navy">Why Choose AutoCare Pro?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Wrench, title: 'Expert Technicians', desc: 'Certified professionals handling your vehicle.' },
            { icon: ShieldCheck, title: 'Genuine Parts', desc: '100% authentic OEM and aftermarket parts.' },
            { icon: Clock, title: 'Fast Service', desc: 'Quick turnaround time for all standard services.' },
            { icon: Settings, title: 'Advanced Diagnostics', desc: 'State-of-the-art diagnostic equipment.' },
          ].map((feature, idx) => (
            <div key={idx} className="card p-6 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="inline-flex p-4 rounded-full bg-orange-100 text-brand-orange mb-4">
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-brand-navy">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing;
