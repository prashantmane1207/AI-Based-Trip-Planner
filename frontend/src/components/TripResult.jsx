import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jsPDF';
import axios from 'axios';

const TripResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tripData } = location.state || {};
  const [saving, setSaving] = useState(false);

  // 🟢 BUDGET CALCULATOR
  const calculateBudget = () => {
    let totalActivityCost = 0;
    let totalFoodCost = 0;
    
    // Safety check added to prevent calculation crashes
    tripData?.days?.forEach(day => {
        day?.activities?.forEach(act => {
            let cost = parseInt(act?.cost) || 0;
            const nameLower = act?.name?.toLowerCase() || "";
            
            if (nameLower.match(/(temple|mandir|church|mosque|dargah|gurudwara|shrine)/i)) {
                cost = 0;
            }

            if (act?.type === 'Food') {
                totalFoodCost += cost;
            } else {
                totalActivityCost += cost;
            }
        });
    });

    const numberOfDays = tripData?.days?.length || 1;
    if (totalFoodCost < (numberOfDays * 300)) {
        totalFoodCost = numberOfDays * 500; 
    }

    const hotelPriceString = tripData?.hotels?.[0]?.price || "0";
    const hotelDailyCost = parseInt(hotelPriceString.replace(/\D/g, '')) || 3000;
    const totalHotelCost = hotelDailyCost * (numberOfDays - 1 || 1); 

    return { grandTotal: totalActivityCost + totalFoodCost + totalHotelCost, food: totalFoodCost, places: totalActivityCost, hotel: totalHotelCost };
  };

  const budgetStats = tripData ? calculateBudget() : { grandTotal: 0 };

  // 🟢 FIXED: Google Maps Link Logic (Uses standard search URL)
  const openGoogleMaps = (placeName) => {
    const query = encodeURIComponent(`${placeName} ${tripData?.destination}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const openBookingSite = (query) => {
    const encodedQuery = encodeURIComponent(query);
    window.open(`https://www.booking.com/searchresults.html?ss=${encodedQuery}`, '_blank');
  };

  const handleDownloadPDF = () => {
    const input = document.getElementById('itinerary-content');
    if (!input) return;

    const originalStyle = input.style.paddingBottom;
    input.style.paddingBottom = "50px";

    html2canvas(input, { 
        scale: 2, 
        useCORS: true,
        scrollY: -window.scrollY 
    }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; 
        const pageHeight = 295; 
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
            position = position - 295; 
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        pdf.save(`Trip_to_${tripData?.destination}.pdf`);
        input.style.paddingBottom = originalStyle;
    });
  };

  const handleSaveTrip = async () => {
    setSaving(true);
    const user = JSON.parse(localStorage.getItem('user'));
    
    // 🟢 User Feedback for Login
    if (!user) {
        setSaving(false);
        const choice = window.confirm("You must be logged in to save a trip. Go to Login?");
        if(choice) navigate('/login'); 
        return;
    }

    try {
        await axios.post('http://localhost:8081/api/trips/save', {
            userId: user.email, 
            destination: tripData?.destination,
            itinerary: tripData
        });
        alert("Trip Saved Successfully! ✅ Check 'My Trips' to view it.");
    } catch (e) { 
        console.error(e);
        alert("Error saving trip. Check console for details."); 
    } finally { 
        setSaving(false); 
    }
  };

  // 🟢 GATEKEEPER: Prevents rendering if data is null
  if (!tripData || !tripData.days || tripData.days.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center px-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-6"></div>
            
            {/* 🟢 THIS IS THE LINE YOU ASKED ABOUT */}
            <h2 className="text-2xl font-bold text-slate-800">
                Planning your Trip to {location.state?.tripData?.destination || "your destination"}...
            </h2>

            <p className="text-slate-500 mt-2 max-w-md">
                We are generating detailed descriptions (3-4 lines) for every place. <br/>
                <span className="font-semibold text-orange-500">This can take up to 15-20 seconds. Please wait.</span>
            </p>
            <button onClick={() => navigate('/')} className="mt-8 px-6 py-2 bg-white border border-slate-300 rounded-full text-slate-600 hover:bg-slate-100 transition">
                Cancel & Go Back
            </button>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EFF6FF] via-[#F8FAFC] to-[#E0E7FF] w-full max-w-[100vw] overflow-x-hidden flex flex-col justify-between font-sans">
      
      <div className="max-w-5xl mx-auto py-10 px-6 md:px-10 w-full">
        
        {/* Navigation Buttons */}
        <div className="flex flex-wrap gap-4 mb-8 justify-between items-center">
            <button onClick={() => navigate('/')} className="px-6 py-2.5 bg-white text-slate-700 font-semibold rounded-xl shadow-sm hover:bg-slate-50 border border-slate-200 text-sm transition tracking-wide">
                ⬅ Back
            </button>
            <div className="flex gap-4">
                <button onClick={handleDownloadPDF} className="px-6 py-2.5 bg-white text-blue-600 font-bold rounded-xl shadow-sm hover:bg-blue-50 border border-blue-100 text-sm transition tracking-wide">
                    📥 PDF
                </button>
                <button onClick={handleSaveTrip} disabled={saving} className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 text-sm transition hover:-translate-y-0.5 tracking-wide">
                    {saving ? "Saving..." : "💾 Save"} 
                </button>
            </div>
        </div>

        <div id="itinerary-content" className="p-4 md:p-8 bg-white/50 backdrop-blur-sm rounded-[2.5rem]">
            
            {/* Header Image */}
            <div className="relative h-56 md:h-72 rounded-[2rem] overflow-hidden mb-12 shadow-2xl group">
                <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200" className="w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="Cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-8 md:p-12">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg">Trip to {tripData?.destination}</h1>
                </div>
            </div>

            {/* Budget Totals Section */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 mb-12">
                <div className="flex items-center gap-3 mb-8">
                    <span className="text-3xl">💰</span>
                    <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Trip Budget & Totals</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                        <p className="text-[11px] text-orange-500 uppercase font-extrabold tracking-widest mb-2">Hotel Stay</p>
                        <p className="text-3xl font-bold text-orange-700">₹{budgetStats?.hotel}</p>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                        <p className="text-[11px] text-blue-500 uppercase font-extrabold tracking-widest mb-2">Food</p>
                        <p className="text-3xl font-bold text-blue-700">₹{budgetStats?.food}</p>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                        <p className="text-[11px] text-purple-500 uppercase font-extrabold tracking-widest mb-2">Entry & Travel</p>
                        <p className="text-3xl font-bold text-purple-700">₹{budgetStats?.places}</p>
                    </div>
                    <div className="bg-green-50 p-6 rounded-2xl border border-green-200 ring-1 ring-green-100">
                        <p className="text-[11px] text-green-600 uppercase font-extrabold tracking-widest mb-2">Total Est.</p>
                        <p className="text-4xl font-black text-green-700">₹{budgetStats?.grandTotal}</p>
                    </div>
                </div>
            </div>

            {/* Recommended Hotels Section */}
            <div className="mb-12">
                <h2 className="text-2xl font-extrabold text-slate-800 mb-6 tracking-tight">🏨 Recommended Stays</h2>
                
                {tripData?.hotels && tripData?.hotels.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {tripData.hotels.map((hotel, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-lg transition duration-300">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-slate-800 text-xl tracking-tight">{hotel?.name}</h4>
                                        <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">⭐ {hotel?.rating}</span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-500">📍 {hotel?.address}</p>
                                </div>

                                <div className="mt-6 pt-6 border-t border-slate-100">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-xl font-bold text-slate-900">{hotel?.price} <span className="text-xs font-medium text-slate-400">/ night</span></span>
                                    </div>
                                    
                                    <div className="flex gap-3">
                                        <button onClick={() => openGoogleMaps(hotel?.name)} className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition uppercase tracking-wide">📍 Map</button>
                                        <button onClick={() => openBookingSite(`${hotel?.name} ${tripData?.destination}`)} className="flex-1 px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-md flex items-center justify-center gap-2 uppercase tracking-wide">Book Hotel 🏨</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
                        <p className="text-slate-500 mb-4 font-medium">We found great places to stay in {tripData?.destination}. Click below to see prices.</p>
                        <button onClick={() => openBookingSite(`Hotels in ${tripData?.destination}`)} className="px-6 py-3 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition shadow-lg uppercase tracking-wide">Find Hotels in {tripData?.destination} 🏨</button>
                    </div>
                )}
            </div>

            {/* Daily Itinerary Section */}
            <div className="space-y-10">
                {tripData?.days?.map((day, index) => (
                    <div key={index}>
                         <div className="flex items-center gap-4 mb-6">
                            <span className="bg-slate-900 text-white px-5 py-1.5 rounded-lg font-bold text-sm shadow-md tracking-wide">Day {day?.day}</span>
                            <div className="h-[2px] flex-1 bg-slate-200 rounded-full"></div>
                         </div>
                        
                        <div className="grid gap-5">
                            {day?.activities?.map((act, i) => {
                                const nameLower = act?.name?.toLowerCase() || "";
                                const isReligious = nameLower.match(/(temple|mandir|church|mosque|dargah|gurudwara)/i);
                                let displayCost = parseInt(act?.cost) || 0;
                                let displayReason = act?.fee_reason || "Entry Fee";

                                if (isReligious) {
                                    displayCost = 0;
                                    displayReason = "Free Darshan";
                                } else if (act?.type === 'Food' && displayCost === 0) {
                                    displayCost = 450;
                                    displayReason = "Est. Meal Cost";
                                }

                                return (
                                <div key={i} className={`p-6 rounded-[24px] border border-slate-100 relative group transition-all duration-300 hover:shadow-lg ${
                                    act?.type === 'Food' ? 'bg-[#FFFBF0] border-orange-100' : 
                                    act?.type === 'Stay' ? 'bg-[#F0F7FF] border-blue-100' : 
                                    'bg-white'
                                }`}>
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-xs font-extrabold bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded-md shadow-sm">⏱ {act?.time}</span>
                                                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                                                    act?.type === 'Food' ? 'bg-orange-100 text-orange-700' :
                                                    act?.type === 'Stay' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-purple-100 text-purple-700'
                                                }`}>{act?.type || 'Place'}</span>
                                            </div>
                                            <h4 className="text-xl font-extrabold text-slate-800 cursor-pointer hover:text-blue-600 transition tracking-tight" onClick={() => openGoogleMaps(act?.name)}>{act?.name}</h4>
                                            
                                            {/* 🟢 FIXED: Ensured longer descriptions are readable */}
                                            <p className="text-sm font-medium text-slate-500 mt-2 leading-relaxed max-w-3xl">{act?.description}</p>
                                        </div>
                                        
                                        <div className="text-right min-w-[100px] md:self-center">
                                            <span className="block text-2xl font-black text-green-600 tracking-tight">{displayCost === 0 ? "Free" : `₹${displayCost}`}</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">{displayCost === 0 && !isReligious && act?.type !== 'Food' ? "Free Entry" : displayReason}</span>
                                            <button onClick={() => openGoogleMaps(act?.name)} className="mt-3 text-xs font-bold text-blue-600 flex items-center gap-1 justify-end hover:underline uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">📍 Loc</button>
                                        </div>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-slate-900 text-white py-12 mt-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-left">
             <h2 className="text-lg font-black tracking-tight">AI Trip Planner <span className="text-blue-400">Pro</span></h2>
             <p className="text-slate-400 text-xs mt-2 font-medium tracking-wide">© 2026 AI Trip Planner. All Rights Reserved.</p>
          </div>
          <div className="flex gap-8 text-slate-400 font-bold text-xs uppercase tracking-widest">
            <span className="cursor-pointer hover:text-white transition hover:underline">Privacy</span>
            <span className="cursor-pointer hover:text-white transition hover:underline">Terms</span>
            <span className="cursor-pointer hover:text-white transition hover:underline">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TripResult;