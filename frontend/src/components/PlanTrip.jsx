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
      <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
        <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Planning your trip to {destination}...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-xl text-red-600">
          <h2 className="text-2xl font-bold mb-2">Oops!</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
       {/* Button Container */}
       <div className="flex gap-4 mb-6">
           <button 
             onClick={() => navigate('/')}
             className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-600"
           >
             ← Plan Another Trip
           </button>

           {/* ✅ 3. The Save Button (Correctly placed inside JSX) */}
           <button 
                onClick={handleSaveTrip} 
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold shadow-md"
            >
                💾 Save This Trip
            </button>
       </div>
       
       {trip && <TripResult tripData={trip} />}
    </div>
  );
};

export default PlanTrip;