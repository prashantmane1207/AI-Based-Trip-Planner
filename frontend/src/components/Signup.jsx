import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8081/api/auth/signup', formData);
      if (res.status === 200) {
        alert('Account Created Successfully! 🎉 Please Login.');
        navigate('/login');
      }
    } catch (error) {
      console.error(error);
      alert('Signup Failed: ' + (error.response?.data || "Server Error"));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-96 border border-blue-100">
        <h2 className="text-3xl font-bold text-center mb-6 text-slate-800">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Full Name" onChange={handleChange} className="w-full p-3 border rounded-lg bg-slate-50" required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full p-3 border rounded-lg bg-slate-50" required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-3 border rounded-lg bg-slate-50" required />
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg">Sign Up</button>
        </form>
        <p className="text-center mt-6 text-sm text-slate-500">
            Already have an account? <span onClick={() => navigate('/login')} className="text-blue-600 font-bold cursor-pointer hover:underline">Login here</span>
        </p>
      </div>
    </div>
  );
};

export default Signup;