import { AuditMessage, missingInfrastructureFields } from "./validateInfrastructure";
import { detectSystems } from "./buildPrompt";

export function fallbackResponse(messages: AuditMessage[]): string {
  const text = messages.filter((message) => message.role === "user").map((message) => message.content).join("\n").toLowerCase();
  const systems = detectSystems(text);
  if (systems.length === 0) return "Antes da comparação, informe qual sistema será utilizado: **TasteOne PDV**, **TasteOne Autoatendimento** ou **Degust PDV**.";
  const isAndroid = /android|smartpos|sunmi|gertec|autoatendimento/.test(text);
  const missing = missingInfrastructureFields(messages, isAndroid);
  if (missing.length > 0) {
    return `Para emitir o diagnóstico, ainda faltam:\n\n${missing.map((item, index) => `${index + 1}. **${item}**`).join("\n")}`;
  }
  return "Os dados mínimos foram recebidos. A configuração atende aos campos necessários para comparação com os requisitos do sistema escolhido.";
}
