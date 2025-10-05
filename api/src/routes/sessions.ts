import express from "express";
import { SessionModel } from "../models/session.js";
import { connectToDatabase } from "../utils/database.js";

export const sessionsRouter = express.Router();

sessionsRouter.use(async (_req, _res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    next(error);
  }
});

sessionsRouter.post("/", async (req, res, next) => {
  try {
    const session = await SessionModel.create(req.body);
    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
});

sessionsRouter.get("/", async (_req, res, next) => {
  try {
    const sessions = await SessionModel.find().lean();
    res.json(sessions);
  } catch (error) {
    next(error);
  }
});

sessionsRouter.get("/:id", async (req, res, next) => {
  try {
    const session = await SessionModel.findById(req.params.id).lean();
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    res.json(session);
  } catch (error) {
    next(error);
  }
});

sessionsRouter.put("/:id", async (req, res, next) => {
  try {
    const session = await SessionModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    res.json(session);
  } catch (error) {
    next(error);
  }
});

sessionsRouter.delete("/:id", async (req, res, next) => {
  try {
    const result = await SessionModel.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Session not found" });
    }
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});
