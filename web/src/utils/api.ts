import axios from "axios";
import { Session, TagConfig } from "../types";

const api = axios.create({
  baseURL: "/api"
});

export async function listSessions(): Promise<Session[]> {
  const { data } = await api.get<Session[]>("/sessions");
  return data;
}

export async function createSession(payload: Omit<Session, "_id" | "createdAt" | "updatedAt">): Promise<Session> {
  const { data } = await api.post<Session>("/sessions", payload);
  return data;
}

export async function updateSession(id: string, payload: Partial<Session>): Promise<Session> {
  const { data } = await api.put<Session>(`/sessions/${id}`, payload);
  return data;
}

export async function deleteSession(id: string): Promise<void> {
  await api.delete(`/sessions/${id}`);
}

export async function fetchClientSecret(): Promise<{ client_secret: { value: string; expires_at: number } }> {
  const { data } = await api.post("/realtime/client-secret", {});
  return data;
}

export async function uploadScreenshot(file: Blob): Promise<{ screenshotId: string }> {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post<{ screenshotId: string }>("/screenshots", form, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
}

export async function runTagCheck(args: { screenshotId: string; tags: string[]; patterns: Record<string, string[]>; threshold?: number }) {
  const { data } = await api.post("/tools/check-tags", args);
  return data as { positives: string[]; evidence: { ocrSample: string } };
}

export function buildPatternsMap(tags: TagConfig[]): Record<string, string[]> {
  return Object.fromEntries(tags.map((tag) => [tag.key, tag.patterns ?? []]));
}
