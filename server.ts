import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import chatServerlessHandler from "./api/chat";

dotenv.config();

const PORT = 3000;

export function healthHandler(_req: Request, res: Response) {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "4mb" }));
  app.get("/api/health", healthHandler);
  app.post("/api/chat", (req, res) => chatServerlessHandler(req, res));

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Validador Linx Taste One server running on http://localhost:${PORT}`);
  });
}

if (process.env.VERCEL !== "1") {
  startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exitCode = 1;
  });
}
