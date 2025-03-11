import User from '../Models/UserModel.js'


export const updateProfile = async (req, res) => {
	try {
		const allowedFields = [
			"name",
		];

		const updatedData = {};

		for (const field of allowedFields) {
			if (req.body[field]) {
				updatedData[field] = req.body[field];
			}
		}
		// if (req.body.profilePicture) {
		// 	const result = await cloudinary.uploader.upload(req.body.profilePicture);
		// 	updatedData.profilePicture = result.secure_url;
		// }

		// if (req.body.bannerImg) {
		// 	const result = await cloudinary.uploader.upload(req.body.bannerImg);
		// 	updatedData.bannerImg = result.secure_url;
		// }



		const user = await User.findByIdAndUpdate(req.user._id, { $set: updatedData }, { new: true }).select(
			"-password"
		);

		res.json(user);
	} catch (error) {
		console.error("Error in updateProfile controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};





export const getPublicProfile = async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.params.id }).select("-password");

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json(user);
	} catch (error) {
		console.error("Error in getPublicProfile controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};