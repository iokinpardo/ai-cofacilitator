import express from "express";
import multer from "multer";
import { saveScreenshot } from "../services/mediaStore.js";
import { MediaModel } from "../models/media.js";
import { Types } from "mongoose";
import { connectToDatabase } from "../utils/database.js";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

export const screenshotsRouter = express.Router();

screenshotsRouter.use(async (_req, _res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    next(error);
  }
});

screenshotsRouter.post("/", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Screenshot file is required" });
    }

    const { id, filePath, meta } = await saveScreenshot(req.file.buffer);

    const media = await MediaModel.create({
      type: "screenshot",
      contentType: req.file.mimetype || "image/png",
      path: filePath,
      meta
    });

    const screenshotId = media._id instanceof Types.ObjectId ? media._id.toString() : String(media._id);

    res.status(201).json({ screenshotId, storageId: id });
  } catch (error) {
    next(error);
  }
});
