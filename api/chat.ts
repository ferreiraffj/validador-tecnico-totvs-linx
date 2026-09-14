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

const SYSTEM_NAMES = ["TasteOne PDV", "TasteOne Autoatendimento", "Degust PDV"] as const;
type SupportedSystem = (typeof SYSTEM_NAMES)[number];
const DEFAULT_MODEL = "gemini-3.6-flash";
const REQUIREMENTS: Record<SupportedSystem, Record<string, unknown>> = {
  "TasteOne PDV": {
    system: "TasteOne PDV",
    version: "2026.09",
    windows: {
      serverMinimum: "Windows Server 2019 ou Windows 11 Pro 64 bits, Intel Core i5 7ª geração ou equivalente AMD, 8 GB RAM, SSD 256 GB e Ethernet Gigabit",
      serverRecommended: "Intel Xeon ou AMD Ryzen com 8 núcleos ou mais, 16 GB RAM ou mais e SSD 512 GB ou superior",
      terminalMinimum: "Windows 10 64 bits, Intel Core i5 7ª geração ou equivalente AMD, 8 GB RAM, SSD 128 GB, Ethernet Gigabit e monitor de 15 polegadas com 1366x768",
      terminalRecommended: "Windows 10 Pro 64 bits, Intel Core i7 7ª geração ou equivalente AMD, 12 GB RAM ou mais, SSD 512 GB ou superior, Ethernet Gigabit e monitor Full HD",
    },
    android: {
      smartpos: "Android 7.1.1 ou superior, Quad-Core 1.8 GHz ou superior, 2 GB RAM ou mais e 8 GB de armazenamento ou mais",
      desktopOrSelfService: "Android 9 ou superior, Octa-Core 2.0 GHz ou superior, 4 GB RAM ou mais e 16 GB de armazenamento ou mais",
    },
    network: { internetMinimumMbps: 15, wiredRequired: true, dedicatedRecommended: true, managedRouterRequired: true },
    homologatedDevices: ["Sunmi P3", "Tectoy T8", "Clover Flex", "Gertec GPOS 790", "Positivo L400", "Sunmi T2S", "Clover Mini", "Gertec GS300", "Sunmi K2", "Sunmi K2 mini", "Gertec SK210"],
  },
  "TasteOne Autoatendimento": {
    system: "TasteOne Autoatendimento",
    version: "2026.09",
    android: {
      desktopOrSelfService: "Android 9 ou superior, Octa-Core 2.0 GHz ou superior, 4 GB RAM ou mais e 16 GB de armazenamento ou mais",
      approvedSelfService: "Sunmi K2 para alto fluxo, Sunmi K2 mini para médio fluxo e Gertec SK210 para baixo fluxo",
    },
    network: { internetMinimumMbps: 15, wiredRequired: true, dedicatedRecommended: true, managedRouterRequired: true },
    homologatedDevices: ["Sunmi K2", "Sunmi K2 mini", "Gertec SK210"],
  },
  "Degust PDV": {
    system: "Degust PDV",
    version: "2026.09",
    windows: {
      serverMinimum: "Windows Server 2019 ou Windows 11 Pro 64 bits, Intel Core i5 7ª geração ou equivalente AMD, 8 GB RAM, SSD 256 GB e Ethernet Gigabit",
      serverRecommended: "Intel Xeon ou AMD Ryzen com 8 núcleos ou mais, 16 GB RAM ou mais e SSD 512 GB ou superior",
      terminalMinimum: "Windows 10 64 bits, Intel Core i5 7ª geração ou equivalente AMD, 8 GB RAM, SSD 128 GB, Ethernet Gigabit e monitor de 15 polegadas com 1366x768",
      terminalRecommended: "Windows 10 Pro 64 bits, Intel Core i7 7ª geração ou equivalente AMD, 12 GB RAM ou mais, SSD 512 GB ou superior, Ethernet Gigabit e monitor Full HD",
    },
    android: {
      smartpos: "Android 7.1.1 ou superior, Quad-Core 1.8 GHz ou superior, 2 GB RAM ou mais e 8 GB de armazenamento ou mais",
      desktopOrSelfService: "Android 9 ou superior, Octa-Core 2.0 GHz ou superior, 4 GB RAM ou mais e 16 GB de armazenamento ou mais",
    },
    network: { internetMinimumMbps: 15, wiredRequired: true, dedicatedRecommended: true, managedRouterRequired: true },
    homologatedDevices: ["Sunmi P3", "Positivo L400", "Sunmi P2 A11", "Sunmi T2S", "Sunmi T2 mini", "Gertec GS300", "Sunmi D2 mini", "Sunmi K2", "Sunmi K2 mini", "Gertec SK210"],
  },
};

function buildProductionPrompt(system: SupportedSystem): string {
  const requirements = REQUIREMENTS[system];
  const network = requirements.network as { internetMinimumMbps: number };
  return `Você é o Validador Técnico de Infraestrutura e Hardware do sistema ${system}.
Compare exclusivamente com os requisitos estruturados abaixo e nunca misture produtos:
${JSON.stringify(requirements, null, 2)}

Confirme o sistema antes de comparar. Campos enviados pelo formulário, incluindo monitor e rede, já estão preenchidos e não devem ser solicitados novamente. Periféricos são opcionais.
Quando houver imagens, extraia somente informações legíveis de sistema operacional, processador, memória, armazenamento, resolução, rede e velocidade. Não invente valores ilegíveis.
Wi-Fi ou rede móvel para operação de PDV/TEF/Fiscal é impeditivo. Verifique Ethernet, internet mínima de ${network.internetMinimumMbps} Mbps, segregação e roteador gerenciável.

Não emita relatório enquanto houver dados obrigatórios faltando. Quando estiver completo, use exatamente:
# 📊 Diagnóstico de Viabilidade Técnica - [sistema]
**Status Geral:** [🟢 APROVADO / 🟡 APROVADO COM RESSALVAS / 🔴 REPROVADO - IMPEDITIVO]
### 1. Análise de Hardware e Equipamentos
### 2. Análise de Infraestrutura e Rede
### 3. Periféricos e Homologações (Se aplicável)
### 4. Plano de Ação / Correções Necessárias`;
}

function detectSystems(text: string): SupportedSystem[] {
  const normalized = text.toLowerCase();
  const systems: SupportedSystem[] = [];
  if (normalized.includes("tasteone pdv") || normalized.includes("taste one pdv")) systems.push("TasteOne PDV");
  if (normalized.includes("tasteone autoatendimento") || normalized.includes("taste one autoatendimento")) {
    systems.push("TasteOne Autoatendimento");
  }
  if (normalized.includes("degust pdv") || normalized.includes("degust")) systems.push("Degust PDV");
  return systems;
}

function isValidMessages(messages: unknown): messages is ApiMessage[] {
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 40) return false;
  return messages.every((message) => {
    if (
      !message ||
      typeof message !== "object" ||
      (message as ApiMessage).role !== "user" && (message as ApiMessage).role !== "assistant" ||
      typeof (message as ApiMessage).content !== "string" ||
      (message as ApiMessage).content.trim().length === 0 ||
      (message as ApiMessage).content.length > 8000
    ) return false;
    const images = (message as ApiMessage).images;
    return images === undefined || (
      Array.isArray(images) &&
      images.length <= 3 &&
      images.reduce((total, image) => total + (image.dataUrl?.length ?? 0), 0) <= 3_000_000 &&
      images.every((image) =>
        ["image/png", "image/jpeg", "image/webp"].includes(image.mimeType) &&
        image.dataUrl.startsWith(`data:${image.mimeType};base64,`) &&
        image.dataUrl.length <= 1_000_000
      )
    );
  });
}

function getGeminiModel(): string {
  const configuredModel = process.env.GEMINI_MODEL?.trim();
  if (!configuredModel || configuredModel === "gemini-2.5-flash") return DEFAULT_MODEL;
  return /^gemini-[a-z0-9.-]+$/i.test(configuredModel) ? configuredModel : DEFAULT_MODEL;
}

function fallbackReply(messages: ApiMessage[]): string {
  const text = messages.filter((message) => message.role === "user").map((message) => message.content).join("\n").toLowerCase();
  const systems = detectSystems(text);
  if (systems.length === 0) return "Antes da comparação, informe qual sistema será utilizado: **TasteOne PDV**, **TasteOne Autoatendimento** ou **Degust PDV**.";
  if (messages.some((message) => message.images && message.images.length > 0)) {
    return "Recebi as capturas de tela, mas a interpretação visual da IA está temporariamente indisponível. Não vou solicitar novamente os dados que podem estar nas imagens. Tente enviar a mensagem novamente ou informe os dados em texto para continuar sem a análise visual.";
  }

  const missing: string[] = [];
  if (!/windows|android|sistema operacional|server/.test(text)) missing.push("sistema operacional e cenário da loja");
  if (!/processador|cpu|core|ryzen|xeon|quad|octa/.test(text)) missing.push("processador");
  if (!/ram|memória|memoria|\d+\s*gb/.test(text)) missing.push("memória RAM");
  if (!/ssd|hd|armazenamento|disco/.test(text)) missing.push("armazenamento");
  if (!/cabo|cabeada|ethernet|wi-?fi|wifi/.test(text)) missing.push("conectividade de rede");
  if (!/mbps|mega|velocidade/.test(text)) missing.push("velocidade da internet");
  if (missing.length > 0) return `Para emitir o diagnóstico, ainda faltam:\n\n${missing.map((item, index) => `${index + 1}. **${item}**`).join("\n")}`;
  return "Os dados mínimos foram recebidos. A configuração atende aos campos necessários para comparação com os requisitos do sistema escolhido.";
}

export default async function chatHandler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido. Use POST com um corpo JSON." });
  }

  try {
    if (!isValidMessages(req.body?.messages)) {
      return res.status(400).json({ error: "Mensagens inválidas ou payload de imagem excedido." });
    }

    const messages = req.body.messages;
    const userText = messages
      .filter((message) => message.role === "user")
      .map((message) => message.content)
      .join("\n");
    const systems = detectSystems(userText);

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
        reply: fallbackReply(messages),
        isFallback: true,
      });
    }

    const { GoogleGenAI } = await import("@google/genai");
    const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await client.models.generateContent({
      model: getGeminiModel(),
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
        systemInstruction: buildProductionPrompt(systems[0]),
        temperature: 0.2,
      },
    });

    return res.status(200).json({
      reply: response.text || fallbackReply(messages),
    });
  } catch (error) {
    console.error("Error in /api/chat:", {
      message: error instanceof Error ? error.message : String(error),
      model: getGeminiModel(),
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      hasImages: isValidMessages(req.body?.messages) &&
        req.body.messages.some((message) => Boolean(message.images?.length)),
    });

    if (isValidMessages(req.body?.messages)) {
      return res.status(200).json({
        reply: fallbackReply(req.body.messages),
        isFallback: true,
        warning: "A análise visual não foi concluída nesta tentativa. Tente enviar novamente.",
      });
    }

    return res.status(500).json({ error: "Não foi possível processar a solicitação de auditoria." });
  }
}
