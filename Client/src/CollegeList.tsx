import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CollegeCard from './CollegeCard';

interface College {
  _id: string;
  name: string;
  description: string;
  imageUrl:string;
}

interface NearbyCollege extends College {
  distance: number; // Additional property to store distance
}

const CollegeList: React.FC = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [nearbyColleges, setNearbyColleges] = useState<NearbyCollege[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null); // User's location

  useEffect(() => {
    // Function to fetch user's location
    const fetchUserLocation = () => {
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
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    // Fetch colleges
    const fetchColleges = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/colleges');
        setColleges(response.data); // Assuming response.data is an array of College objects
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching colleges:', error);
        setLoading(false); // Ensure loading is set to false even in case of error
      }
    };

    fetchUserLocation(); // Fetch user location
    fetchColleges(); // Fetch colleges

  }, []);

  useEffect(() => {
    // Function to fetch nearby colleges based on userLocation
    const fetchNearbyColleges = async () => {
      if (userLocation) {
        try {
          const response = await axios.get('http://localhost:7000/api/nearbyColleges', {
            params: {
              lat: userLocation[0],
              lng: userLocation[1],
            },
          });
          setNearbyColleges(response.data); // Assuming response.data is an array of NearbyCollege objects with distance
        } catch (error) {
          console.error('Error fetching nearby colleges:', error);
        }
      }
    };

    fetchNearbyColleges(); // Fetch nearby colleges when userLocation changes

  }, [userLocation]);

  if (loading) {
    return (
      <div className="animate-pulse rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
        <div className="bg-gray-300 dark:bg-gray-700 h-40 w-full mb-4 rounded"></div>
        <div className="bg-gray-300 dark:bg-gray-700 h-6 w-3/4 mb-4 rounded"></div>
        <div className="bg-gray-300 dark:bg-gray-700 h-4 w-full mb-2 rounded"></div>
        <div className="bg-gray-300 dark:bg-gray-700 h-4 w-full mb-2 rounded"></div>
        <div className="bg-gray-300 dark:bg-gray-700 h-4 w-full mb-2 rounded"></div>
        <div className="bg-gray-300 dark:bg-gray-700 h-8 w-1/2 mt-4 rounded"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8">
      {/* Nearby Colleges Section */}
      {userLocation && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Nearby Colleges</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {nearbyColleges.map((college) => (
              <Link key={college._id} to={`/college/${college._id}`} target="_blank" rel="noopener noreferrer">
                <CollegeCard college={college} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* All Colleges Section */}
      <h2 className="text-xl font-semibold mb-4">Others Colleges</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {colleges.map((college) => (
          <Link key={college._id} to={`/college/${college._id}`} target="_blank" rel="noopener noreferrer">
            <CollegeCard college={college}/>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CollegeList;
