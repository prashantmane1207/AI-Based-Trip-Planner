import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';

const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      alert("Please login to view your trips.");
      navigate('/login');
      return;
    }

    const fetchTrips = async () => {
      try {
        const res = await axios.get(`http://localhost:8081/api/trips/user/${user.email}`);
        setTrips(res.data);
      } catch (err) {
        console.error("Error fetching trips:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [navigate, user]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 md:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">My saved trips</h1>
          <button onClick={() => navigate('/')} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition flex items-center gap-1.5">
            <ArrowLeft size={15} /> Back to home
          </button>
        </div>

        {loading ? (
          <div className="text-center mt-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500 mx-auto"></div>
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center mt-16 bg-white p-10 rounded-2xl border border-slate-200 max-w-lg mx-auto">
            <p className="text-lg text-slate-700 font-semibold mb-2">No trips saved yet</p>
            <p className="text-slate-500 text-sm mb-6">Plan a trip and save it here to find it again later.</p>
            <button onClick={() => navigate('/')} className="px-5 py-2.5 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600 transition">
              Plan a new trip
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {trips.map((trip) => (
              <div key={trip.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition">
                <div className="h-40 bg-slate-100 relative overflow-hidden">
                  <img
                    src={`https://source.unsplash.com/800x600/?${trip.destination}`}
                    className="w-full h-full object-cover"
                    alt={trip.destination}
                    onError={(e) => e.target.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800"}
                  />
                </div>
                <div className="p-5">
                  <h2 className="text-base font-semibold text-slate-800 mb-1.5">{trip.destination}</h2>
                  <p className="text-sm text-slate-500 mb-4 flex items-center gap-1.5">
                    <MapPin size={13} />
                    {trip.itinerary.days.length} day trip · {trip.itinerary.hotels.length} hotels
                  </p>
                  <button
                    onClick={() => navigate('/trip-result', { state: { tripData: trip.itinerary } })}
                    className="w-full py-2.5 bg-brand-50 text-brand-700 font-medium rounded-lg hover:bg-brand-100 transition text-sm"
                  >
                    View itinerary
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTrips;
