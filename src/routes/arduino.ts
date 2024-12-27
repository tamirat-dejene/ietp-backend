import express from "express";
import { process_image } from "../lib/api.js";
import { format_api_response } from "../utils/middlewares.js";
import { broadcast } from "../lib/websocket.js";
import path from "path";
import fs from "fs";

const router = express.Router();

// Ensure raw middleware for image/jpeg
router.use(express.raw({ type: "image/jpeg", limit: "10mb" }));

router.post("/upload", async (req, res) => {
  try {
    // Check if req.body contains data
    if (!req.body || !(req.body instanceof Buffer)) {
      res.status(400).json({ success: false, message: "No valid image found" });
      return;
    }

    // Save the image
    const filePath = path.join(path.resolve(), "public/uploads");
    const uniqueFileName = `image_${Date.now()}.jpg`;
    const fullPath = path.join(filePath, uniqueFileName);

    // Ensure the upload directory exists
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }

    // Write the image file to disk
    fs.writeFileSync(fullPath, req.body);

    // Process the image
    const data = await process_image(fullPath);
    const formattedData = format_api_response(data);

    // Broadcast the formatted data
    broadcast({
      ...formattedData,
      speed: 120,
      display_duration: 10000,
      message: "Speeding Alert, Please slow down and be careful!",
    });

    // Send response
    res.status(200).json({
      success: true,
      message: "Image processed and broadcasted",
    });
  } catch (error) {
    console.error("Error in /upload route:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing the image.",
    });
  }
});

export default router;