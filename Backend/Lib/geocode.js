import axios from 'axios'
const getCoordinates = async (address) => {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`;

  const response = await axios.get(url);
  if (response.data.length > 0) {
    return {
      lat: parseFloat(response.data[0].lat),
      lng: parseFloat(response.data[0].lon),
    };
  }
  throw new Error("Coordinates not found");
};

export default getCoordinates