import React, { useState } from 'react';
import axios from 'axios';

interface CollegeFormProps {
  onCollegeAdded: () => void;
}

const CollegeForm: React.FC<CollegeFormProps> = ({ onCollegeAdded }) => {
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [courses, setCourses] = useState<string>('');
  const [contactNumber, setContactNumber] = useState<string>('');
  const [website, setWebsite] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const courseArray = courses.split(',').map(course => course.trim());
      const newCollege = {
        name,
        address,
        courses: courseArray,
        contactNumber,
        website,
        email,
        description,
        imageUrl,
      };

      await axios.post('http://localhost:7000/api/colleges', newCollege);
      onCollegeAdded();
      clearForm();
    } catch (error) {
      console.error('Error adding college:', error);
    }
  };

  const clearForm = () => {
    setName('');
    setAddress('');
    setCourses('');
    setContactNumber('');
    setWebsite('');
    setEmail('');
    setDescription('');
    setImageUrl('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>Address:</label>
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
      </div>
      <div>
        <label>Courses (comma separated):</label>
        <input type="text" value={courses} onChange={(e) => setCourses(e.target.value)} required />
      </div>
      <div>
        <label>Contact Number:</label>
        <input type="text" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
      </div>
      <div>
        <label>Website:</label>
        <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <label>Image URL:</label>
        <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
      </div>
      <button type="submit">Add College</button>
    </form>
  );
};

export default CollegeForm;
