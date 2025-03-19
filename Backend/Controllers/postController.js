import Post from "../Models/PostModel.js";
import User from "../Models/UserModel.js"
import cloudinary from '../Lib/cloudinaryConfig.js'

import axios from "axios";
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

export const createPosts = async (req, res) => {
  try {
    // Destructure required fields
    const { heading, description, images, location, price, category, quantity, condition } = req.body;
    const author = req.user._id;
    // Check if all required fields are provided
    if (!heading || !description || !location || !price || !category || !quantity || !condition) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

      // Format location object into a single string for geocoding
      const locationString = `${location.area}, ${location.city}, ${location.state}, ${location.country}`;

      // Get latitude and longitude from the formatted location string
      const { lat, lng } = await getCoordinates(locationString);
  
    // Upload single image to Cloudinary
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

    // Create new post
    const newPost = new Post({
      heading,
      description,
      images: uploadedImage, // Store single image URL
      location,
      quantity,
      condition,
      price,
      category,
      author,
      latitude:lat,
      longitude:lng
    });

    // Save post to database
    await newPost.save();

    // Success response
    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error("Error in createPost controller:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Controller to get posts by an array of id
export const getPostsByIds = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getFeedPosts = async function (req, res) {
  try {
    const userId = req.user.id; // Get the logged-in user's ID

    const posts = await Post.find({ author: userId }) 
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getUserPosts: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Checking if the current user is the author of the post
    if (post.author.toString() !== userId.toString()) {
      console.log("not authorized");
      return res.status(403).json({ message: "You are not authorized to delete this post" });
    }

    // Delete the image from Cloudinary
    if (post.images) {
      await cloudinary.uploader.destroy(post.images.split("/").pop().split(".")[0]);
    }

    // Remove post ID from the user's posts array
    await User.findByIdAndUpdate(userId, { $pull: { posts: postId } });

    // Delete the post from the database
    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error in delete post controller", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const updatePostt = async (req,res) =>{
  
try {
  const {id} = req.params;
    const allowedFields = ["heading", "description", "images","location","price","condition","category"];
    const updatedData = {};
    for (const field of allowedFields) {
      if (req.body[field]) {
        updatedData[field] = req.body[field];
      }
    }

    const {location}=req.body;
    const locationString = `${location.area}, ${location.city}, ${location.state}, ${location.country}`;

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
    const post = await Post.findByIdAndUpdate(
      id, // Ensures only the logged-in user can update their profile
      { $set: updatedData },
      { new: true, select: "-password" } // Exclude password field from response
    );

    if (!post) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(post);
  }
   catch (error) {
    console.error("Error in updateProfile controller:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export const getAllProducts = async (req,res) =>{
  try {
    const products = await Post.find(); 
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching Products:", error);
    res.status(500).json({ message: "Error fetching Products", error: error.message });
  }
}


export const getFeedPostsID = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ error: "Email parameter is missing" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const posts = await Post.find({ author: user._id }).sort({ createdAt: -1 });

    return res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Server error" });
  }
};


export const getNearbyProducts = async (req, res) => {
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
    const products = await Post.find();

    if (!products.length) {
      return res.status(404).json({ message: "No products available" });
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
    const nearbyProducts = products.filter(Product => {
      if (!Product.latitude || !Product.longitude) return false;
      const distance = getDistance(userLat, userLng, Product.latitude, Product.longitude);
      return distance <= maxDistance;
    });

    // Ensure data is only returned when there are nearby services
    if (nearbyProducts.length > 0) {
      return res.json(nearbyProducts);
    } else {
      return res.json([]); // ✅ Message instead of 404 error
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



export const getSearchedProducts = async (req, res) => {
  try {
    const { location, search } = req.query;
    const productString = String(search);
    const coordinates = await getCoordinates(location);

    if (!coordinates) {
      return res.status(400).json({ message: "Invalid location, please select another." });
    }

    const query = {
      latitude: { $gte: coordinates.lat - 0.1, $lte: coordinates.lat + 0.1 },
      longitude: { $gte: coordinates.lng - 0.1, $lte: coordinates.lng + 0.1 },
      $or: [
        { heading: { $regex: productString, $options: "i" } },
        { category: { $regex: productString, $options: "i" } },
      ],
    };
    const products = await Post.find(query);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching products" });
  }
};