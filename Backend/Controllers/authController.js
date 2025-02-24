// // import User from "../Models/userModel.js";
// import bcrypt from "bcryptjs"
// import jwt from "jsonwebtoken"


// export const signup = async (req, res) => {
// 	try {
// 		const { name, username, email, password } = req.body;

// 		if (!name || !username || !email || !password) {
// 			return res.status(400).json({ message: "All fields are required" });
// 		}
// 		const existingEmail = await User.findOne({ email });
// 		if (existingEmail) {
// 			return res.status(400).json({ message: "Email already exists" });
// 		}

// 		const existingUsername = await User.findOne({ username });
// 		if (existingUsername) {
// 			return res.status(400).json({ message: "Username already exists" });
// 		}

// 		if (password.length < 6) {
// 			return res.status(400).json({ message: "Password must be at least 6 characters" });
// 		}

// 		const salt = await bcrypt.genSalt(10);
// 		const hashedPassword = await bcrypt.hash(password, salt);

// 		const user = new User({
// 			name,
// 			email,
// 			password: hashedPassword,
// 			username
// 		});

// 		await user.save();

// 		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

// 		res.cookie("jwt-linkedin", token, {
// 			httpOnly: true, // prevent XSS attack
// 			maxAge: 3 * 24 * 60 * 60 * 1000,
// 			sameSite: "strict", // prevent CSRF attacks,
// 			secure: process.env.NODE_ENV === "production", // prevents man-in-the-middle attacks
// 		});

// 		res.status(201).json({ message: "User registered successfully" });

// 		const profileUrl = process.env.PROFILE_URL + '/profile/' + user.username;

// 		try{

// 			await sendWelcomeEmail(user.email,user.name,profileUrl);

// 		}catch(e){
// 			console.error("Error sending welcome email: ", e.message);

// 		}

// 	} catch (error) {
// 		console.log("Error in signup: ", error.message);
// 		res.status(500).json({ message: "Internal server error" });
// 	}
// };

// export const login = async function(req,res){
//     try {
// 		const {username, password } = req.body;

// 		if (!username ||!password) {
// 			return res.status(400).json({ message: "All fields are required" });
// 		}
		
// 		let currUser = await User.findOne({ username});
// 		if(!currUser){
// 			return res.status(401).json({ message: "Invalid credentials" });

// 		}

// 		const matchPassword = await bcrypt.compare(password,currUser.password);
// 		if(!matchPassword){
// 			return res.status(401).json({ message: "Invalid credentials" });
// 		}


// 		const token = jwt.sign({ userId: currUser._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

// 		await res.cookie("jwt-linkedin", token, {
// 			httpOnly: true, // prevent XSS attack
// 			maxAge: 3 * 24 * 60 * 60 * 1000,
// 			sameSite: "strict", // prevent CSRF attacks,
// 			secure: process.env.NODE_ENV === "production", // prevents man-in-the-middle attacks
// 		});

// 		res.json({ message: "User loggedIN successfully" });

// 	} catch (error) {
// 		console.log("Error in login: ", error.message);
// 		res.status(500).json({ message: "Internal server error" });
// 	}
// }

// export const logout = function(req,res){
//     res.clearCookie('jwt-linkedin');
// 	res.json({ message: "Logged out successfully" });
// }

// export const getCurrentUser = async (req, res) => {
// 	try {
// 		res.json(req.user);
// 	} catch (error) {
// 		console.error("Error in getCurrentUser controller:", error);
// 		res.status(500).json({ message: "Server error" });
// 	}
// };