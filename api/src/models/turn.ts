import { Schema, model, Document, Types } from "mongoose";

export interface TurnDocument extends Document {
  conversationId: Types.ObjectId;
  role: "user" | "assistant";
  modalities: ("audio" | "text")[];
  text?: string;
  audioUrl?: string;
  screenshotIds?: Types.ObjectId[];
  detectedTags?: string[];
  appliedSubPrompts?: string[];
  latencyMs?: number;
  createdAt: Date;
}

const TurnSchema = new Schema<TurnDocument>({
  conversationId: { type: Schema.Types.ObjectId, ref: "Conversation", required: true },
  role: { type: String, enum: ["user", "assistant"], required: true },
  modalities: { type: [String], default: ["text"] },
  text: String,
  audioUrl: String,
  screenshotIds: [{ type: Schema.Types.ObjectId, ref: "Media" }],
  detectedTags: [String],
  appliedSubPrompts: [String],
  latencyMs: Number
}, { timestamps: { createdAt: true, updatedAt: false } });

export const TurnModel = model<TurnDocument>("Turn", TurnSchema);
