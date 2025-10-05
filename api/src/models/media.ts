import { Schema, model, Document, Types } from "mongoose";

export type MediaType = "screenshot" | "audio";

export interface MediaDocument extends Document {
  conversationId?: Types.ObjectId;
  type: MediaType;
  contentType: string;
  url?: string;
  path?: string;
  meta?: Record<string, unknown>;
  createdAt: Date;
}

const MediaSchema = new Schema<MediaDocument>({
  conversationId: { type: Schema.Types.ObjectId, ref: "Conversation" },
  type: { type: String, enum: ["screenshot", "audio"], required: true },
  contentType: { type: String, required: true },
  url: String,
  path: String,
  meta: Schema.Types.Mixed
}, { timestamps: { createdAt: true, updatedAt: false } });

export const MediaModel = model<MediaDocument>("Media", MediaSchema);
