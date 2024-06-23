import mongoose from 'mongoose';

const CollegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true },
  },
  courses: [{ type: String, required: true }],
  contactNumber: { type: String },
  website: { type: String },
  email: { type: String },
  description: { type: String },
  imageUrl: { type: String },
});

CollegeSchema.index({ location: '2dsphere' });

const College = mongoose.model('College', CollegeSchema);
export default College;
