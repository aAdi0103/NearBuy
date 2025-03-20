import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import path from "path";
import cors from 'cors'


// Load .env from the project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import express from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./Lib/db.js";

import authRoutes from "./Routes/authRouter.js";
import userRoutes from "./Routes/userRouter.js"
import postRoutes from "./Routes/postRouter.js"
import serviceRoutes from "./Routes/serviceRouter.js"
import notificationRoutes from './Routes/notificationRouter.js'
const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));



app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/services",serviceRoutes);
app.use("/api/v1/notifications", notificationRoutes);



app.get("/", (req, res) => {
  res.send("Hello");
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
