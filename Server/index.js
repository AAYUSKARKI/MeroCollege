import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import colleges from './routes/colleges.js';
import cors from 'cors';
import College from './models/College.js';
const app = express();

const PORT = 7000;

mongoose.connect('mongodb+srv://alexkarki2060:aayus5@cluster0.nv4xbja.mongodb.net/MeroCollege')
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(bodyParser.json());
app.get('/api/nearbyColleges', async (req, res) => {
    const { lat, lng } = req.query;
  
    try {
      // Assuming College model has a 2dsphere index on location.coordinates
      const nearbyColleges = await College.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)],
            },
            $maxDistance: 10000, // Maximum distance in meters (adjust as needed)
          },
        },
      });
  
      res.json(nearbyColleges);
    } catch (error) {
      console.error('Error fetching nearby colleges:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
app.use('/api/colleges', colleges);
//cors url = http://localhost:5173
  

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
