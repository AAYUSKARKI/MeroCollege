import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';

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

interface CollegeMapProps {
  searchLocation: string;
  userLocation: [number, number] | null;
}

const CollegeMap: React.FC<CollegeMapProps> = ({ searchLocation, userLocation }) => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [center, setCenter] = useState<[number, number]>([27.7172, 85.3240]); // Default to Kathmandu
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await axios.get('https://merocollege.onrender.com/api/colleges');
        setColleges(response.data); // Assuming response.data is an array of College objects
        setLoading(false);
      } catch (error) {
        console.error('Error fetching colleges:', error);
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (searchLocation) {
        try {
          const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
            params: {
              q: searchLocation,
              key: '6be707cff97f4b73be0ae0b59e1ebd76',
            },
          });

          if (response.data.results.length > 0) {
            const { lat, lng } = response.data.results[0].geometry;
            setCenter([lat, lng]);
          }
        } catch (error) {
          console.error('Error fetching coordinates:', error);
        }
      } else if (userLocation) {
        setCenter(userLocation);
      }
    };

    fetchCoordinates();
  }, [searchLocation, userLocation]);

  const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <MapContainer center={center} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {colleges.map((college) => (
        <Marker
          key={college._id}
          position={[college.location.coordinates[1], college.location.coordinates[0]]}
          icon={defaultIcon}
        >
          <Popup>
            <div>
              <h3>{college.name}</h3>
              <p>{college.address}</p>
              <p>{college.description}</p>
              <p><a href={`tel:${college.contactNumber}`}>{college.contactNumber}</a></p>
              <p><a href={`mailto:${college.email}`}>{college.email}</a></p>
              <p><a href={college.website} target="_blank" rel="noopener noreferrer">{college.website}</a></p>
              {college.imageUrl && <img src={college.imageUrl} alt={college.name} style={{ width: '100%' }} />}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default CollegeMap;
