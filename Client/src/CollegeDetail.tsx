import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';

interface CollegeParams {
  id: string;
}

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
  const [center, setCenter] = useState<[number, number] | null>(null);

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const response = await axios.get(`http://localhost:7000/api/colleges/${id}`);
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

  const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

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
              <Marker position={center} icon={defaultIcon}>
                <Popup>
                  <div>
                    <h3>{college?.name}</h3>
                    <p>{college?.address}</p>
                    <p>{college?.description}</p>
                    <p><a href={`tel:${college?.contactNumber}`}>{college?.contactNumber}</a></p>
                    <p><a href={`mailto:${college?.email}`}>{college?.email}</a></p>
                    <p><a href={college?.website} target="_blank" rel="noopener noreferrer">{college?.website}</a></p>
                    {college?.imageUrl && <img src={college?.imageUrl} alt={college?.name} style={{ width: '100%' }} />}
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
        <div>
          <div className="bg-white shadow-md rounded-md p-4">
            <h2 className="text-xl font-semibold mb-2">{college?.name}</h2>
            <p className="text-gray-600">{college?.description}</p>
            {/* Add more details as needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeDetail;
