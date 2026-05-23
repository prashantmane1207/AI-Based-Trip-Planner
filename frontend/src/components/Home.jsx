import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  
  // 🟢 State for form data
  const [formData, setFormData] = useState({ 
    destination: '', 
    days: 1, 
    budget: 'Moderate', 
    style: 'Spiritual' 
  });
  
  const navigate = useNavigate();
  const menuRef = useRef();

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) setUser(JSON.parse(loggedInUser));

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 🟢 UPDATED: Handle Plan Trip Function
  const handlePlanTrip = async () => {
    if (!formData.destination) return alert("Please enter a destination");
    
    setLoading(true);
    
    try {
      // 1. Send data to backend
      const response = await axios.post('http://localhost:8081/api/trips/generate', formData);
      
      // 2. Navigate to TripResult page with data
      // Ensure the route matches your App.jsx (usually '/trip-result' or '/result')
      navigate('/trip-result', { state: { tripData: response.data } }); 
      
    } catch (error) {
      console.error("Error generating trip:", error);
      alert("AI Service is busy or Backend is unreachable. Check console.");
    } finally { 
      setLoading(false); 
    }
  };

  const recentPlans = [
    { 
        name: "Pandharpur", 
        days: "2 Day Spiritual", 
        img: "/pandharpur.png" 
    },
    { name: "Kyoto", days: "5 Day Romantic", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800" },
    { name: "Paris", days: "3 Day Relaxing", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800" },
    { name: "Chile", days: "6 Day Adventure", img: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EFF6FF] via-white to-[#DBEAFE] font-sans text-slate-900 flex flex-col justify-between">
      
      {/* NAVBAR */}
      <header className="flex justify-between items-center px-4 md:px-12 py-5 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-blue-100 shadow-sm">
        <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            AI Trip Planner <span className="text-blue-600">Pro</span>
        </h1>
        
        <div className="flex gap-3 md:gap-6 items-center relative" ref={menuRef}>
          {user ? (
            <div className="flex items-center gap-2 md:gap-4">
              <button 
                onClick={() => navigate('/my-trips')} 
                className="px-3 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-bold text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition border border-blue-100"
              >
                ✈️ My Trips
              </button>
              
              <div className="relative">
                <div onClick={() => setShowMenu(!showMenu)} className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm md:text-lg cursor-pointer shadow-md border-2 border-white hover:scale-105 transition">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                {showMenu && (
                  <div className="absolute right-0 mt-4 w-60 bg-white rounded-xl shadow-2xl border border-blue-100 py-2 z-50 overflow-hidden">
                    <div className="px-5 py-3 border-b border-slate-50 bg-blue-50/50">
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Signed in as</p>
                      <p className="text-sm font-bold text-slate-700 truncate">{user.email}</p>
                    </div>
                    <button onClick={() => navigate('/my-trips')} className="md:hidden w-full text-left px-5 py-3 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition font-bold">✈️ My Trips</button>
                    <button onClick={() => {localStorage.removeItem('user'); window.location.reload();}} className="w-full text-left px-5 py-3 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2 font-bold transition">🚪 Logout</button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button onClick={() => navigate('/login')} className="px-5 py-2 bg-slate-900 text-white rounded-full font-bold text-xs md:text-sm shadow-lg hover:bg-slate-800 transition">Sign In</button>
          )}
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="max-w-7xl mx-auto py-12 md:py-16 px-4 md:px-8 text-center flex-grow">
        <h2 className="text-4xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
          AI Trip Planner 🌴 <br/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Plan your dream trip</span>
        </h2>
        <p className="text-slate-500 text-lg md:text-xl font-medium mb-12 md:mb-16 max-w-2xl mx-auto">
          Build professional itineraries in seconds.
        </p>

        {/* SEARCH BAR */}
        <div className="bg-white p-2 rounded-3xl md:rounded-full shadow-2xl shadow-blue-100 border border-blue-50 max-w-5xl mx-auto mb-20 relative z-10">
          <div className="flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="w-full md:flex-1 px-6 py-4 md:py-2 text-left hover:bg-slate-50 rounded-t-3xl md:rounded-l-full transition">
              <label className="block text-[10px] font-black text-blue-500 uppercase mb-1 tracking-widest">Destination</label>
              <input 
                className="w-full bg-transparent outline-none text-lg font-bold text-slate-800 placeholder:text-slate-300 truncate" 
                placeholder="Search places..." 
                onChange={(e)=>setFormData({...formData, destination: e.target.value})}
              />
            </div>
            <div className="w-full md:w-32 px-6 py-4 md:py-2 text-left hover:bg-slate-50 transition">
              <label className="block text-[10px] font-black text-blue-500 uppercase mb-1 tracking-widest">Days</label>
              <select className="w-full bg-transparent outline-none text-lg font-bold text-slate-700 cursor-pointer" onChange={(e)=>setFormData({...formData, days: parseInt(e.target.value)})}>
                {[...Array(15)].map((_, i) => <option key={i+1} value={i+1}>{i+1} Days</option>)}
              </select>
            </div>
            <div className="w-full md:w-40 px-6 py-4 md:py-2 text-left hover:bg-slate-50 transition">
              <label className="block text-[10px] font-black text-blue-500 uppercase mb-1 tracking-widest">Budget</label>
              <select className="w-full bg-transparent outline-none text-lg font-bold text-slate-700 cursor-pointer" onChange={(e)=>setFormData({...formData, budget: e.target.value})}>
                <option value="Cheap">💰 Cheap</option><option value="Moderate" defaultValue>💵 Moderate</option><option value="Luxury">💎 Luxury</option>
              </select>
            </div>
            <div className="w-full md:w-48 px-6 py-4 md:py-2 text-left hover:bg-slate-50 transition">
              <label className="block text-[10px] font-black text-blue-500 uppercase mb-1 tracking-widest">Style</label>
              <select className="w-full bg-transparent outline-none text-lg font-bold text-slate-700 cursor-pointer" onChange={(e)=>setFormData({...formData, style: e.target.value})}>
                <option value="Spiritual">🙏 Spiritual</option><option value="Adventure">🧗 Adventure</option><option value="Relaxing">🏖️ Relaxing</option>
              </select>
            </div>
            <div className="p-2 w-full md:w-auto">
              <button onClick={handlePlanTrip} disabled={loading} className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-blue-200 hover:scale-105 transition duration-300 flex items-center justify-center gap-2">
                {loading ? "..." : "Build Trip ➜"}
              </button>
            </div>
          </div>
        </div>

        {/* GALLERY */}
        <div className="text-center">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-12">Recently Created Plans</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
                {recentPlans.map((plan, i) => (
                    <div key={i} className="group cursor-pointer relative">
                        <div className="h-64 rounded-[2rem] overflow-hidden mb-5 shadow-sm border border-white group-hover:shadow-2xl transition duration-500">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 z-10"/>
                            <img src={plan.img} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={plan.name} 
                              onError={(e) => {e.target.onerror = null; e.target.src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800"}}
                            />
                        </div>
                        <h4 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition">{plan.days} Trip to {plan.name}</h4>
                        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider group-hover:text-indigo-500 transition">View Itinerary →</p>
                    </div>
                ))}
            </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-left">
             <h2 className="text-lg font-black tracking-tight">AI Trip Planner <span className="text-blue-400">Pro</span></h2>
             <p className="text-slate-400 text-xs mt-2 font-medium">© 2026 AI Trip Planner. All Rights Reserved.</p>
          </div>
          <div className="flex gap-8 text-slate-400 font-bold text-xs uppercase tracking-wide">
            <span className="cursor-pointer hover:text-white transition">Privacy</span>
            <span className="cursor-pointer hover:text-white transition">Terms</span>
            <span className="cursor-pointer hover:text-white transition">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;