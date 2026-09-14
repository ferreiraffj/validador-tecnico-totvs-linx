import { GoogleGenAI } from "@google/genai";
import { buildSystemInstruction, detectSystems, SupportedSystem } from "../src/shared/auditor/buildPrompt";
import { fallbackResponse } from "../src/shared/auditor/fallbackResponse";
import { validateMessages, AuditMessage } from "../src/shared/auditor/validateInfrastructure";

type ApiRequest = { method?: string; body?: { messages?: unknown } };
type ApiResponse = { status: (code: number) => ApiResponse; json: (body: unknown) => void };

export default async function chatHandler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido." });
  if (!validateMessages(req.body?.messages)) {
    return res.status(400).json({ error: "Mensagens inválidas ou quantidade excedida." });
  }

  const messages = req.body.messages;
  const systems = detectSystems(messages.filter((message) => message.role === "user").map((message) => message.content).join("\n"));
  if (systems.length !== 1) {
    return res.status(200).json({
      reply:
        systems.length > 1
          ? "Identifiquei mais de um sistema. Informe apenas um: **TasteOne PDV**, **TasteOne Autoatendimento** ou **Degust PDV**."
          : "Antes da comparação, informe qual sistema será utilizado: **TasteOne PDV**, **TasteOne Autoatendimento** ou **Degust PDV**.",
      isFallback: true,
    });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(200).json({ reply: fallbackResponse(messages), isFallback: true });
  }

  try {
    const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await client.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: messages.map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [
          { text: message.content },
          ...(message.images ?? []).map((image) => ({
            inlineData: { mimeType: image.mimeType, data: image.dataUrl.split(",", 2)[1] },
          })),
        ],
      })),
      config: {
        systemInstruction: buildSystemInstruction(systems[0] as SupportedSystem),
        temperature: 0.2,
      },
    });
    return res.status(200).json({ reply: response.text || fallbackResponse(messages) });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    return res.status(200).json({
      reply: fallbackResponse(messages),
      isFallback: true,
      warning: "O serviço de IA está temporariamente indisponível; a validação local foi utilizada.",
    });
  }
}
