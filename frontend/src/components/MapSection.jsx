import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for missing marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapSection = ({ itinerary }) => {
    // 1. Safety Check: If no coordinates, default to India
    const defaultLat = 20.5937;
    const defaultLng = 78.9629;
    
    // 2. Safe Access to Coordinates
    const centerLat = itinerary?.centerCoordinates?.lat || defaultLat;
    const centerLng = itinerary?.centerCoordinates?.lng || defaultLng;

    return (
        <div className="h-full w-full z-0">
            <MapContainer center={[centerLat, centerLng]} zoom={10} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                />
                
                {/* 3. Safe Loop for Markers */}
                {itinerary?.days?.map((day) => 
                    day.activities?.map((activity, idx) => (
                        activity.coordinates && (
                            <Marker 
                                key={`${day.day}-${idx}`} 
                                position={[activity.coordinates.lat || centerLat, activity.coordinates.lng || centerLng]}
                            >
                                <Popup>
                                    <div className="text-center">
                                        <h3 className="font-bold">{activity.name}</h3>
                                        <p>{activity.time}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        )
                    ))
                )}
            </MapContainer>
        </div>
    );
};

export default MapSection;