import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800">✈️ My Saved Trips</h1>
            <button onClick={() => navigate('/')} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100 font-bold">
                ⬅ Back to Home
            </button>
        </div>

        {loading ? (
            <div className="text-center mt-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
        ) : trips.length === 0 ? (
            <div className="text-center mt-20 bg-white p-10 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-xl text-slate-600 font-bold mb-4">No trips saved yet.</p>
                <button onClick={() => navigate('/')} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
                    Plan a New Trip
                </button>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.map((trip) => (
                    <div key={trip.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition duration-300 group">
                        <div className="h-48 bg-slate-200 relative overflow-hidden">
                             <img 
                                src={`https://source.unsplash.com/800x600/?${trip.destination}`} 
                                className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                alt={trip.destination} 
                                onError={(e) => e.target.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800"}
                             />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                <h2 className="text-2xl font-bold text-white tracking-tight">{trip.destination}</h2>
                             </div>
                        </div>
                        <div className="p-6">
                            <p className="text-slate-500 font-medium mb-6 line-clamp-2">
                                {trip.itinerary.days.length} Day Trip • {trip.itinerary.hotels.length} Hotels Recommended
                            </p>
                            <button 
                                onClick={() => navigate('/trip-result', { state: { tripData: trip.itinerary } })}
                                className="w-full py-3 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition"
                            >
                                View Itinerary ➜
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