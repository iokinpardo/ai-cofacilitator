import { createWorker } from "tesseract.js";
import { MediaModel } from "../models/media.js";
import { getScreenshotBuffer } from "../services/mediaStore.js";

export interface CheckTagsInput {
  screenshotId: string;
  tags: string[];
  patterns?: Record<string, string[]>;
  threshold?: number;
}

export interface CheckTagsResult {
  positives: string[];
  evidence: { ocrSample: string };
}

export async function checkTagsInScreenshot({ screenshotId, tags, patterns }: CheckTagsInput): Promise<CheckTagsResult> {
  const media = await MediaModel.findById(screenshotId).lean();
  if (!media || media.type !== "screenshot" || !media.path) {
    throw new Error("Screenshot not found");
  }

  const buffer = await getScreenshotBuffer(media.path);
  const worker = await createWorker();
  try {
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const {
      data: { text }
    } = await worker.recognize(buffer);

    const positives: string[] = [];
    for (const tag of tags) {
      const hints = patterns?.[tag] ?? [tag];
      const matches = hints.some((hint) => {
        try {
          const regex = new RegExp(hint, "i");
          return regex.test(text);
        } catch {
          return text.toLowerCase().includes(hint.toLowerCase());
        }
      });
      if (matches) {
        positives.push(tag);
      }
    }

    return { positives, evidence: { ocrSample: text.slice(0, 300) } };
  } finally {
    await worker.terminate();
  }
}
