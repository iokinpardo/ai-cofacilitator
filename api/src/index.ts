import express from "express";
import cors from "cors";
import morgan from "morgan";
import { config } from "./config.js";
import { realtimeRouter } from "./routes/realtime.js";
import { sessionsRouter } from "./routes/sessions.js";
import { screenshotsRouter } from "./routes/screenshots.js";
import { toolsRouter } from "./routes/tools.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

app.use("/api/realtime", realtimeRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/screenshots", screenshotsRouter);
app.use("/api/tools", toolsRouter);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[api] error", err);
  res.status(500).json({ message: err instanceof Error ? err.message : "Internal server error" });
});

app.listen(config.port, () => {
  console.log(`API server listening on port ${config.port}`);
});
