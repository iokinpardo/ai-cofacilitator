export interface ScreenCaptureConfig {
  intervalMs: number;
  onCapture: (blob: Blob) => Promise<void> | void;
}

export class ScreenCapturer {
  private stream: MediaStream | null = null;
  private timer: number | null = null;

  constructor(private readonly config: ScreenCaptureConfig) {}

  async start() {
    this.stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    await this.captureOnce();
    this.timer = window.setInterval(() => {
      void this.captureOnce();
    }, this.config.intervalMs);
  }

  stop() {
    if (this.timer) {
      window.clearInterval(this.timer);
    }
    this.timer = null;
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
  }

  private async captureOnce() {
    if (!this.stream) return;
    const [track] = this.stream.getVideoTracks();
    if (!track) return;
    const captureFactory = (window as any).ImageCapture;
    if (!captureFactory) {
      throw new Error("ImageCapture API is not supported in this browser");
    }
    const imageCapture = new captureFactory(track) as { grabFrame?: () => Promise<ImageBitmap> };
    if (!imageCapture.grabFrame) {
      throw new Error("grabFrame is not available on this platform");
    }
    const bitmap = await imageCapture.grabFrame();

    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(bitmap, 0, 0);

    return new Promise<void>((resolve, reject) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          reject(new Error("Failed to capture screen"));
          return;
        }
        try {
          await this.config.onCapture(blob);
          resolve();
        } catch (error) {
          reject(error);
        }
      }, "image/png");
    });
  }
}
