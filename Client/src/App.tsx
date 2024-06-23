import React, { useState } from 'react';
import Header from './components/Header/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CollegeList from './CollegeList';
import CollegeDetail from './CollegeDetail';
import CollegeForm from './components/CollegeForm';
import Map from './Map';

const App: React.FC = () => {
  const [collegesUpdated, setCollegesUpdated] = useState<boolean>(false);

  const handleCollegeAdded = () => {
    setCollegesUpdated(!collegesUpdated); 
  };
  return (
    <Router>
         <Header/>
      <Routes>
        <Route path="/" element={<CollegeList />} />
        <Route path="/add" element={<CollegeForm onCollegeAdded={handleCollegeAdded} />} />
        <Route
          path="/map"
          element={<Map/>}
        />
        <Route path="/college/:id" element={<CollegeDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
