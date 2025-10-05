import express from "express";
import fetch from "node-fetch";
import { config } from "../config.js";

export const realtimeRouter = express.Router();

realtimeRouter.post("/client-secret", async (_req, res, next) => {
  try {
    if (!config.openAIApiKey) {
      return res.status(500).json({ error: "Server is missing OPENAI_API_KEY" });
    }

    const response = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.openAIApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ model: config.realtimeModel })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(500).json({ error: errorText });
    }

    const json = await response.json();
    res.json(json);
  } catch (error) {
    next(error);
  }
});
