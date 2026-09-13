import type { Request, Response } from "express";

export default function healthHandler(_req: Request, res: Response) {
  res.status(200).json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
}
