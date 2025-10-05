import { Schema, model, Document } from "mongoose";

export interface Tag {
  key: string;
  description?: string;
  subPrompt: string;
  patterns?: string[];
  threshold?: number;
}

export interface SessionDocument extends Document {
  name: string;
  systemPrompt: string;
  tags: Tag[];
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TagSchema = new Schema<Tag>({
  key: { type: String, required: true },
  description: String,
  subPrompt: { type: String, required: true },
  patterns: [String],
  threshold: Number
});

const SessionSchema = new Schema<SessionDocument>({
  name: { type: String, required: true },
  systemPrompt: { type: String, required: true },
  tags: { type: [TagSchema], default: [] },
  createdBy: String
}, { timestamps: true });

export const SessionModel = model<SessionDocument>("Session", SessionSchema);
