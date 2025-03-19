import User from "../Models/UserModel.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

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

export const signup = async (req, res) => {
	try {
		const { name, email, password, location } = req.body;

		// Validate required fields
		if (!name || !email || !password || !location || !location.area||!location.city || !location.state || !location.country) {
			return res.status(400).json({ message: "All fields including location (city, state, country) are required" });
		}


		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: "Email already exists" });
		}

		const locationString = `${location.area}, ${location.city}, ${location.state}, ${location.country}`;

		// Get latitude and longitude from the formatted location string
		const { lat, lng } = await getCoordinates(locationString);
		// Hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Create new user
		const user = new User({
			name,
			email,
			password: hashedPassword,
			location: {
				area:location.area,
				city: location.city,
				state: location.state,
				country: location.country
			},
			latitude:lat,
			longitude:lng
		});
		await user.save();

		// Generate JWT Token
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

		// Set token in cookies
		res.cookie("jwt-token", token, {
			httpOnly: true,
			maxAge: 3 * 24 * 60 * 60 * 1000,
			sameSite: "strict",
			secure: process.env.NODE_ENV === "production",
		});

		res.status(201).json({ message: "User registered successfully" });

	} catch (error) {
		console.log("Error in signup:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const login = async function(req,res){
    try {
		const {email, password } = req.body;

		if (!email ||!password) {
			return res.status(400).json({ message: "All fields are required" });
		}
		
		let currUser = await User.findOne({ email});
		if(!currUser){
			return res.status(401).json({ message: "Invalid credentials" });

		}

		const matchPassword = await bcrypt.compare(password,currUser.password);
		if(!matchPassword){
			return res.status(401).json({ message: "Invalid credentials" });
		}


		const token = jwt.sign({ userId: currUser._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

		await res.cookie("jwt-token", token, {
			httpOnly: true, // prevent XSS attack
			maxAge: 3 * 24 * 60 * 60 * 1000,
			sameSite: "strict", // prevent CSRF attacks,
			secure: process.env.NODE_ENV === "production", // prevents man-in-the-middle attacks
		});

		res.json({ message: "User loggedIN successfully" });

	} catch (error) {
		console.log("Error in login: ", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
}

export const logout = function(req,res){
    res.clearCookie('jwt-token');
	res.json({ message: "Logged out successfully" });
}

export const getCurrentUser = async (req, res) => {
	try {
		res.json(req.user);
	} catch (error) {
		console.error("Error in getCurrentUser controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};