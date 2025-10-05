import mongoose from "mongoose";
import { config } from "../config.js";

let isConnected = false;

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (isConnected) {
    return mongoose;
  }

  if (!config.mongoUri) {
    throw new Error("MONGO_URI is not configured");
  }

  await mongoose.connect(config.mongoUri);
  isConnected = true;
  return mongoose;
}

mongoose.connection.on("error", (err) => {
  console.error("[mongo] connection error", err);
});

mongoose.connection.on("disconnected", () => {
  isConnected = false;
  console.warn("[mongo] disconnected");
});
