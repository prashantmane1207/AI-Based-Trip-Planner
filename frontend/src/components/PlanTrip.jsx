import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TripResult from './TripResult';
import { FaSpinner } from 'react-icons/fa';

const PlanTrip = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the data passed from Home.jsx
  const { destination, days, budget } = location.state || {};

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If no destination, go back home
    if (!destination) {
      navigate('/');
      return;
    }

    const fetchTrip = async () => {
      try {
        console.log("Fetching trip for:", destination);
        
        // Call Backend
        const response = await fetch(
          `http://localhost:8080/api/trip/generate?destination=${destination}&days=${days}&budget=${budget}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch trip");
        }

        const data = await response.json();
        setTrip(data);
      } catch (err) {
        console.error(err);
        setError("Could not generate trip. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [destination, days, budget, navigate]);

  // ✅ 2. The Save Function (Correctly placed inside the component)
  const handleSaveTrip = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        alert("Please login to save trips!");
        navigate('/login');
        return;
    }

    const tripData = {
        userId: userId,
        destination: destination,
        startDate: new Date().toISOString().split('T')[0], // Today's date
        itinerary: trip
    };

    try {
        const response = await fetch('http://localhost:8080/api/trip/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tripData)
        });

        if (response.ok) {
            alert("Trip Saved Successfully!");
        } else {
            alert("Failed to save trip.");
        }
    } catch (e) {
        console.error("Save error:", e);
        alert("Could not connect to server.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <FaSpinner className="animate-spin text-3xl text-brand-500 mb-4" />
        <h2 className="text-lg font-semibold text-slate-800">Planning your trip to {destination}...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white rounded-xl border border-red-100">
          <h2 className="text-xl font-semibold mb-2 text-red-600">Something went wrong</h2>
          <p className="text-slate-500">{error}</p>
          <button onClick={() => navigate('/')} className="mt-5 px-5 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition">
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
       {/* Button Container */}
       <div className="flex gap-3 mb-6">
           <button
             onClick={() => navigate('/')}
             className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
           >
             ← Plan another trip
           </button>

           <button
                onClick={handleSaveTrip}
                className="px-5 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition"
            >
                Save this trip
            </button>
       </div>

       {trip && <TripResult tripData={trip} />}
    </div>
  );
};

export default PlanTrip;