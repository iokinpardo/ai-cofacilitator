import dotenv from "dotenv";
import path from "path";

dotenv.config();

const assetsDir = process.env.ASSETS_DIR ?? path.join(process.cwd(), "uploads");

export const config = {
  port: Number(process.env.PORT ?? 3001),
  openAIApiKey: process.env.OPENAI_API_KEY ?? "",
  realtimeModel: process.env.REALTIME_MODEL ?? "gpt-realtime",
  mongoUri: process.env.MONGO_URI ?? "",
  assetsDir
};

if (!config.openAIApiKey) {
  console.warn("[config] OPENAI_API_KEY is not set. Realtime client secret minting will fail until configured.");
}

if (!config.mongoUri) {
  console.warn("[config] MONGO_URI is not set. MongoDB operations will fail until configured.");
}
