import express from "express";
import { checkTagsInScreenshot } from "../tools/checkTags.js";
import { connectToDatabase } from "../utils/database.js";

export const toolsRouter = express.Router();

toolsRouter.use(async (_req, _res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    next(error);
  }
});

toolsRouter.post("/check-tags", async (req, res, next) => {
  try {
    const { screenshotId, tags, patterns, threshold } = req.body;
    if (!screenshotId || !Array.isArray(tags)) {
      return res.status(400).json({ message: "screenshotId and tags are required" });
    }

    const result = await checkTagsInScreenshot({ screenshotId, tags, patterns, threshold });
    res.json(result);
  } catch (error) {
    next(error);
  }
});
