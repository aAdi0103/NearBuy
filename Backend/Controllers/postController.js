import Post from "../Models/PostModel.js";
import User from "../Models/UserModel.js"
import cloudinary from '../Lib/cloudinaryConfig.js'

export const createPosts = async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    // Destructure required fields
    const { heading, description, images, location, price, category, quantity, condition } = req.body;
    const author = req.user._id;

    // Check if all required fields are provided
    if (!heading || !description || !location || !price || !category || !quantity || !condition) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }
    
    console.log("CLOUDINARY_CLOUD_NAME:",process.env.CLOUDINARY_CLOUD_NAME);
    console.log("CLOUDINARY_API_KEY:",process.env.CLOUDINARY_API_KEY);
    console.log("CLOUDINARY_API_SECRET:",process.env.CLOUDINARY_API_SECRET ? process.env.CLOUDINARY_API_SECRET : "NOT SET");
    
    // Upload single image to Cloudinary
    let uploadedImage = "";

    if (images){
      try {
        console.log(req.body.images)
        const result = await  cloudinary.uploader.upload(req.body.images);
        console.log("jbfv")
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
    });

    // Save post to database
    await newPost.save();

    // Update user with new post reference
    await User.findByIdAndUpdate(author, { $push: { Post: newPost._id } });

    // Success response
    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error("Error in createPost controller:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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

        // Check if the current user is the author of the post 
        if (post.author.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this post" });
        }

        // Delete all images from Cloudinary
        if (post.images && post.images.length > 0) {
            for (let imageUrl of post.images) {
                const publicId = imageUrl.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            }
        }

        // Delete the post from the database
        await Post.findByIdAndDelete(postId);

        // Remove the post reference from the user's posts array
        await User.findByIdAndUpdate(userId, { $pull: { posts: postId } });
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.log("Error in delete post controller:", error.message);
        res.status(500).json({ message: "Server error" });
    }
}

export const getCategories = async (req, res) => {
  try {
    const categories = await Post.distinct("category");

    if (!categories || categories.length === 0) {
      return res.status(404).json({ message: "No categories found" });
    }

    console.log("Categories fetched:", categories);
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};





// export const getPostById = async (req, res) => {
// 	try {
// 		const postId = req.params.id;
// 		const post = await Post.findById(postId)
// 			.populate("author", "name username profilePicture headline")
// 			.populate("comments.user", "name profilePicture username headline");

// 		res.status(200).json(post);
// 	} catch (error) {
// 		console.error("Error in getPostById controller:", error);
// 		res.status(500).json({ message: "Server error" });
// 	}
// };
