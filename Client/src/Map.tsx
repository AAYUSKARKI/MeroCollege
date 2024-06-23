import React, { useState, useEffect } from 'react';
import CollegeMap from './components/CollegeMap';
import SearchBox from './components/SearchBox';

const Map: React.FC = () => {
  const [location, setLocation] = useState<string>('');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      }, (error) => {
        console.error("Error fetching user location:", error);
      });
    }
  }, []);

  const handleSearch = (searchLocation: string) => {
    setLocation(searchLocation);
  };

  

  return (
    <>
      <SearchBox onSearch={handleSearch} />
      <CollegeMap searchLocation={location} userLocation={userLocation}/>
    </>
  );
};

export default Map;
