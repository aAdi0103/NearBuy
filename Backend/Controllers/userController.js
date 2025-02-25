import User from '../Models/UserModel.js'


export const updateProfile = async (req, res) => {
	try {
		const allowedFields = [
			"name",
			"location",
			"profilePic",
            "contactDetails",
		];

		const updatedData = {};

		for (const field of allowedFields) {
			if (req.body[field]) {
				updatedData[field] = req.body[field];
			}
		}
		if (req.body.profilePic) {
			const result = await cloudinary.uploader.upload(req.body.profilePic);
			updatedData.profilePic = result.secure_url;
		}

		const user = await User.findByIdAndUpdate(req.user._id, { $set: updatedData }, { new: true }).select(
			"-password"
		);

		res.json(user);
	} catch (error) {
		console.error("Error in updateProfile controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};