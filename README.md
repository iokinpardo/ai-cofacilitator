# AI Co-Facilitator

A monorepo containing a React/Vite front-end and a Node.js/Express backend that together implement the "AI Co-Facilitator" experience. The solution connects to OpenAI's `gpt-realtime` model over WebRTC for low-latency voice + text interactions, manages facilitator sessions in MongoDB, stores screen snapshots, and dynamically augments prompts with tag-specific sub-prompts detected via OCR.

## Repository structure

```
/ (root)
├─ api/        # Express server (TypeScript)
└─ web/        # React UI (Vite + TypeScript)
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB instance
- OpenAI API key with access to `gpt-realtime`

## Getting started

1. Install all workspace dependencies from the repo root:

   ```bash
   npm install --workspaces
   ```

2. Configure environment variables.

   Copy `api/.env.example` to `api/.env` and fill in the values:

   ```bash
   cp api/.env.example api/.env
   ```

   - `OPENAI_API_KEY` – Server-side API key. The browser never sees this value.
   - `REALTIME_MODEL` – Defaults to `gpt-realtime`.
   - `MONGO_URI` – MongoDB connection string.
   - `ASSETS_DIR` – Optional directory for storing uploaded screenshots (defaults to `uploads/`).

3. Start the backend:

   ```bash
   npm run dev:api
   ```

4. Start the front-end in a new terminal:

   ```bash
   npm run dev:web
   ```

5. Open the UI at http://localhost:5173.

## Backend highlights (`/api`)

- Mint short-lived WebRTC client secrets via `/api/realtime/client-secret`.
- CRUD APIs for facilitator sessions (`/api/sessions`).
- Screenshot upload endpoint (`/api/screenshots`) that stores PNGs on disk and metadata in MongoDB.
- Tool bridge (`/api/tools/check-tags`) that performs OCR using Tesseract.js to detect configured tags.
- MongoDB models that follow the data model defined in the project brief (`sessions`, `conversations`, `turns`, `media`).

## Front-end highlights (`/web`)

- Session editor for system prompts, tags, and OCR hints.
- Live conversation console that performs the WebRTC SDP exchange with `gpt-realtime` (no WebSockets).
- Transcript viewer that captures both user ASR streams and assistant responses.
- Screen sharing controls that capture periodic snapshots, upload them to the backend, and surface a live preview.
- Automatic tool invocation flow that reacts to `check_tags_in_screenshot` calls, forwards them to the backend, and appends sub-prompts to the system instructions for the current reply only.

## Production considerations

- Harden CORS and authentication before exposing the API publicly.
- Replace the on-disk screenshot store with S3 or MongoDB GridFS for better durability.
- Add archival transcription endpoints if offline STT is required.
- Deploy the front-end behind HTTPS so that getUserMedia and getDisplayMedia permissions succeed.

## License

This project is provided as-is for demonstration purposes.
