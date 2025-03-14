import Service from "../Models/ServicesModel.js";
import User from "../Models/UserModel.js"
import cloudinary from '../Lib/cloudinaryConfig.js'
// import Notification from '../Models/notificationModel.js'


export const createService = async (req, res) => {
    try {
      const { title, description, images, location,experience,price,duration,language, category } = req.body;
      const provider = req.user._id;
  
      let uploadedImages = [];
  
      if (images && images.length > 0) {
        for (let image of images) {
          const imgResult = await cloudinary.uploader.upload(image);
          uploadedImages.push(imgResult.secure_url);
        }
      }
  
      const newService= new Service({
        title,
        description,
        images: uploadedImages,
        location,
        experience,
        duration,
        language,
        price,
        category,
        provider,
      });
  
      await newService.save();
      await User.findByIdAndUpdate(provider, { $push: { services: newService._id } });

  
      res.status(201).json({ message: "Service created successfully"});

    } catch (error) {
      console.error("Error in createPost controller:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  

  export const deleteService = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const userId = req.user._id;

        const service = await Service.findById(serviceId);

        if (!service) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if the current user is the author of the post 
        if (service.author.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this post" });
        }

        // Delete all images from Cloudinary
        if (service.images && service.images.length > 0) {
            for (let imageUrl of service.images) {
                const publicId = imageUrl.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            }
        }

        // Delete the service from the database
        await Service.findByIdAndDelete(serviceId);

        // Remove the post reference from the user's posts array
        await User.findByIdAndUpdate(userId, { $pull: { services: serviceId } });
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.log("Error in delete post controller:", error.message);
        res.status(500).json({ message: "Server error" });
    }
}