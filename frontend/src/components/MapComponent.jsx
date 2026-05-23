import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, Polyline } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem'
};

const MapSection = ({ itinerary }) => {
  const [selectedPlace, setSelectedPlace] = useState(null);

  // Default to Mumbai if no center provided
  const center = itinerary.centerCoordinates || { lat: 19.0760, lng: 72.8777 };
  
  // Extract all activity locations
  const places = itinerary.days.flatMap(day => day.activities);
  const path = places.map(place => place.coordinates); // Path for the blue line

  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        options={{ disableDefaultUI: false, zoomControl: true, streetViewControl: false }}
      >
        {/* Draw the Route Line */}
        <Polyline
          path={path}
          options={{ strokeColor: "#8B5CF6", strokeOpacity: 0.8, strokeWeight: 5 }}
        />

        {/* Draw Markers */}
        {places.map((place, index) => (
          <Marker
            key={index}
            position={place.coordinates}
            onClick={() => setSelectedPlace(place)}
          />
        ))}

        {/* Info Window (Popup) */}
        {selectedPlace && (
          <InfoWindow
            position={selectedPlace.coordinates}
            onCloseClick={() => setSelectedPlace(null)}
          >
            <div className="p-1">
              <h3 className="font-bold text-purple-700">{selectedPlace.name}</h3>
              <p className="text-xs text-gray-600">{selectedPlace.time}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapSection;