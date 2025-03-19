import Service from "../Models/ServicesModel.js";
import User from "../Models/UserModel.js";
import cloudinary from "../Lib/cloudinaryConfig.js";
import axios from "axios";
const getCoordinates = async (address) => {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`;
    const response = await axios.get(url);

    if (response.data.length > 0) {
      return {
        lat: parseFloat(response.data[0].lat),
        lng: parseFloat(response.data[0].lon),
      };
    }

    throw new Error("Coordinates not found");
  } catch (error) {
    return null; // Return null if no coordinates found
  }
};


export const createService = async (req, res) => {
  try {
    const { title, description, images, location, experience, price, duration, language, category } = req.body;
    const provider = req.user._id;

    // Format location object into a single string for geocoding
    const locationString = `${location.area}, ${location.city}, ${location.state}, ${location.country}`;

    // Get latitude and longitude from the formatted location string
    const { lat, lng } = await getCoordinates(locationString);

    let uploadedImage = "";

    if (images) {
      try {
        const result = await cloudinary.uploader.upload(images);
        uploadedImage = result.secure_url;
      } catch (uploadError) {
        console.error("Error uploading image to Cloudinary:", uploadError);
        return res.status(500).json({ message: "Image upload failed", error: uploadError.message });
      }
    }

    // Ensure language is formatted as an array of strings
    const formattedLanguages = Array.isArray(language)
      ? language.map(lang => lang.trim())
      : [language.trim()];

    const newService = new Service({
      title,
      description,
      images: uploadedImage,
      location, // Keeping the object structure
      latitude: lat,
      longitude: lng,
      experience,
      duration,
      language: formattedLanguages,
      price,
      category,
      provider,
    });

    await newService.save();
    await User.findByIdAndUpdate(provider, { $push: { services: newService._id } });

    res.status(201).json({ message: "Service created successfully", service: newService });
  } catch (error) {
    console.error("Error in addService controller:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



export const deleteService = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const userId = req.user._id;
    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({ message: "service not found" });
    }

    // Checking if the current user is the author of the service
    if (service.provider.toString() !== userId.toString()) {
      console.log("not authorized");
      return res.status(403).json({ message: "You are not authorized to delete this service" });
    }

    // Delete the image from Cloudinary
    if (service.images && service.images.length > 0) {
      for (let imgUrl of service.images) {
        const publicId = imgUrl.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }
    }
    

    // Delete the post from the database
    await Service.findByIdAndDelete(serviceId);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error in delete post controller", error.message);
    res.status(500).json({ message: "Server error" });
  }
};



export const getServices = async function (req, res) {
  try {
    const userId = req.user.id; // Get the logged-in user's ID

    const Services = await Service.find({ provider: userId }) 
      .sort({ createdAt: -1 });

    res.status(200).json(Services);
  } catch (error) {
    console.error("Error in getUserPosts: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const updateService = async (req,res) =>{
  
try {
  const {id} = req.params;
    const allowedFields = ["title", "description", "images","location","price","duration","category","experience","language"];
    const updatedData = {};
    for (const field of allowedFields) {
      if (req.body[field]) {
        updatedData[field] = req.body[field];
      }
    }
  const {location}=req.body;
    const locationString = `${location.area}, ${location.city}, ${location.state}, ${location.country}`;

    // Get latitude and longitude from the formatted location string
    const { lat, lng } = await getCoordinates(locationString);
    updatedData.latitude = lat;
    updatedData.longitude = lng;

    // Handle profile picture upload
    if (req.body.images) {
      try{
      const result = await cloudinary.uploader.upload(req.body.images);
      updatedData.images = result.secure_url;
      }catch(error){
      }
    }

    // Ensure user exists before updating
    const service = await Service.findByIdAndUpdate(
      id, // Ensures only the logged-in user can update their profile
      { $set: updatedData },
      { new: true, select: "-password" } // Exclude password field from response
    );

    if (!service) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(service);
  }
   catch (error) {
    console.error("Error in updateProfile controller:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Invalid Service id" });
    }

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json(service);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find(); 
    res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ message: "Error fetching services", error: error.message });
  }
};


export const getServicesId = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ error: "Email parameter is missing" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const services = await Service.find({ provider: user._id }).sort({ createdAt: -1 });

    return res.json(services);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Server error" });
  }
};



export const getNearbyServices = async (req, res) => {

  // Extract parameters from the request query
  const { lat, lng, radius } = req.query;

  // Validate parameters
  if (!lat || !lng || !radius) {
    return res.status(400).json({ message: "Missing parameters" });
  }

  // Convert to numbers
  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);
  const maxDistance = parseFloat(radius);

  if (isNaN(userLat) || isNaN(userLng) || isNaN(maxDistance)) {
    return res.status(400).json({ message: "Invalid latitude, longitude, or radius" });
  }

  try {
    // Fetch all services
    const services = await Service.find();

    if (!services.length) {
      return res.status(404).json({ message: "No services available" });
    }

    // Haversine formula to calculate the distance between two coordinates
    const getDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Earth's radius in km
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    // Filter nearby services based on distance
    const nearbyServices = services.filter(service => {
      if (!service.latitude || !service.longitude) return false;
      const distance = getDistance(userLat, userLng, service.latitude, service.longitude);
      return distance <= maxDistance;
    });

    // Ensure data is only returned when there are nearby services
    if (nearbyServices.length > 0) {
      return res.json(nearbyServices);
    } else {
      return res.json([]); // ✅ Message instead of 404 error
    }
  } catch (error) {
    console.error("Error fetching services:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getSearchedServices = async (req, res) => {
  try {
    const { location, search } = req.query;
    const serviceString = String(search);
    const coordinates = await getCoordinates(location);
    if (!coordinates) {
      return res.status(400).json({ message: "Invalid location, please select another." });
    }

    const query = {
      latitude: { $gte: coordinates.lat - 0.1, $lte: coordinates.lat + 0.1 },
      longitude: { $gte: coordinates.lng - 0.1, $lte: coordinates.lng + 0.1 },
      $or: [
        { title: { $regex: serviceString, $options: "i" } },
        { category: { $regex: serviceString, $options: "i" } },
      ],
    };
    const services = await Service.find(query);
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching services" });
  }
};

