import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';

interface College {
  _id: string;
  name: string;
  address: string;
  location: {
    coordinates: [number, number];
  };
  courses: string[];
  contactNumber: string;
  website: string;
  email: string;
  description: string;
  imageUrl: string;
}

const CollegeDetail: React.FC = () => {
  const { id } = useParams();
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [center, setCenter] = useState<[number, number] | undefined>(undefined);

  const [track, setTrack] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [pathCoordinates, setPathCoordinates] = useState<[number, number][]>([]);

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const response = await axios.get(`https://merocollege.onrender.com/api/colleges/${id}`);
        setCollege(response.data);
        setCenter([response.data.location.coordinates[1], response.data.location.coordinates[0]]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching college:', error);
        setLoading(false);
      }
    };

    fetchCollege();
  }, [id]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  }, []);

  const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const handleTrack = () => {
    setTrack(!track);
  };
  let animationFrameId: number | undefined;
  const animateMovement = () => {
    if (track && userLocation && center) {
      const [startLat, startLng] = userLocation;
      const [collegeLat, collegeLng] = center;
  
      const newLat = startLat + (collegeLat - startLat) * 0.01;
      const newLng = startLng + (collegeLng - startLng) * 0.01;
  
      setCenter([newLat, newLng]);
  
      setPathCoordinates(prevPath => [...prevPath, [newLat, newLng]]);
  
      animationFrameId = window.requestAnimationFrame(animateMovement);
    }
  };
  
  
  useEffect(() => {
   
  
    const animate = () => {
      animateMovement();
      animationFrameId = requestAnimationFrame(animate);
    };
  
    if (track) {
      animationFrameId = requestAnimationFrame(animate);
    }
  
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [track, userLocation, center]);

  if (loading) {
    return <div>Loading...</div>; // Render a loading indicator while fetching data
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-semibold mb-4">{college?.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="rounded-lg overflow-auto shadow-md">
            <MapContainer center={center} zoom={13} style={{ height: '700px', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              {userLocation && (
                <Marker position={userLocation} icon={defaultIcon}>
                  <Popup>Your Current Location</Popup>
                </Marker>
              )}
              {center && (
                <Marker position={center} icon={defaultIcon}>
                  <Popup>College Location</Popup>
                </Marker>
              )}
              {pathCoordinates.length > 0 && (
                <Polyline positions={pathCoordinates} color="blue" />
              )}
            </MapContainer>
          </div>
        </div>
        <div>
          <div className="bg-white shadow-md rounded-md p-4">
            <h2 className="text-xl font-semibold mb-2">{college?.name}</h2>
            <p className="text-gray-600">{college?.description}</p>
            <button onClick={handleTrack} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              {track ? 'Stop Tracking' : 'Go To College'}
            </button>
            {/* Add more details as needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeDetail;
