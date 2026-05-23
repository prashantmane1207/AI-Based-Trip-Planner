import axios from 'axios';

// Automatically picks URL based on environment (Vite uses import.meta.env)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const saveTrip = async (tripData) => {
    try {
        return await axios.post(`${API_URL}/api/trips/save`, tripData);
    } catch (error) {
        console.error("Error saving trip:", error);
        throw error;
    }
};

export const generateTrip = async (formData) => {
    try {
        return await axios.post(`${API_URL}/api/trips/generate`, formData);
    } catch (error) {
        console.error("Error generating trip:", error);
        throw error;
    }
};