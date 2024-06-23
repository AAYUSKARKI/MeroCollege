import express from 'express';
import College from '../models/College.js';
import geocode from '../utils/geocode.js';
// import { uploadOnCloudinary } from '../utils/cloudinary.js';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const colleges = await College.find();
    res.json(colleges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const { name, address, courses, contactNumber, website, email, description, imageUrl } = req.body;
  
  try {
    const { lat, lng } = await geocode(address);
    const newCollege = new College({
      name,
      address,
      location: {
        type: 'Point',
        coordinates: [lng, lat],
      },
      courses: Array.isArray(courses) ? courses : [courses],
      contactNumber,
      website,
      email,
      description,
      imageUrl,
    });

    const savedCollege = await newCollege.save();
    res.json(savedCollege);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }
    res.json(college);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})
export default router;
