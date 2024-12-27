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
    if (!req.body || !(req.body instanceof Buffer)) {
      res.status(400).json({ success: false, message: "No valid image found" });
      return;
    }

    const tmpDir = "/tmp";
    const uniqueFileName = `image_${Date.now()}.jpg`;
    const fullPath = path.join(tmpDir, uniqueFileName);

    fs.writeFileSync(fullPath, req.body);

    const data = await process_image(fullPath);
    const formattedData = format_api_response(data);

    broadcast({
      ...formattedData,
      speed: 120,
      display_duration: 10000,
      message: "Speeding Alert, Please slow down and be careful!",
    });
    res.status(200).json({
      success: true,
      message: "Image processed and broadcasted",
    });

    fs.unlinkSync(fullPath);
  } catch (error) {
    console.error("Error in /upload route:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing the image.",
    });
  }
});

export default router;
