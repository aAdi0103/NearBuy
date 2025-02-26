import Post from "../Models/PostModel.js";
import User from "../Models/UserModel.js"
import cloudinary from '../Lib/cloudinaryConfig.js'
// import Notification from '../Models/notificationModel.js'

// export const getFeedPosts = async function (req, res) {
//   try {
//     const posts = await Post.find({author:{$in:[...req.user.connections,req.user.id]}})	
//     // .populate() is a method used to replace references (usually ObjectIds) in a document with the actual data from the referenced collection.
//       .populate("author", "name username profilePicture headline")
//       .populate("comments.user", "name profilePicture")
//       .sort({ createdAt: -1 });
//       res.status(200).json(posts);
//   } catch (error) {
//     console.error("Error in getFeedPosts: ", error.message);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

export const createPosts = async (req, res) => {
    try {
      const { heading, description, images, location, price, category } = req.body;
      const author = req.user._id;
  
      let uploadedImages = [];
  
      if (images && images.length > 0) {
        for (let image of images) {
          const imgResult = await cloudinary.uploader.upload(image);
          uploadedImages.push(imgResult.secure_url);
        }
      }
  
      const newPost = new Post({
        heading,
        description,
        images: uploadedImages,
        location,
        price,
        category,
        author,
      });
  
      await newPost.save();
      await User.findByIdAndUpdate(author, { $push: { posts: newPost._id } });

  
      res.status(201).json({ message: "Post created successfully", post: newPost });

    } catch (error) {
      console.error("Error in createPost controller:", error);
      res.status(500).json({ message: "Server error" });
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
