import { AndroidDevice, PeripheralItem } from "../types";

export const LINX_TAGS_EXPLANATION = [
  { tag: "DISPONÍVEL", color: "bg-emerald-100 text-emerald-800 border-emerald-300", desc: "Item liberado pela equipe de desenvolvimento pós homologação e disponível para uso." },
  { tag: "DEV FRONT", color: "bg-blue-100 text-blue-800 border-blue-300", desc: "Integrado na camada Android, em desenvolvimento no frontend web do Taste One." },
  { tag: "DEV ANDROID", color: "bg-indigo-100 text-indigo-800 border-indigo-300", desc: "Em desenvolvimento de integração na camada Android pelo time Cross." },
  { tag: "CERTIFICAÇÃO", color: "bg-cyan-100 text-cyan-800 border-cyan-300", desc: "Concluído em desenvolvimento e em certificação na loja da adquirente." },
  { tag: "COMERCIAL", color: "bg-amber-100 text-amber-800 border-amber-300", desc: "Em negociação contratual, parcerias ou obtenção de equipamentos." },
  { tag: "BACKLOG", color: "bg-orange-100 text-orange-800 border-orange-300", desc: "Analisado pelo P&D, aguardando priorização para esteira de desenvolvimento." },
  { tag: "RESTRITO", color: "bg-purple-100 text-purple-800 border-purple-300", desc: "Homologado, porém com restrições de uso ou limitações de chipset." },
  { tag: "IMPEDITIVO", color: "bg-rose-100 text-rose-800 border-rose-300", desc: "Possui impedimentos políticos/comerciais entre as empresas." }
];

export const WINDOWS_SERVER_SPECS = {
  minimo: {
    so: "Windows Server 2019 (ou mais recente) 64-bits / Windows 11 Pro 64-bits",
    cpu: "Intel Core i5 7ª geração ou superior ou equivalente AMD",
    ram: "8 GB",
    armazenamento: "SSD de 256 GB",
    rede: "Ethernet Gigabit (Cabo obrigatório)",
    obs: "Requisito válido somente para Servidor/Terminal (apenas uma máquina na loja)."
  },
  recomendado: {
    so: "Windows Server 2019 (ou mais recente) 64-bits / Windows 11 Pro 64-bits",
    cpu: "Intel Xeon ou AMD Ryzen, 8 núcleos ou mais",
    ram: "16 GB ou mais",
    armazenamento: "SSD de 512 GB ou superior",
    rede: "Ethernet Gigabit"
  }
};

export const WINDOWS_TERMINAL_SPECS = {
  minimo: {
    so: "Windows 10 - 64 bits",
    cpu: "Intel Core i5 7ª geração ou superior ou equivalente AMD",
    ram: "8 GB",
    armazenamento: "SSD de 128 GB",
    rede: "Ethernet Gigabit",
    monitor: "15 polegadas ou mais, resolução de tela: 1366 x 768 (HD)"
  },
  recomendado: {
    so: "Windows 10 Pro (versão mais recente) - 64 bits",
    cpu: "Intel Core i7 7ª geração ou superior ou equivalente AMD",
    ram: "12 GB ou mais",
    armazenamento: "SSD de 512 GB ou superior",
    rede: "Ethernet Gigabit",
    monitor: "22 polegadas ou mais, resolução: 1920 x 1080 (Full HD) ou superior"
  }
};

export const ANDROID_GENERAL_SPECS = {
  smartpos: {
    so: "Android 7.1.1 ou superior",
    cpu: "Quad Core 1.8 GHz ou superior",
    ram: "2 GB ou mais",
    armazenamento: "8 GB ou superior"
  },
  pdvOuAA: {
    so: "Android 9 ou superior",
    cpu: "Octa Core 2.0 GHz ou superior",
    ram: "4 GB ou mais",
    armazenamento: "16 GB ou superior"
  }
};

export const HOMOLOGATED_ANDROID_DEVICES: AndroidDevice[] = [
  // SmartPOS
  {
    modelo: "Sunmi P3 (Mobile)",
    categoria: "SmartPOS",
    adquirentes: ["Getnet"],
    status: "DISPONÍVEL",
    fluxo: "Médio",
    impressora: "Própria integrada",
    observacoes: "Pagamentos via SDK própria da adquirente (sem necessidade de D-TEF). Liberado na loja GetStore."
  },
  {
    modelo: "Tectoy T8 (Mobile)",
    categoria: "SmartPOS",
    adquirentes: ["Stone"],
    status: "DISPONÍVEL",
    fluxo: "Médio",
    impressora: "Própria integrada",
    observacoes: "Pagamentos via SDK Stone. Vinculação via Stone Code no Partner Hub."
  },
  {
    modelo: "Clover Flex BIN SITEF (Mobile)",
    categoria: "SmartPOS",
    adquirentes: ["Bin Sitef", "Azulzinha (CEF)", "Sicred"],
    status: "DISPONÍVEL",
    fluxo: "Médio",
    impressora: "Própria integrada",
    observacoes: "Pagamento via Sitef Sales App. Disponível para download na Clover Store."
  },
  {
    modelo: "Gertec GPOS 790 / 790s (Mobile)",
    categoria: "SmartPOS",
    adquirentes: ["Getnet"],
    status: "DISPONÍVEL",
    fluxo: "Médio",
    impressora: "Própria integrada",
    observacoes: "Homologado e liberado para uso na loja GetStore."
  },
  {
    modelo: "Positivo L300 A11 (Mobile)",
    categoria: "SmartPOS",
    adquirentes: ["Cielo (Disponível)", "Vero (DEV FRONT)"],
    status: "DISPONÍVEL",
    fluxo: "Médio",
    impressora: "Própria integrada",
    observacoes: "Vinculação Cielo via Store Cielo."
  },
  {
    modelo: "Gertec GPOS 730 (Mobile)",
    categoria: "SmartPOS",
    adquirentes: ["Stone"],
    status: "DISPONÍVEL",
    fluxo: "Médio",
    impressora: "Própria integrada",
    observacoes: "Vinculação via Stone Code no Partner Hub."
  },
  {
    modelo: "Positivo L400 (Mobile)",
    categoria: "SmartPOS",
    adquirentes: ["Stone", "Rede", "Cielo"],
    status: "DISPONÍVEL",
    fluxo: "Médio",
    impressora: "Própria integrada",
    observacoes: "Disponível nas 3 maiores adquirentes com SDK homologada."
  },
  {
    modelo: "Sunmi P2 A11 (Mobile)",
    categoria: "SmartPOS",
    adquirentes: ["Stone"],
    status: "DISPONÍVEL",
    fluxo: "Médio",
    impressora: "Própria integrada",
    observacoes: "Atualização de hardware do P2 rodando Android 11."
  },
  {
    modelo: "Newland N960K (Mobile)",
    categoria: "SmartPOS",
    adquirentes: ["Rede"],
    status: "DISPONÍVEL",
    fluxo: "Médio",
    impressora: "Própria integrada",
    observacoes: "Loja Rede pública."
  },
  {
    modelo: "Sunmi P2 (Mobile)",
    categoria: "SmartPOS",
    adquirentes: ["Stone", "Getnet"],
    status: "DISPONÍVEL",
    fluxo: "Baixo",
    impressora: "Própria integrada",
    observacoes: "Indicado para lojas com fluxo operacional baixo."
  },
  {
    modelo: "Positivo L300 (Mobile)",
    categoria: "SmartPOS",
    adquirentes: ["Stone", "Cielo"],
    status: "DISPONÍVEL",
    fluxo: "Baixo",
    impressora: "Própria integrada",
    observacoes: "Indicado para lojas com fluxo operacional baixo."
  },
  {
    modelo: "Gertec GPOS 700X (Mobile)",
    categoria: "SmartPOS",
    adquirentes: ["Stone"],
    status: "DISPONÍVEL",
    fluxo: "Baixo",
    impressora: "Própria integrada",
    observacoes: "Indicado para lojas com fluxo operacional baixo."
  },
  {
    modelo: "Newland N950 / N950 K",
    categoria: "SmartPOS",
    adquirentes: ["Vero"],
    status: "DEV FRONT",
    fluxo: "Baixo",
    impressora: "Própria integrada",
    observacoes: "ATENÇÃO: Ainda em desenvolvimento (DEV FRONT). NÃO homologado para produção."
  },

  // PDVs Desktop
  {
    modelo: "Sunmi T2S",
    categoria: "PDV Desktop",
    adquirentes: ["DTEF Paykit Mobile"],
    status: "DISPONÍVEL",
    fluxo: "Alto",
    impressora: "Própria integrada",
    observacoes: "Projetado para espaços maiores e lojas de ALTO FLUXO. Necessita de Pinpad USB homologado para pagamentos."
  },
  {
    modelo: "Clover Mini BIN SITEF",
    categoria: "PDV Desktop",
    adquirentes: ["BIN SITEF", "Azulzinha", "Sicred"],
    status: "DISPONÍVEL",
    fluxo: "Médio",
    impressora: "Própria integrada",
    observacoes: "Alerta: Devido à resolução, fonte pode parecer reduzida. Recomendada pré-homologação."
  },
  {
    modelo: "Sunmi T2 mini",
    categoria: "PDV Desktop",
    adquirentes: ["DTEF Paykit Mobile"],
    status: "DISPONÍVEL",
    fluxo: "Baixo",
    impressora: "Própria integrada",
    observacoes: "Compacto, para espaços reduzidos e baixo fluxo. Requer Pinpad USB."
  },
  {
    modelo: "Gertec GS300",
    categoria: "PDV Desktop",
    adquirentes: ["DTEF Paykit Mobile"],
    status: "DISPONÍVEL",
    fluxo: "Baixo",
    impressora: "Própria integrada",
    observacoes: "Compacto com impressora embutida. Requer Pinpad USB."
  },
  {
    modelo: "Sunmi D2 mini",
    categoria: "PDV Desktop",
    adquirentes: ["DTEF Paykit Mobile"],
    status: "DISPONÍVEL",
    fluxo: "Baixo",
    impressora: "Própria integrada",
    observacoes: "Compacto com tela touch e impressora própria."
  },
  {
    modelo: "Postech America Pos1732-D-RK",
    categoria: "PDV Desktop",
    adquirentes: ["DTEF Paykit Mobile"],
    status: "DISPONÍVEL",
    fluxo: "Baixo",
    impressora: "NÃO POSSUI",
    observacoes: "ALERTA CRÍTICO: NÃO deve ser usado em lojas de alto fluxo devido ao hardware inferior (RAM, CPU, clock). Não possui impressora interna."
  },

  // Autoatendimento (AA)
  {
    modelo: "Sunmi K2",
    categoria: "Autoatendimento",
    adquirentes: ["DTEF Paykit Mobile"],
    status: "DISPONÍVEL",
    fluxo: "Alto",
    impressora: "Própria integrada",
    observacoes: "Totem robusto para espaços amplos e ALTO FLUXO. Requer pinpad USB."
  },
  {
    modelo: "Sunmi K2 mini",
    categoria: "Autoatendimento",
    adquirentes: ["DTEF Paykit Mobile"],
    status: "DISPONÍVEL",
    fluxo: "Médio",
    impressora: "Própria integrada",
    observacoes: "Totem compacto para médio fluxo. Requer pinpad USB."
  },
  {
    modelo: "Gertec SK210",
    categoria: "Autoatendimento",
    adquirentes: ["DTEF Paykit Mobile"],
    status: "DISPONÍVEL",
    fluxo: "Baixo",
    impressora: "Própria integrada",
    observacoes: "Totem compacto para lojas de baixo fluxo."
  },

  // KDS
  {
    modelo: "Sunmi D2S",
    categoria: "KDS",
    adquirentes: ["Não aplicável"],
    status: "DISPONÍVEL",
    fluxo: "Médio",
    impressora: "Não aplicável",
    observacoes: "Android 11, Quad-Core 1.8GHz, 4GB RAM, 64GB SSD. Projetado para KDS/Painel em espaços compactos."
  }
];

export const PERIPHERAL_LIST: PeripheralItem[] = [
  // Impressoras Cupom
  { tipo: "Impressora Cupom", marca: "Bematech", modelo: "MP-4200", conexao: "USB ou Rede", status: "DISPONÍVEL", obs: "Homologada em Windows e Android Rede" },
  { tipo: "Impressora Cupom", marca: "Bematech", modelo: "MP-4200HS", conexao: "USB ou Rede", status: "DISPONÍVEL", obs: "Homologada em Windows" },
  { tipo: "Impressora Cupom", marca: "Bematech", modelo: "MP2800", conexao: "USB", status: "DISPONÍVEL", obs: "Homologada em Windows USB" },
  { tipo: "Impressora Cupom", marca: "Epson", modelo: "TM-T20x", conexao: "USB ou Rede", status: "DISPONÍVEL", obs: "Homologada em Windows e Android Rede" },
  { tipo: "Impressora Cupom", marca: "Elgin", modelo: "i7 / i7 plus", conexao: "USB / USB ou Rede", status: "DISPONÍVEL", obs: "Homologada em Windows" },
  { tipo: "Impressora Cupom", marca: "Elgin", modelo: "i8 / i9", conexao: "USB ou Rede", status: "DISPONÍVEL", obs: "Homologada em Windows e Android Rede" },
  { tipo: "Impressora Cupom", marca: "Sweda", modelo: "SI-250 / SI-300S / SI-300L", conexao: "USB / Rede", status: "DISPONÍVEL", obs: "Homologada em Windows" },
  { tipo: "Impressora Cupom", marca: "Daruma", modelo: "DR8000", conexao: "USB", status: "DISPONÍVEL", obs: "Homologada em Windows" },
  { tipo: "Impressora Cupom", marca: "Quaisquer", modelo: "Impressoras Bluetooth", conexao: "Bluetooth", status: "DEV FRONT", obs: "Ainda não liberado em produção" },

  // Impressoras Etiquetas
  { tipo: "Impressora Etiqueta", marca: "Elgin", modelo: "L42 / L42 PRO / TT042-50", conexao: "USB ou Rede", status: "BACKLOG", obs: "Em backlog do P&D para Android" },

  // Pinpads
  { tipo: "Pinpad", marca: "Gertec", modelo: "PPC 920", conexao: "USB", status: "DISPONÍVEL", obs: "Para PDVs e AAs com DTEF" },
  { tipo: "Pinpad", marca: "Gertec", modelo: "PPC 930", conexao: "USB", status: "DISPONÍVEL", obs: "Para PDVs e AAs com DTEF" },
  { tipo: "Pinpad", marca: "Gertec", modelo: "PPC 940", conexao: "USB", status: "DISPONÍVEL", obs: "Para PDVs e AAs com DTEF" },
  { tipo: "Pinpad", marca: "Ingenico", modelo: "Lane 3000", conexao: "USB", status: "DISPONÍVEL", obs: "Para PDVs e AAs com DTEF" },
  { tipo: "Pinpad", marca: "Ingenico", modelo: "Lane 3600", conexao: "USB", status: "DISPONÍVEL", obs: "Para PDVs e AAs com DTEF" },

  // Balanças
  { tipo: "Balança", marca: "Toledo", modelo: "Prix 3 Plus", conexao: "USB-Serial / Bluetooth", status: "DISPONÍVEL", obs: "Homologada em Windows e Android" },
  { tipo: "Balança", marca: "Toledo", modelo: "Prix 3 Fit", conexao: "USB-Serial / Bluetooth", status: "DISPONÍVEL", obs: "Homologada em Windows e Android" },
  { tipo: "Balança", marca: "Urano", modelo: "Urano Pop Z / Pop S / Pop Light", conexao: "USB-Serial / Bluetooth", status: "DISPONÍVEL", obs: "Homologada em Android" },

  // SAT / MFE
  { tipo: "SAT/MFE", marca: "Sweda", modelo: "SS-2000 (SP)", conexao: "USB", status: "DISPONÍVEL", obs: "Atenção: Portaria SRE 79/2024 (prazo final até jan/2026 para migração NFC-e)" },
  { tipo: "SAT/MFE", marca: "Elgin", modelo: "Smart SAT (SP)", conexao: "USB", status: "DISPONÍVEL", obs: "Prazo final de uso até 01/01/2026" },
  { tipo: "SAT/MFE", marca: "Tanca", modelo: "TS-1000 (SP)", conexao: "USB", status: "DISPONÍVEL", obs: "Prazo final de uso até 01/01/2026" },
  { tipo: "SAT/MFE", marca: "Gertec", modelo: "GerMfe (CE)", conexao: "USB", status: "DISPONÍVEL", obs: "Decreto 36.417/2025: descontinuação com emissão proibida em 01/01/2026" }
];

export const NETWORK_CRITICAL_RULES = [
  {
    regra: "Rede Cabeada Obrigatória",
    tipo: "IMPEDITIVO",
    descricao: "O estabelecimento comercial deverá possuir OBRIGATORIAMENTE rede cabeada física para tráfego de dados e internet cabeada. TEF, SAT e NFC-e dependem de estabilidade estrita."
  },
  {
    regra: "Proibição de Wi-Fi e 3G/4G/5G para PDV/TEF",
    tipo: "IMPEDITIVO",
    descricao: "Conexões Wi-Fi ou redes móveis são REPROVADAS para PDVs. Podem sofrer interferências físicas gerando terminais sem conexão, TEF indisponível e falhas de envio de NFC-e."
  },
  {
    regra: "Velocidade Mínima de 15 Mbps Dedicados",
    tipo: "CONFORMIDADE",
    descricao: "Conexão mínima de 15 Mbps de uso EXCLUSIVO para o ecossistema Linx. Proibido compartilhar banda sem segregação com Wi-Fi de clientes ou câmeras."
  },
  {
    regra: "Proibição de Conexão Simultânea (Wi-Fi + Cabo)",
    tipo: "IMPEDITIVO",
    descricao: "NUNCA conectar o aparelho ao Wi-Fi e à rede cabeada ao mesmo tempo. Isso causa oscilação entre rotas, interrupções e impressoras de rede não encontradas."
  },
  {
    regra: "Roteador Gerenciável Obrigatório (Não usar modem de operadora)",
    tipo: "OBRIGATÓRIO",
    descricao: "Nunca utilizar o modem da operadora para gerenciar a rede da loja. Utilizar sempre roteador gerenciável, com reserva de IP fixado ao endereço MAC do servidor e terminais."
  },
  {
    regra: "Contingência Fiscal Android Exige Servidor Windows",
    tipo: "ARQUITETURA",
    descricao: "Dispositivos Android só possuem contingência fiscal em caso de queda se houver um Servidor Windows na rede local rodando o middleware Fiscal Flow."
  }
];
