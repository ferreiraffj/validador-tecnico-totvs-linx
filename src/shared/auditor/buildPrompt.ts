import tasteone from "../../data/requirements/tasteone.json";
import autoatendimento from "../../data/requirements/tasteone-autoatendimento.json";
import degust from "../../data/requirements/degust.json";
import { REPORT_FORMAT } from "./reportFormat";

export type SupportedSystem = "TasteOne PDV" | "TasteOne Autoatendimento" | "Degust PDV";
export type RequirementSet = typeof tasteone | typeof autoatendimento | typeof degust;

const REQUIREMENTS: Record<SupportedSystem, RequirementSet> = {
  "TasteOne PDV": tasteone,
  "TasteOne Autoatendimento": autoatendimento,
  "Degust PDV": degust,
};

export function getRequirements(system: SupportedSystem): RequirementSet {
  return REQUIREMENTS[system];
}

export function buildSystemInstruction(system: SupportedSystem): string {
  const requirements = getRequirements(system);
  return `Você é o Validador Técnico de Infraestrutura e Hardware do sistema ${system}.
Compare exclusivamente com os requisitos estruturados abaixo e nunca misture produtos:
${JSON.stringify(requirements, null, 2)}

Confirme o sistema antes de comparar. Colete todos os campos obrigatórios do cenário. Campos enviados pelo formulário, incluindo monitor e rede, já estão preenchidos e não devem ser solicitados novamente. Periféricos são opcionais: analise-os apenas se informados e nunca os trate como pendência obrigatória.
Quando houver imagens anexadas, interprete as capturas de tela de forma objetiva: extraia somente informações legíveis de sistema operacional, processador, memória, armazenamento, resolução, rede e velocidade. Relacione cada dado ao que está visível e não invente valores ocultos ou ilegíveis; peça confirmação apenas quando a imagem não permitir uma leitura segura.
Wi-Fi ou rede móvel para operação de PDV/TEF/Fiscal é impeditivo. Verifique Ethernet, internet mínima de ${requirements.network.internetMinimumMbps} Mbps, segregação, roteador gerenciável e ausência de uso simultâneo de Wi-Fi e cabo.

Não emita relatório enquanto houver dados obrigatórios faltando. Quando estiver completo, use exatamente esta estrutura:
${REPORT_FORMAT}
Não altere os títulos principais, pois a interface usa-os para renderizar o cartão visual.`;
}

export function detectSystems(text: string): SupportedSystem[] {
  const normalized = text.toLowerCase();
  const systems: SupportedSystem[] = [];
  if (normalized.includes("tasteone pdv") || normalized.includes("taste one pdv")) systems.push("TasteOne PDV");
  if (normalized.includes("tasteone autoatendimento") || normalized.includes("taste one autoatendimento")) {
    systems.push("TasteOne Autoatendimento");
  }
  if (normalized.includes("degust pdv") || normalized.includes("degust")) systems.push("Degust PDV");
  return systems;
}
