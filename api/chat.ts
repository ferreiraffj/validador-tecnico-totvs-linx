type ApiMessage = {
  role: "user" | "assistant";
  content: string;
  images?: Array<{
    name: string;
    mimeType: string;
    dataUrl: string;
  }>;
};

type ApiRequest = {
  method?: string;
  body?: { messages?: unknown };
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
};

export default async function chatHandler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido. Use POST com um corpo JSON." });
  }

  try {
    const [{ GoogleGenAI }, promptModule, fallbackModule, validationModule] = await Promise.all([
      import("@google/genai"),
      import("../src/shared/auditor/buildPrompt"),
      import("../src/shared/auditor/fallbackResponse"),
      import("../src/shared/auditor/validateInfrastructure"),
    ]);

    if (!validationModule.validateMessages(req.body?.messages)) {
      return res.status(400).json({ error: "Mensagens inválidas ou payload de imagem excedido." });
    }

    const messages = req.body.messages;
    const userText = messages
      .filter((message) => message.role === "user")
      .map((message) => message.content)
      .join("\n");
    const systems = promptModule.detectSystems(userText);

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
      return res.status(200).json({
        reply: fallbackModule.fallbackResponse(messages),
        isFallback: true,
      });
    }

    const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await client.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: messages.map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [
          { text: message.content },
          ...(message.images ?? []).map((image) => ({
            inlineData: {
              mimeType: image.mimeType,
              data: image.dataUrl.split(",", 2)[1],
            },
          })),
        ],
      })),
      config: {
        systemInstruction: promptModule.buildSystemInstruction(systems[0]),
        temperature: 0.2,
      },
    });

    return res.status(200).json({
      reply: response.text || fallbackModule.fallbackResponse(messages),
    });
  } catch (error) {
    console.error("Error in /api/chat:", error);

    try {
      const [{ fallbackResponse }, { validateMessages }] = await Promise.all([
        import("../src/shared/auditor/fallbackResponse"),
        import("../src/shared/auditor/validateInfrastructure"),
      ]);

      if (validateMessages(req.body?.messages)) {
        return res.status(200).json({
          reply: fallbackResponse(req.body.messages),
          isFallback: true,
          warning: "O serviço de IA está temporariamente indisponível; a validação local foi utilizada.",
        });
      }
    } catch (fallbackError) {
      console.error("Fallback error in /api/chat:", fallbackError);
    }

    return res.status(500).json({ error: "Não foi possível processar a solicitação de auditoria." });
  }
}
