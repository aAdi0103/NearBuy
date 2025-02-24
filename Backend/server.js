import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import path from "path";

// Load .env from the project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import express from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./Lib/db.js";

const app = express();
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
