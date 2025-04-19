import Post from "../Models/PostModel.js";
import User from "../Models/UserModel.js"
import cloudinary from '../Lib/cloudinaryConfig.js'
import {analyzeImage} from '../Lib/signtEngine.js'
import axios from "axios";
import levenshtein from "fast-levenshtein";
import redis from '../Lib/redis.js'
const bannedWords =

 [
  "चूतिया", // chutiya (idiot/asshole)
  "भोसड़ीके", // bhosdike (crude insult)
  "मादरचोद", // madarchod (motherfucker)
  "बहनचोद", // behenchod (sisterfucker)
  "गांड", // gaand (ass)
  "लंड", // lund (dick)
  "हरामी", // harami (bastard)
  "कमीना", // kameena (jerk/lowlife)
  "साला", // sala (brother-in-law, used as an insult)
  "साली", // sali (sister-in-law, used as an insult)
  "रंडी", // randi (whore)
  "कुतिया", // kutiya (bitch)
  "भड़वा", // bhadwa (pimp)
  "चूस", // choos (suck, often vulgar in context)
  "फट्टू", // fattu (coward, mildly offensive)
  "fuck",
  "shit",
  "ass",
  "asshole",
  "bitch",
  "bastard",
  "dick",
  "pussy",
  "cunt",
  "damn",
  "hell",
  "fucker",
  "motherfucker",
  "whore",
  "slut",
  "cock",
  "prick",
  "twat",
  "wanker",
  "bullshit", "chutiyapa", // nonsense/stupidity
  "gandu", // ass (slang variation)
  "bhenchod", // sisterfucker (shortened)
  "mc", // abbreviation for madarchod
  "bc", // abbreviation for behenchod
  "fuckingwala", // crude emphasis
  "shittya", // shitty (mixed slang)
  "assu", // ass (casual slang)
  "lundfakeer", // dick beggar (crude insult)
  "haramipanti", // bastard-like behavior
  "randibaaz", // womanizer/slutty behavior
  "gaandmasti", // ass-related mischief
  "bakchodi", // bullshit/nonsense
  "chodu", // fucker (slang variation)
  "fattugiri", // cowardice (slang)
  "randikhana"

 ]



 function normalizeText(text) {
  if (typeof text !== 'string') {
      text = String(text); // Convert to string if it's not already
  }
  return text.toLowerCase().replace(/[^a-zA-Z0-9]/g, ""); // Remove special characters
}


function isSimilar(word, target) {
    return levenshtein.get(word, target) <= 2; // Allow only 1 letter difference
}

function containsBannedWords(text) {
    const cleanedText = normalizeText(text);
    return bannedWords.some((word) =>
        isSimilar(cleanedText, word) // Check for close matches
    );
}
const getCoordinates = async (address) => {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`;
    const response = await axios.get(url);

    if (response.data.length > 0) {
      return {
        lat: parseFloat(response.data[0].lat),
        lng: parseFloat(response.data[0].lon),
      };
    } else {
      throw new Error("Invalid location. Please enter a correct location with proper spelling.");
    }
  } catch (error) {
    throw new Error("Failed to fetch coordinates. Please check your location spelling.");
  }
};


export const createPosts = async (req, res) => {
  try {
    const { heading, description, images, location, price, category, quantity, condition } = req.body;
    const author = req.user._id;

    if (!heading || !description || !location || !price || !category || !quantity || !condition) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }
    if (containsBannedWords(heading)) {
      return res.status(400).json({ message: "Your post contains restricted words in the title." });
    }
    if (containsBannedWords(description)) {
      return res.status(400).json({ message: "Your post contains restricted words in the description." });
    }
  
    const locationString = `${location.area}, ${location.city}, ${location.state}, ${location.country}`;

    let lat, lng;
    try {
      ({ lat, lng } = await getCoordinates(locationString));
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }

    let uploadedImage = "";
    if (images) {
      try {
        const result = await cloudinary.uploader.upload(images);
        uploadedImage = result.secure_url;
      } catch (uploadError) {
        return res.status(500).json({ message: "Image upload failed", error: uploadError.message });
      }
    }


    const moderationResult = await analyzeImage(uploadedImage);
    if (!moderationResult.isSafe) {
      return res.status(400).json({ message: `Image rejected: ${moderationResult.reason}` });
    }

    const newPost = new Post({
      heading,
      description,
      images: uploadedImage,
      location,
      quantity,
      condition,
      price,
      category,
      author,
      latitude: lat,
      longitude: lng
    });

    await newPost.save();
    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
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
    const userId = req.user.id;

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

export const updatePostt = async (req, res) => {
  try {
    const { id } = req.params;
    const allowedFields = ["heading", "description", "images", "location", "price", "condition", "category"];
    const updatedData = {};

    for (const field of allowedFields) {
      if (req.body[field]) {
        updatedData[field] = req.body[field];
      }
    }
    if (containsBannedWords(updatedData.heading)) {
      return res.status(400).json({ message: "Your post contains restricted words in the title." });
    }
    if (containsBannedWords(updatedData.description)) {
      return res.status(400).json({ message: "Your post contains restricted words in the description." });
    }

    const { location } = req.body;
    const locationString = `${location.area}, ${location.city}, ${location.state}, ${location.country}`;

    // Fetch coordinates
    const coordinates = await getCoordinates(locationString);
    
    if (!coordinates) {
      return res.status(400).json({ message: "Coordinates not found for the given address. Please try again." });
    }

    updatedData.latitude = coordinates.lat;
    updatedData.longitude = coordinates.lng;

    // Handle profile picture upload
    if (req.body.images) {
      try {
        const result = await cloudinary.uploader.upload(req.body.images);
        updatedData.images = result.secure_url;
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
    const moderationResult = await analyzeImage(updatedData.images);
    if (!moderationResult.isSafe) {
      return res.status(400).json({ message: `Image rejected: ${moderationResult.reason}` });
    }

    // Ensure post exists before updating
    const post = await Post.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true, select: "-password" }
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error("Error in updatePost controller:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

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

    // Get coordinates first
    const coordinates = await getCoordinates(location);
    if (!coordinates) {
      return res.status(400).json({ message: "Invalid location, please select another." });
    }

    const { lat, lng } = coordinates;

    // Use coordinates in cache key for uniqueness
    const cacheKey = `products:${productString}:${lat.toFixed(4)}:${lng.toFixed(4)}`;

    // Check if data exists in Redis
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    // Build MongoDB query
    const query = {
      latitude: { $gte: lat - 0.1, $lte: lat + 0.1 },
      longitude: { $gte: lng - 0.1, $lte: lng + 0.1 },
      $or: [
        { heading: { $regex: productString, $options: "i" } },
        { category: { $regex: productString, $options: "i" } },
      ],
    };

    // Fetch from MongoDB
    const products = await Post.find(query);

    // Save the result to Redis for 5 minutes
    await redis.set(cacheKey, JSON.stringify(products), "EX", 60 * 5);

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
};
