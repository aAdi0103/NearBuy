import Service from "../Models/ServicesModel.js";
import User from "../Models/UserModel.js";
import cloudinary from "../Lib/cloudinaryConfig.js";

export const createService = async (req, res) => {
  try {
    const {
      title,
      description,
      images,
      location,
      experience,
      price,
      duration,
      language,
      category,
    } = req.body;
    const provider = req.user._id;

    let uploadedImage = "";

    if (images){
      try {
        const result = await  cloudinary.uploader.upload(req.body.images);
        uploadedImage = result.secure_url;
      } catch (uploadError) {
        console.error("Error uploading image to Cloudinary:", uploadError);
        return res.status(500).json({ message: "Image upload failed", error: uploadError.message });
      }
    }

        // Ensure language is properly formatted as an array of strings
        const formattedLanguages = Array.isArray(language)
        ? language.map(lang => lang.trim()) // Convert and trim spaces
        : [language.trim()]; // If a single string, wrap in an array

    const newService = new Service({
      title,
      description,
      images: uploadedImage,
      location,
      experience,
      duration,
      language: formattedLanguages, // Ensuring array
      price,
      category,
      provider,
    });

    await newService.save();
    await User.findByIdAndUpdate(provider, { $push: { services: newService._id } });

    res.status(201).json({ message: "Service created successfully" });
  } catch (error) {
    console.error("Error in createService controller:", error);
    res.status(500).json({ message: "Server error" });
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
  console.log(req.body);
    const allowedFields = ["title", "description", "images","location","price","duration","category","experience","language"];
    const updatedData = {};
    for (const field of allowedFields) {
      if (req.body[field]) {
        updatedData[field] = req.body[field];
      }
    }
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