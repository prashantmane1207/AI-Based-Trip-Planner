import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8081/api/auth/login', formData);
      if (res.status === 200) {
        localStorage.setItem('user', JSON.stringify(res.data));
        alert('Login successful!');
        navigate('/');
      }
    } catch (error) {
      alert('Login failed: ' + (error.response?.data || "Invalid credentials"));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-6">
          <div className="w-8 h-8 bg-brand-500 rounded-md flex items-center justify-center">
            <MapPin size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900">Waypoint</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-8 py-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">Welcome back</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@email.com"
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 text-slate-800 transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 text-slate-800 transition"
                required
              />
            </div>
            <button type="submit" className="w-full bg-brand-500 text-white py-2.5 rounded-lg font-medium hover:bg-brand-600 transition mt-2">
              Log in
            </button>
          </form>
          <p className="text-center mt-6 text-sm text-slate-500">
            Don't have an account? <span onClick={() => navigate('/signup')} className="text-brand-600 font-medium cursor-pointer hover:underline">Sign up</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
