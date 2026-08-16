import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from "jspdf";
import axios from 'axios';
import { ArrowLeft, Download, Bookmark, MapPin, Star } from 'lucide-react';

const TripResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tripData } = location.state || {};
  const [saving, setSaving] = useState(false);

  const calculateBudget = () => {
    let totalActivityCost = 0;
    let totalFoodCost = 0;

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

    if (!user) {
      setSaving(false);
      const choice = window.confirm("You must be logged in to save a trip. Go to Login?");
      if (choice) navigate('/login');
      return;
    }

    try {
      await axios.post('http://localhost:8081/api/trips/save', {
        userId: user.email,
        destination: tripData?.destination,
        itinerary: tripData
      });
      alert("Trip saved. Find it under 'My Trips'.");
    } catch (e) {
      console.error(e);
      alert("Error saving trip. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  if (!tripData || !tripData.days || tripData.days.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mb-6"></div>
        <h2 className="text-xl font-semibold text-slate-800">
          Planning your trip to {location.state?.tripData?.destination || "your destination"}...
        </h2>
        <p className="text-slate-500 mt-2 max-w-md">
          We're generating detailed descriptions for every place.
          <br />
          This can take up to 15–20 seconds.
        </p>
        <button onClick={() => navigate('/')} className="mt-6 px-5 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition text-sm font-medium">
          Cancel &amp; go back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 w-full max-w-[100vw] overflow-x-hidden flex flex-col justify-between">

      <div className="max-w-5xl mx-auto py-8 px-4 md:px-6 w-full">

        {/* Navigation Buttons */}
        <div className="flex flex-wrap gap-3 mb-6 justify-between items-center">
          <button onClick={() => navigate('/')} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition flex items-center gap-1.5">
            <ArrowLeft size={15} /> Back
          </button>
          <div className="flex gap-3">
            <button onClick={handleDownloadPDF} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition flex items-center gap-1.5">
              <Download size={15} /> PDF
            </button>
            <button onClick={handleSaveTrip} disabled={saving} className="px-5 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition flex items-center gap-1.5 disabled:opacity-60">
              <Bookmark size={15} /> {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        <div id="itinerary-content">

          {/* Header Image */}
          <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden mb-8">
            <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200" className="w-full h-full object-cover" alt="Cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6 md:p-8">
              <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Trip to {tripData?.destination}</h1>
            </div>
          </div>

          {/* Budget Totals Section */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 mb-8">
            <h2 className="text-lg font-semibold text-slate-800 mb-5">Trip budget</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 font-medium mb-1.5">Hotel</p>
                <p className="text-xl font-bold text-slate-800">₹{budgetStats?.hotel}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 font-medium mb-1.5">Food</p>
                <p className="text-xl font-bold text-slate-800">₹{budgetStats?.food}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 font-medium mb-1.5">Entry &amp; travel</p>
                <p className="text-xl font-bold text-slate-800">₹{budgetStats?.places}</p>
              </div>
              <div className="bg-brand-50 p-4 rounded-xl border border-brand-100">
                <p className="text-xs text-brand-700 font-medium mb-1.5">Total</p>
                <p className="text-xl font-bold text-brand-700">₹{budgetStats?.grandTotal}</p>
              </div>
            </div>
          </div>

          {/* Recommended Hotels Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Recommended stays</h2>

            {tripData?.hotels && tripData?.hotels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tripData.hotels.map((hotel, i) => (
                  <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition">
                    <div>
                      <div className="flex justify-between items-start mb-1.5 gap-3">
                        <h4 className="font-semibold text-slate-800 text-base">{hotel?.name}</h4>
                        <span className="flex items-center gap-1 text-xs font-medium text-amber-600 shrink-0 mt-0.5">
                          <Star size={12} fill="currentColor" /> {hotel?.rating}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 flex items-center gap-1"><MapPin size={12} /> {hotel?.address}</p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-base font-semibold text-slate-800">{hotel?.price} <span className="text-xs font-normal text-slate-400">/ night</span></span>
                      </div>

                      <div className="flex gap-2">
                        <button onClick={() => openGoogleMaps(hotel?.name)} className="px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition">Map</button>
                        <button onClick={() => openBookingSite(`${hotel?.name} ${tripData?.destination}`)} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition">Book</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-xl border border-slate-200 text-center">
                <p className="text-slate-500 mb-4 text-sm">We found places to stay in {tripData?.destination}. Click below for current prices.</p>
                <button onClick={() => openBookingSite(`Hotels in ${tripData?.destination}`)} className="px-5 py-2.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition">Find hotels in {tripData?.destination}</button>
              </div>
            )}
          </div>

          {/* Daily Itinerary Section */}
          <div className="space-y-8">
            {tripData?.days?.map((day, index) => (
              <div key={index}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-slate-800 text-white px-3.5 py-1 rounded-md text-sm font-semibold">Day {day?.day}</span>
                  <div className="h-px flex-1 bg-slate-200"></div>
                </div>

                <div className="grid gap-3">
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

                    const badgeColor =
                      act?.type === 'Food' ? 'bg-orange-100 text-orange-700' :
                      act?.type === 'Stay' ? 'bg-brand-100 text-brand-700' :
                      'bg-purple-100 text-purple-700';

                    return (
                      <div key={i} className="p-5 rounded-xl border border-slate-200 bg-white relative group hover:border-slate-300 transition">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{act?.time}</span>
                              <span className={`text-xs font-medium px-2 py-0.5 rounded ${badgeColor}`}>{act?.type || 'Place'}</span>
                            </div>
                            <h4 className="text-base font-semibold text-slate-800 cursor-pointer hover:text-brand-600 transition" onClick={() => openGoogleMaps(act?.name)}>{act?.name}</h4>
                            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed max-w-3xl">{act?.description}</p>
                          </div>

                          <div className="text-right min-w-[100px] md:self-center">
                            <span className="block text-lg font-bold text-slate-800">{displayCost === 0 ? "Free" : `₹${displayCost}`}</span>
                            <span className="text-xs text-slate-400 block mt-0.5">{displayCost === 0 && !isReligious && act?.type !== 'Food' ? "Free entry" : displayReason}</span>
                            <button onClick={() => openGoogleMaps(act?.name)} className="mt-1.5 text-xs font-medium text-brand-600 flex items-center gap-1 justify-end hover:underline opacity-0 group-hover:opacity-100 transition-opacity">Map</button>
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
      <footer className="bg-white border-t border-slate-200 py-8 mt-8">
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

export default TripResult;
