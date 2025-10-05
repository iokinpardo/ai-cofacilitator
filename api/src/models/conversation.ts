import { Schema, model, InferSchemaType, HydratedDocument } from "mongoose";

const ConversationSchema = new Schema({
  sessionId: { type: Schema.Types.ObjectId, ref: "Session", required: true },
  model: { type: String, required: true },
  voice: { type: String, required: true },
  mode: { type: String, enum: ["voice", "text"], required: true },
  screenContextEnabled: { type: Boolean, default: false },
  snapshotIntervalSec: { type: Number, default: 120 },
  startedAt: { type: Date, default: () => new Date() },
  endedAt: Date
}, { timestamps: true });

type ConversationSchemaType = InferSchemaType<typeof ConversationSchema>;

export type ConversationDocument = HydratedDocument<ConversationSchemaType>;

export const ConversationModel = model<ConversationSchemaType>("Conversation", ConversationSchema);
