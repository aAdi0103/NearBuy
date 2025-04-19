import Service from "../Models/ServicesModel.js";
import User from "../Models/UserModel.js";
import cloudinary from "../Lib/cloudinaryConfig.js";
import axios from "axios";
import {analyzeImage} from '../Lib/signtEngine.js'
import levenshtein from "fast-levenshtein";
import redis from "../Lib/redis.js";
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
  "भैंचो", // bhaicho (shortened behenchod)
  "चूत", // chut (female genitalia)
  "झांट", // jhaant (pubic hair, insult)
  "सुअर", // suar (pig, derogatory)
  "कुत्ता", // kutta (dog, insult)
  "कुत्ते", // kutte (plural/variation of kutta)
  "बदतमीज़", // badtameez (rude/jerk)
  "नालायक", // nalayak (worthless)
  "बेशरम", // besharam (shameless)
  "लौंडा", // launda (boy, crude)
  "लौंडिया", // laundiya (girl, crude)
  "टट्टी", // tatti (shit)
  "पाद", // paad (fart)
  "मूत", // moot (piss)
  "गधा", // gadha (donkey, dumbass)
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
  "bullshit",
  "douche", // jerk/asshole
  "dickhead", // insult targeting stupidity
  "arse", // British variation of ass
  "bollocks", // testicles, nonsense
  "bugger", // crude term or annoyance
  "tosser", // jerk (British)
  "shag", // fuck (British)
  "piss", // urine or annoyance
  "crap", // shit, less intense
  "jerk", // mild insult
  "screw", // fuck, as in "screw you"
  "twit", // fool, mildly offensive
  "git", // jerk (British)
  "skank", // dirty/slutty person
  "arsehole", // British spelling of asshole
  "sonofabitch", // bastard
  "jackass", // dumbass
  "schmuck", // jerk (Yiddish)
  "fanny", // female genitalia (British)
  "knob", // dick or jerk
  // New additions
  "xxx", // adult content reference
  "xxnx", // variation of adult content term
  "porn", // pornography
  "xvideos", // adult site reference
  "pornhub", // adult site reference
  "xnxx", // adult content term
  "sex", // explicit term
  "sexy", // potentially inappropriate
  "nude", // explicit term
  "naked", // explicit term
  "erotic", // suggestive term
  "xxxvideo", // adult content variation
  "adult", // adult content reference
  "nsfw", // not safe for work
  "hardcore", // explicit content term
  "chutiyapa", // nonsense/stupidity
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
  "chutmarika", // derived from "चूत" + "marika"
  "gaandiya", // variation of "गांड"
  "bhosdiwala", // one who is a "भोसड़ीके"
  "madarfaat", // phonetic twist on "मादरचोद"
  "bitchyapa", // bitch + nonsense
  "fuckery", // fucking + behavior
  "dicku", // casual take on "dick"
  "pussywala", // crude emphasis on "pussy"
  "chutki", // small "चूत," sarcastic
  "lundpana", // dick-like behavior
  "haramzada", // variation of "हरामी"
  "bakwas", // bullshit/nonsense
  "jhantu", // derived from "झांट"
  "randipana", // whore-like behavior
  "chutiyebaaz", // one who acts like a "चूतिया"
  "gandupana", // ass-like behavior
  "bcpm", // combo of "bc" + "pm"
  "saala-shit", // "साला" + "shit"
  "kaminapan", // jerk-like behavior
  "fattush", // variation of "फट्टू"
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
    }

    throw new Error("Coordinates not found");
  } catch (error) {
    throw new Error("Coordinates not found"); // Ensure error is thrown
  }
};


export const createService = async (req, res) => {
  try {
    const { title, description, images, location, experience, price, duration, language, category } = req.body;
    const provider = req.user._id;

    if (!title || !description || !location || !experience || !price || !duration || !language || !category) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }
    if (containsBannedWords(title)) {
      return res.status(400).json({ message: "Your post contains restricted words in the title." });
    }
    if (containsBannedWords(description)) {
      return res.status(400).json({ message: "Your post contains restricted words in the description." });
    }
    if (containsBannedWords(language)) {
      return res.status(400).json({ message: "Your post contains restricted words in the language." });
    }

    // Format location object into a single string for geocoding
    const locationString = `${location.area}, ${location.city}, ${location.state}, ${location.country}`;

    let lat, lng;
    try {
      ({ lat, lng } = await getCoordinates(locationString));
    } catch (error) {
      return res.status(400).json({ message: "Invalid location. Please enter a correct location with proper spelling." });
    }

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

    const moderationResult = await analyzeImage(uploadedImage);
    if (!moderationResult.isSafe) {
      return res.status(400).json({ message: `Image rejected: ${moderationResult.reason}` });
    }

    // Ensure language is formatted as an array of strings
    const formattedLanguages = Array.isArray(language)
      ? language.map(lang => lang.trim())
      : [language.trim()];

    const newService = new Service({
      title,
      description,
      images: uploadedImage,
      location,
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
        // Extract the part of the URL that corresponds to the public_id
        const publicId = imgUrl.split("/").slice(-2, -1).join("/"); // Get public_id from URL path
    
        // Alternatively, you can use a regular expression to extract the public_id
        // const regex = /\/upload\/(.*?)(\.[a-zA-Z0-9]{3,4}$)/;
        // const match = imgUrl.match(regex);
        // const publicId = match ? match[1] : null; // If the match is successful, use the first group as public_id
    
        if (publicId) {
          try {
            // Delete the image from Cloudinary
            await cloudinary.uploader.destroy(publicId);
            console.log(`Image with public_id ${publicId} deleted successfully.`);
          } catch (error) {
            console.error("Error deleting image from Cloudinary:", error);
          }
        } else {
          console.error("Could not extract public_id from URL:", imgUrl);
        }
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



export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const allowedFields = ["title", "description", "images", "location", "price", "duration", "category", "experience", "language"];
    const updatedData = {};
    
    for (const field of allowedFields) {
      if (req.body[field]) {
        updatedData[field] = req.body[field];
      }
    }
    if (containsBannedWords(updatedData.title)) {
      return res.status(400).json({ message: "Your post contains restricted words in the title." });
    }
    if (containsBannedWords(updatedData.description)) {
      return res.status(400).json({ message: "Your post contains restricted words in the description." });
    }
    if (containsBannedWords(updatedData.language)) {
      return res.status(400).json({ message: "Your post contains restricted words in the language." });
    }

    const { location } = req.body;
    const locationString = `${location.area}, ${location.city}, ${location.state}, ${location.country}`;

    // Get latitude and longitude from the formatted location string
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
    // Ensure service exists before updating
    const service = await Service.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true, select: "-password" }
    );

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(service);
  } catch (error) {
    console.error("Error in updateService controller:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

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
     
    // Step 1: Get coordinates for the location
    const coordinates = await getCoordinates(location);
    if (!coordinates) {
      return res.status(400).json({ message: "Invalid location, please select another." });
    }

    const { lat, lng } = coordinates;

    // Step 2: Use precise coordinates in Redis cache key
    const cacheKey = `services:${search}:${lat.toFixed(4)}:${lng.toFixed(4)}`;

    // Step 3: Check Redis cache
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log("Returning from Redis...");
      return res.status(200).json(JSON.parse(cachedData));
    }

    const earthRadius = 6371;
    const maxDistance = 25;

    const latRadians = (Math.PI / 180) * lat;
    const lngRadians = (Math.PI / 180) * lng;

    const serviceString = String(search);

    // Step 4: MongoDB query with haversine
    const services = await Service.find({
      $or: [
        { title: { $regex: serviceString, $options: "i" } },
        { category: { $regex: serviceString, $options: "i" } },
      ],
      $expr: {
        $lte: [
          {
            $multiply: [
              earthRadius,
              {
                $acos: {
                  $add: [
                    {
                      $multiply: [
                        { $sin: latRadians },
                        { $sin: { $multiply: ["$latitude", Math.PI / 180] } },
                      ],
                    },
                    {
                      $multiply: [
                        { $cos: latRadians },
                        { $cos: { $multiply: ["$latitude", Math.PI / 180] } },
                        {
                          $cos: {
                            $subtract: [
                              { $multiply: ["$longitude", Math.PI / 180] },
                              lngRadians,
                            ],
                          },
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          maxDistance,
        ],
      },
    });

    // Step 5: Save to Redis cache
    await redis.set(cacheKey, JSON.stringify(services), "EX", 60 * 5); // 5 minutes

    res.status(200).json(services);
  } catch (error) {
    console.error("Error in getSearchedServices:", error);
    res.status(500).json({ message: "Error fetching services" });
  }
};



