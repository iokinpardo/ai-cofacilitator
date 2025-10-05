export interface TagConfig {
  key: string;
  description?: string;
  subPrompt: string;
  patterns?: string[];
  threshold?: number;
}

export interface Session {
  _id?: string;
  name: string;
  systemPrompt: string;
  tags: TagConfig[];
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ConversationMode = "voice" | "text";

export interface ConversationConfig {
  mode: ConversationMode;
  voice: string;
  transcriptionModel: string;
  screenContextEnabled: boolean;
  snapshotIntervalSec: number;
}

export interface TranscriptEntry {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}
