import User from '../Models/UserModel.js'
import cloudinary from '../Lib/cloudinaryConfig.js'

export const updateProfile = async (req, res) => {
	try {
		const allowedFields = ["name", "profilePic", "location","role","About","Phone"];
		const updatedData = {};
		for (const field of allowedFields) {
			if (req.body[field]) {
				updatedData[field] = req.body[field];
			}
		}
		// Handle profile picture upload
		if (req.body.profilePic) {
			try{
			const result = await cloudinary.uploader.upload(req.body.profilePic);
			updatedData.profilePic = result.secure_url;
			}catch(error){
			}
		}

		// Ensure user exists before updating
		const user = await User.findByIdAndUpdate(
			req.user._id, // Ensures only the logged-in user can update their profile
			{ $set: updatedData },
			{ new: true, select: "-password" } // Exclude password field from response
		);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json(user);
	}
	 catch (error) {
		console.error("Error in updateProfile controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const getPublicProfile = async (req, res) => {
	try { 
          const {id} = req.params;
		  console.log("wdcf",id)
		const user = await User.findOne({ _id: id }).select("-password");

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json(user);
	} catch (error) {
		console.error("Error in getPublicProfile controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};
export const FromEmail = async (req, res) => {
	try { 
          const {id} = req.params;
		const user = await User.findOne({ email: id }).select("-password");

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json(user);
	} catch (error) {
		console.error("Error in getPublicProfile controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};