import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, LogOut, Menu } from 'lucide-react';

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

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

  const handlePlanTrip = async () => {
    if (!formData.destination) return alert("Please enter a destination");

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8081/api/trips/generate', formData);
      navigate('/trip-result', { state: { tripData: response.data } });
    } catch (error) {
      console.error("Error generating trip:", error);
      alert("AI Service is busy or Backend is unreachable. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const recentPlans = [
    { name: "Pandharpur", days: "2 Day Spiritual", img: "/pandharpur.png" },
    { name: "Kyoto", days: "5 Day Romantic", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800" },
    { name: "Paris", days: "3 Day Relaxing", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800" },
    { name: "Chile", days: "6 Day Adventure", img: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* NAVBAR */}
      <header className="flex justify-between items-center px-4 md:px-8 h-16 bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-500 rounded-md flex items-center justify-center">
            <MapPin size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900">Waypoint</span>
        </div>

        <div className="flex items-center gap-3 relative" ref={menuRef}>
          {user ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/my-trips')}
                className="hidden sm:block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md transition"
              >
                My Trips
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="w-9 h-9 bg-brand-500 text-white rounded-full flex items-center justify-center font-semibold text-sm"
                >
                  {user.email.charAt(0).toUpperCase()}
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-medium text-slate-800 truncate">{user.email}</p>
                    </div>
                    <button onClick={() => navigate('/my-trips')} className="sm:hidden w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                      <Menu size={14} /> My Trips
                    </button>
                    <button onClick={() => { localStorage.removeItem('user'); window.location.reload(); }} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                      <LogOut size={14} /> Log out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button onClick={() => navigate('/login')} className="px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-md hover:bg-brand-600 transition">
              Sign in
            </button>
          )}
        </div>
      </header>

      {/* HERO */}
      <main className="max-w-5xl mx-auto w-full px-4 md:px-6 py-12 md:py-16 flex-grow">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-3 tracking-tight">
            Plan your next trip in seconds
          </h1>
          <p className="text-slate-500 text-base md:text-lg max-w-xl mx-auto">
            Enter a destination and we'll put together a day-by-day itinerary, hotel picks, and a budget estimate.
          </p>
        </div>

        {/* SEARCH CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6 max-w-4xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-[1.6fr_0.8fr_1fr_1fr_auto] gap-4 md:gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Destination</label>
              <input
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 text-slate-800 placeholder:text-slate-400 transition"
                placeholder="Where do you want to go?"
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Days</label>
              <select className="w-full px-3 py-2.5 border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 text-slate-800 cursor-pointer" onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value) })}>
                {[...Array(15)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1} {i + 1 === 1 ? 'day' : 'days'}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Budget</label>
              <select className="w-full px-3 py-2.5 border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 text-slate-800 cursor-pointer" onChange={(e) => setFormData({ ...formData, budget: e.target.value })}>
                <option value="Cheap">Cheap</option>
                <option value="Moderate">Moderate</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Style</label>
              <select className="w-full px-3 py-2.5 border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 text-slate-800 cursor-pointer" onChange={(e) => setFormData({ ...formData, style: e.target.value })}>
                <option value="Spiritual">Spiritual</option>
                <option value="Adventure">Adventure</option>
                <option value="Relaxing">Relaxing</option>
              </select>
            </div>
            <button
              onClick={handlePlanTrip}
              disabled={loading}
              className="px-6 py-2.5 bg-brand-500 text-white font-medium rounded-lg hover:bg-brand-600 transition disabled:opacity-60 whitespace-nowrap"
            >
              {loading ? "Planning..." : "Plan trip"}
            </button>
          </div>
        </div>

        {/* GALLERY */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-5">Recently created plans</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
            {recentPlans.map((plan, i) => (
              <div key={i} className="group cursor-pointer bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition">
                <div className="h-40 overflow-hidden">
                  <img
                    src={plan.img}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    alt={plan.name}
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800" }}
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-slate-800">{plan.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{plan.days}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-10">
        <div className="max-w-5xl mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">© 2026 Waypoint. All rights reserved.</p>
          <div className="flex gap-6 text-slate-500 text-sm">
            <span className="cursor-pointer hover:text-slate-800 transition">Privacy</span>
            <span className="cursor-pointer hover:text-slate-800 transition">Terms</span>
            <span className="cursor-pointer hover:text-slate-800 transition">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
