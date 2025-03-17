import Post from "../Models/PostModel.js";
import User from "../Models/UserModel.js"
import cloudinary from '../Lib/cloudinaryConfig.js'
// import Product from "../../Frontend/src/Pages/Product.jsx";


export const createPosts = async (req, res) => {
  try {
    // Destructure required fields
    const { heading, description, images, location, price, category, quantity, condition } = req.body;
    const author = req.user._id;
    // Check if all required fields are provided
    if (!heading || !description || !location || !price || !category || !quantity || !condition) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }
  
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
    });

    // Save post to database
    await newPost.save();

    // Update user with new post reference
    // await User.findByIdAndUpdate(author, { $push: { posts: newPost._id } });

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
    console.log("Extracted id:", id);

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
  console.log(req.body);
    const allowedFields = ["heading", "description", "images","location","price","condition","category"];
    const updatedData = {};
    for (const field of allowedFields) {
      if (req.body[field]) {
        updatedData[field] = req.body[field];
      }
    }
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