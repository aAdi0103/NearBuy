import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_USER = process.env.SIGNTENGINE_API_KEY;
const API_SECRET = process.env.SIGNTENGINE_API_SECRET;

export const analyzeImage = async (imageURL) => {
  try {
    const response = await axios.get("https://api.sightengine.com/1.0/check.json", {
      params: {
        url: imageURL,
        models: "nudity-2.0,wad,offensive",
        api_user: API_USER,
        api_secret: API_SECRET,
      },
    });

    const data = response.data;

    if (data.nudity.raw > 0.7 || data.nudity.partial > 0.7) {
      return { isSafe: false, reason: "Explicit nudity detected" };
    }

    if (data.nudity.suggestive > 0.7) {
      return { isSafe: false, reason: "unwanted content detected" };
    }

    if (data.weapon > 0.7) {
      return { isSafe: false, reason: "unwanted content detected" };
    }

    return { isSafe: true, reason: "Safe image" };
  } catch (error) {
    console.error("Sightengine Error:", error);
    return { isSafe: false, reason: "Failed to analyze image" };
  }
};