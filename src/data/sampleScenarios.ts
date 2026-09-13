import { HardwarePreset } from "../types";

export const SAMPLE_SCENARIOS: HardwarePreset[] = [
  {
    id: "servidor_aprovado",
    title: "Servidor Windows Dedicado",
    category: "windows",
    badge: "Conforme",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    description: "Windows Server 2019, Xeon 8 cores, 16GB RAM, SSD 512GB e Ethernet Gigabit.",
    prompt: `Olá, gostaria de validar as configurações da loja:
- Sistema Linx: TasteOne PDV
- Tipo: Servidor Dedicado Windows
- Sistema Operacional: Windows Server 2019 64-bits
- Processador: Intel Xeon E-2224G, 8 núcleos
- Memória RAM: 16 GB
- Armazenamento: SSD de 512 GB
- Conectividade de Rede: Ethernet Gigabit (Cabeada)
- Velocidade de Internet: 100 Mbps fibra
- Segregação de Rede: Rede exclusiva e dedicada para o ecossistema Linx
- Gerenciamento de Rede: Roteador gerenciável Mikrotik com IP fixado por MAC`
  },
  {
    id: "smartpos_getnet",
    title: "SmartPOS Sunmi P3 (Getnet)",
    category: "android",
    badge: "Homologado",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
    description: "Mobilidade Android Getnet homologada com SDK, rede cabeada no base docking.",
    prompt: `Olá, estou implantando o PDV mobile com as seguintes especificações:
- Sistema Linx: TasteOne PDV
- Tipo: Dispositivo Android SmartPOS Mobile
- Modelo exato e adquirente: Sunmi P3 ofertado pela Getnet
- Finalidade e fluxo da loja: Operação de salão e caixa em loja de Médio Fluxo
- Sistema Operacional: Android 11
- Processador e RAM: Quad-Core 1.8 GHz com 2 GB de RAM e 16GB de armazenamento
- Conectividade de Rede: Rede cabeada Ethernet na doca/base do terminal
- Velocidade de Internet: 50 Mbps
- Segregação de Rede: Rede exclusiva do ecossistema Linx
- Gerenciamento de Rede: Roteador gerenciável com amarração IP/MAC`
  },
  {
    id: "totem_k2",
    title: "Totem Autoatendimento Sunmi K2",
    category: "android",
    badge: "Alto Fluxo",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
    description: "Totem AA Android 9, Octa-Core, Pinpad USB Gertec PPC 930 e DTEF.",
    prompt: `Gostaria de auditar o totem de autoatendimento da loja:
- Sistema Linx: TasteOne Autoatendimento
- Tipo: Terminal de Autoatendimento (AA) Android
- Modelo exato: Sunmi K2 (com DTEF Paykit Mobile)
- Finalidade e fluxo da loja: Alto fluxo de clientes para pedidos rápidos
- Sistema Operacional: Android 9
- Processador e RAM: Octa Core 2.0 GHz com 4 GB de RAM e 16 GB armazenamento
- Periféricos: Pinpad Gertec PPC 930 conectado via USB e impressora térmica própria integrada
- Conectividade de Rede: Cabo Ethernet Gigabit
- Velocidade de Internet: 60 Mbps dedicada ao ecossistema Linx
- Gerenciamento de Rede: Roteador gerenciável profissional`
  },
  {
    id: "reprovado_wifi",
    title: "Bloqueio: Operação via Wi-Fi",
    category: "reprovado",
    badge: "Impeditivo",
    badgeColor: "bg-rose-100 text-rose-800 border-rose-300",
    description: "Cenário com Wi-Fi ativo para PDV. Demonstra bloqueio e reprovação de conformidade.",
    prompt: `Prezados, temos a seguinte máquina para o caixa:
- Sistema Linx: TasteOne PDV
- Tipo: Terminal Windows Caixa
- Sistema Operacional: Windows 10 64-bits
- Processador: Intel Core i5 8ª geração
- Memória RAM: 8 GB
- Armazenamento: SSD de 256 GB
- Resolução do monitor: 1920x1080 Full HD
- Conectividade de Rede: Conexão via Wi-Fi 5GHz da loja
- Velocidade de Internet: 10 Mbps compartilhada com o Wi-Fi de clientes
- Gerenciamento: Modem padrão Wi-Fi fornecido pela operadora Claro`
  },
  {
    id: "teste_pendencias",
    title: "Teste de Tratamento de Pendências",
    category: "pendente",
    badge: "Faltam Dados",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
    description: "Informa apenas o processador e Windows, para testar a retenção e cobrança dos dados faltantes.",
    prompt: `Olá, comprei um computador para ser o Servidor da loja. Sistema Linx: TasteOne PDV. Tenho Windows 11 Pro e processador Intel Core i5 de 10ª geração. Gostaria de saber se posso instalar o Linx Taste One nele.`
  }
];
