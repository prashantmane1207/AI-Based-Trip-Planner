import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import TripResult from './components/TripResult';
import Signup from './components/Signup';
import Login from './components/Login';
import MyTrips from './components/MyTrips'; // 🟢 Import this

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trip-result" element={<TripResult />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        
        {/* 🟢 Add this Route */}
        <Route path="/my-trips" element={<MyTrips />} />
      </Routes>
    </div>
  );
}

export default App;