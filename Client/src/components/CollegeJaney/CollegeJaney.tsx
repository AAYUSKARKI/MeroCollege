import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

interface CollegeJaneyProps {
  startingLocation: [number, number];
  collegeLocation: [number, number];
}

const CollegeJaney: React.FC<CollegeJaneyProps> = ({ startingLocation, collegeLocation }) => {
  const [movingMarkerPosition, setMovingMarkerPosition] = useState<[number, number]>(startingLocation);

  useEffect(() => {
    const moveMarkerTowardsCollege = () => {
      const [startLat, startLng] = movingMarkerPosition;
      const [collegeLat, collegeLng] = collegeLocation;

      // Calculate new position towards college (simplified movement)
      const newLat = startLat + (collegeLat - startLat) * 0.01;
      const newLng = startLng + (collegeLng - startLng) * 0.01;

      setMovingMarkerPosition([newLat, newLng]);

      // Schedule next movement (adjust interval as needed)
      setTimeout(moveMarkerTowardsCollege, 1000); // Move every 1 second
    };

    moveMarkerTowardsCollege();
  }, [movingMarkerPosition, collegeLocation]);

  const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <MapContainer center={startingLocation} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={startingLocation} icon={defaultIcon}>
        <Popup>Your Current Location</Popup>
      </Marker>
      <Marker position={collegeLocation} icon={defaultIcon}>
        <Popup>College Location</Popup>
      </Marker>
      <Marker position={movingMarkerPosition} icon={defaultIcon}>
        <Popup>Moving Towards College</Popup>
      </Marker>
    </MapContainer>
  );
};

export default CollegeJaney;
