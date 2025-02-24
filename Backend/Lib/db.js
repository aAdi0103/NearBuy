import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected...");
  } catch (e) {
    console.error(`Error connecting to MongoDB: ${e.message}`);
    process.exit(1);
  }
};
