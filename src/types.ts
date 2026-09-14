export type ScenarioType =
  | "servidor_windows"
  | "servidor_terminal_unico"
  | "terminal_windows"
  | "android_smartpos"
  | "android_pdv_desktop"
  | "android_autoatendimento"
  | "android_kds";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isReport?: boolean;
  reportStatus?: "APROVADO" | "APROVADO_RESSALVAS" | "REPROVADO";
  missingFields?: string[];
  images?: ImageAttachment[];
}

export interface ImageAttachment {
  name: string;
  mimeType: string;
  dataUrl: string;
}

export interface HardwarePreset {
  id: string;
  title: string;
  category: "windows" | "android" | "pendente" | "reprovado";
  description: string;
  badge: string;
  badgeColor: string;
  prompt: string;
}

export interface LinxRequirement {
  title: string;
  minimo: string[];
  recomendado?: string[];
  alertas?: string[];
}

export interface AndroidDevice {
  modelo: string;
  categoria: "SmartPOS" | "PDV Desktop" | "Autoatendimento" | "KDS";
  adquirentes: string[];
  status: "DISPONÍVEL" | "DEV FRONT" | "BACKLOG" | "RESTRITO";
  fluxo: "Baixo" | "Médio" | "Alto";
  impressora: string;
  observacoes: string;
}

export interface PeripheralItem {
  tipo: "Impressora Cupom" | "Impressora Etiqueta" | "Pinpad" | "Balança" | "SAT/MFE";
  marca: string;
  modelo: string;
  conexao: string;
  status: string;
  obs?: string;
}
