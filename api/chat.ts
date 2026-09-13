import { GoogleGenAI } from "@google/genai";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ApiRequest = {
  method?: string;
  body?: { messages?: unknown };
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
};

const SYSTEM_INSTRUCTION = `Você é o Validador Técnico de Infraestrutura e Hardware especialista nos sistemas Linx TasteOne PDV, TasteOne Autoatendimento e Degust PDV.

Antes de comparar qualquer configuração, confirme qual sistema será utilizado e nunca misture os requisitos dos produtos. Colete todos os dados necessários antes de emitir um diagnóstico.

Para Windows, valide o tipo de máquina, sistema operacional, processador, RAM, armazenamento, Ethernet e monitor quando aplicável.
Para Android, valide modelo exato, adquirente, fluxo da loja, versão do Android, processador, RAM, armazenamento e periféricos.
Para todos os sistemas, valide Ethernet cabeada, internet mínima de 15 Mbps, rede dedicada ou segregada, roteador gerenciável e ausência de uso simultâneo de Wi-Fi e cabo.
Wi-Fi ou rede móvel para operação de PDV/TEF/Fiscal é impeditivo. Modem de operadora não substitui roteador gerenciável. A contingência fiscal Android exige um servidor Windows com middleware na rede.

Não emita relatório se houver dados obrigatórios faltando. Quando tudo estiver disponível, produza um diagnóstico com status geral, hardware, rede, periféricos/homologações e plano de ação.`;

function selectedSystems(messages: ChatMessage[]): string[] {
  const text = messages
    .filter((message) => message.role === "user")
    .map((message) => message.content)
    .join("\n")
    .toLowerCase();
  const systems: string[] = [];
  if (text.includes("tasteone pdv") || text.includes("taste one pdv")) systems.push("TasteOne PDV");
  if (text.includes("tasteone autoatendimento") || text.includes("taste one autoatendimento")) {
    systems.push("TasteOne Autoatendimento");
  }
  if (text.includes("degust pdv") || text.includes("degust")) systems.push("Degust PDV");
  return systems;
}

function fallbackResponse(messages: ChatMessage[]): string {
  const text = messages
    .filter((message) => message.role === "user")
    .map((message) => message.content)
    .join("\n")
    .toLowerCase();

  if (selectedSystems(messages).length === 0) {
    return "Antes da comparação, informe qual sistema será utilizado: **TasteOne PDV**, **TasteOne Autoatendimento** ou **Degust PDV**.";
  }

  const missing: string[] = [];
  const isAndroid =
    text.includes("android") ||
    text.includes("smartpos") ||
    text.includes("sunmi") ||
    text.includes("gertec") ||
    text.includes("autoatendimento");
  const hasNetwork = /cabo|cabeada|ethernet|wi-?fi|wifi/.test(text);

  if (!/windows|android|sistema operacional|server/.test(text)) {
    missing.push("sistema operacional e cenário da loja");
  }
  if (!/processador|cpu|core|ryzen|xeon|quad|octa/.test(text)) missing.push("processador");
  if (!/ram|memória|memoria|\d+\s*gb/.test(text)) missing.push("memória RAM");
  if (!isAndroid && !/ssd|hd|armazenamento|disco/.test(text)) missing.push("armazenamento");
  if (isAndroid && !/modelo|sunmi|gertec|tectoy|clover|positivo|newland/.test(text)) missing.push("modelo exato do dispositivo");
  if (!hasNetwork) missing.push("conectividade cabeada ou Wi-Fi");
  if (!/mbps|mega|velocidade/.test(text)) missing.push("velocidade da internet");
  if (!/exclusiv|dedicad|compartilhad|segregad/.test(text)) missing.push("segregação da rede");
  if (!/roteador|modem|gerenci/.test(text)) missing.push("gerenciamento por roteador");

  if (missing.length > 0) {
    return `Para emitir o diagnóstico, ainda faltam:\n\n${missing.map((item, index) => `${index + 1}. **${item}**`).join("\n")}`;
  }

  return "Os dados mínimos foram recebidos. A configuração deve ser comparada com os requisitos do sistema escolhido, considerando especialmente Ethernet, internet dedicada de pelo menos 15 Mbps e roteador gerenciável.";
}

export default async function chatHandler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido." });
  }

  const rawMessages = req.body?.messages;
  if (
    !Array.isArray(rawMessages) ||
    rawMessages.length === 0 ||
    rawMessages.length > 40 ||
    rawMessages.some(
      (message) =>
        !message ||
        typeof message !== "object" ||
        !("role" in message) ||
        !("content" in message) ||
        ((message as { role?: unknown }).role !== "user" &&
          (message as { role?: unknown }).role !== "assistant") ||
        typeof (message as { content?: unknown }).content !== "string" ||
        !(message as { content: string }).content.trim() ||
        (message as { content: string }).content.length > 8000,
    )
  ) {
    return res.status(400).json({ error: "Mensagens inválidas ou quantidade excedida." });
  }

  const messages = rawMessages as ChatMessage[];
  const systems = selectedSystems(messages);
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
        parts: [{ text: message.content }],
      })),
      config: { systemInstruction: SYSTEM_INSTRUCTION, temperature: 0.2 },
    });

    return res.status(200).json({
      reply: response.text || fallbackResponse(messages),
    });
  } catch (error) {
    console.error("Error in Vercel /api/chat:", error);
    return res.status(200).json({
      reply: fallbackResponse(messages),
      isFallback: true,
      warning: "O serviço de IA está temporariamente indisponível; a validação local foi utilizada.",
    });
  }
}
