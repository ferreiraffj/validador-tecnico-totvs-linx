export type ImageAttachment = { name: string; mimeType: string; dataUrl: string };
export type AuditMessage = { role: "user" | "assistant"; content: string; images?: ImageAttachment[] };

const ALLOWED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const MAX_IMAGE_SIZE = 2_500_000;

export function validateMessages(messages: unknown): messages is AuditMessage[] {
  return (
    Array.isArray(messages) &&
    messages.length > 0 &&
    messages.length <= 40 &&
    messages.every((message) => {
      if (
        !message ||
        typeof message !== "object" ||
        ((message as AuditMessage).role !== "user" && (message as AuditMessage).role !== "assistant") ||
        typeof (message as AuditMessage).content !== "string" ||
        (message as AuditMessage).content.trim().length === 0 ||
        (message as AuditMessage).content.length > 8000
      ) {
        return false;
      }

      const images = (message as AuditMessage).images;
      return (
        images === undefined ||
        (Array.isArray(images) &&
          images.length <= 4 &&
          images.every(
            (image) =>
              typeof image?.name === "string" &&
              ALLOWED_IMAGE_TYPES.has(image?.mimeType) &&
              typeof image?.dataUrl === "string" &&
              image.dataUrl.startsWith(`data:${image.mimeType};base64,`) &&
              image.dataUrl.length <= MAX_IMAGE_SIZE,
          ))
      );
    })
  );
}

export function missingInfrastructureFields(messages: AuditMessage[], isAndroid: boolean): string[] {
  const text = messages.filter((message) => message.role === "user").map((message) => message.content).join("\n").toLowerCase();
  const missing: string[] = [];
  if (!/windows|android|sistema operacional|server/.test(text)) missing.push("sistema operacional e cenário da loja");
  if (!/processador|cpu|core|ryzen|xeon|quad|octa/.test(text)) missing.push("processador");
  if (!/ram|memória|memoria|\d+\s*gb/.test(text)) missing.push("memória RAM");
  if (!isAndroid && !/ssd|hd|armazenamento|disco/.test(text)) missing.push("armazenamento");
  if (isAndroid && !/modelo|sunmi|gertec|tectoy|clover|positivo|newland/.test(text)) missing.push("modelo exato do dispositivo");
  if (!/cabo|cabeada|ethernet|wi-?fi|wifi/.test(text)) missing.push("conectividade de rede");
  if (!/mbps|mega|velocidade/.test(text)) missing.push("velocidade da internet");
  if (!/exclusiv|dedicad|compartilhad|segregad/.test(text)) missing.push("segregação da rede");
  if (!/roteador|modem|gerenci/.test(text)) missing.push("gerenciamento por roteador");
  return missing;
}
