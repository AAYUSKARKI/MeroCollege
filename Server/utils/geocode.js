import axios from 'axios';

const geocode = async (location) => {
  try {
    const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
      params: {
        q: location,
        key: '6be707cff97f4b73be0ae0b59e1ebd76',
      },
    });

    if (response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry;
      return { lat, lng };
    } else {
      throw new Error('Location not found');
    }
  } catch (error) {
    throw new Error(`Geocoding error: ${error.message}`);
  }
};

export default geocode;
