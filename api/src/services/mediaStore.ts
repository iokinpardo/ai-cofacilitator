import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import sharp from "sharp";
import { config } from "../config.js";

async function ensureDir() {
  await fs.mkdir(config.assetsDir, { recursive: true });
}

export async function saveScreenshot(buffer: Buffer): Promise<{ id: string; filePath: string; meta: { width: number; height: number } }> {
  await ensureDir();
  const id = randomUUID();
  const filePath = path.join(config.assetsDir, `${id}.png`);
  const image = sharp(buffer).png();
  const metadata = await image.metadata();
  await image.toFile(filePath);

  return {
    id,
    filePath,
    meta: {
      width: metadata.width ?? 0,
      height: metadata.height ?? 0
    }
  };
}

export async function getScreenshotBuffer(filePath: string): Promise<Buffer> {
  return fs.readFile(filePath);
}
