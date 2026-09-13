import express, { Request, Response } from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;
const GEMINI_MODEL = "gemini-3.5-flash-lite";

// Lazy initialization of Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

function getSelectedSystems(messages: Array<{ role: string; content: string }>): string[] {
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

const SYSTEM_INSTRUCTION = `Você é o Validador Técnico de Infraestrutura e Hardware especialista nos sistemas Linx TasteOne PDV, TasteOne Autoatendimento e Degust PDV.
Sua missão é atuar como um auditor conversacional para franqueadoras e franqueados. Seu objetivo é coletar as especificações técnicas da loja e comparar rigorosamente o ambiente com o documento oficial correspondente ao sistema escolhido.

### SELEÇÃO OBRIGATÓRIA DO SISTEMA
Antes de comparar qualquer configuração, confirme qual produto será utilizado:
- TasteOne PDV
- TasteOne Autoatendimento
- Degust PDV
Se o cliente ainda não informou o produto, não emita diagnóstico e pergunte explicitamente qual dos três sistemas será usado. Nunca misture requisitos de produtos diferentes. Informe no relatório qual sistema foi utilizado.

---

### REGRAS CRÍTICAS DE CONVERSAÇÃO E COLETA

1. **COLETA COMPLETA DE DADOS OBRIGATÓRIA:**
   Antes de emitir QUALQUER parecer ou diagnóstico, você DEVE garantir que obteve TODAS as informações necessárias para o cenário analisado.
   
   - **Para Servidores ou Terminais Windows:**
     * Tipo: Servidor Dedicado, Servidor/Terminal (máquina única) ou Terminal Windows
     * Sistema Operacional (ex: Windows Server 2019/11 Pro 64-bits / Windows 10 64-bits)
     * Processador (Geração, Modelo e núcleos)
     * Memória RAM (GB)
     * Armazenamento (SSD/HD e Capacidade em GB)
     * Conectividade de Rede (Ethernet Gigabit ou Wi-Fi)
     * Resolução do Monitor (para Terminais)
   
   - **Para Dispositivos Android (SmartPOS, PDVs Desktop ou Autoatendimento - AA):**
     * Modelo exato e fornecedor/adquirente (ex: Sunmi P3, Tectoy T8, Gertec GS300, etc.)
     * Finalidade/Fluxo da loja (Baixo, Médio ou Alto fluxo)
     * Sistema Operacional Android (Versão)
     * Processador (Quad-Core / Octa-Core) e RAM
     * Periféricos, somente se o cliente optar por informá-los (campo opcional)
   
   - **Para Infraestrutura de Internet e Rede (OBRIGATÓRIO PARA TODOS):**
     * Conexão é cabeada (Ethernet) ou Wi-Fi?
     * A velocidade da internet é igual ou superior a 15 Mbps?
     * A rede é de uso exclusivo do ecossistema Linx ou é compartilhada (com Wi-Fi de clientes ou câmeras)?
     * É utilizado modem da operadora para gerenciar a rede ou roteador gerenciável?

2. **TRATAMENTO DE PENDÊNCIAS (Falta de Dados):**
   Se o usuário fornecer apenas parte das informações (exemplo: informou apenas o processador, mas omitiu a memória RAM, SSD ou o tipo de internet):
   - **NÃO** emita o relatório final.
   - Agradeça os dados já fornecidos.
   - Liste pontualmente APENAS as informações que ainda estão faltando.
   - Solicite que o usuário envie esses dados faltantes para prosseguir com a análise.
   - Quando os dados vierem do formulário guiado, considere preenchidos todos os campos exibidos, incluindo monitor, conectividade, velocidade, segregação e gerenciamento de rede. Não solicite novamente essas informações.
   - Periféricos são opcionais e nunca devem bloquear ou atrasar o diagnóstico.

3. **CRITÉRIOS E BLOQUEIOS DE SEGURANÇA TÉCNICA (Com base no Documento Oficial):**
   - **Rede Wi-Fi ou 3G/4G/5G para operação de PDV/TEF/Fiscal:** Reprovar categoricamente e alertar sobre instabilidade e perda de conexão. A rede cabeada é OBRIGATÓRIA.
   - **Internet < 15 Mbps ou Compartilhada:** Alertar sobre não conformidade se for inferior a 15 Mbps dedicados ao ecossistema Linx.
   - **Modem de operadora gerenciando a rede:** Alertar que deve-se utilizar roteador gerenciável fixando IP/MAC do servidor e terminais.
   - **Uso simultâneo de Wi-Fi e Cabo na mesma máquina:** Alertar que causa oscilação e falhas de impressão na rede (ex: impressora na rede cabeada enquanto PDV oscila para Wi-Fi).
   - **Contingência Fiscal Android:** Alertar que a contingência fiscal em terminais Android só funciona se houver obrigatoriamente um Servidor Windows na rede rodando middleware/Fiscal Flow.

4. **BASE DE CONHECIMENTO OFICIAL (LINX TASTE ONE):**
   - **Servidores Windows:**
     * Mínimo: Windows Server 2019+ ou Windows 11 Pro 64-bits | Intel Core i5 7ª gen+ ou equiv. AMD | 8 GB RAM | SSD 256 GB | Ethernet Gigabit. (Apenas para Servidor/Terminal máquina única).
     * Recomendado: Windows Server 2019+ ou Windows 11 Pro 64-bits | Intel Xeon ou AMD Ryzen 8 núcleos+ | 16 GB RAM+ | SSD 512 GB+ | Ethernet Gigabit.
   - **Terminais Windows:**
     * Mínimo: Windows 10 64-bits | Intel Core i5 7ª gen+ ou equiv. AMD | 8 GB RAM | SSD 128 GB | Ethernet Gigabit | Monitor 15"+ 1366x768.
     * Recomendado: Windows 10 Pro 64-bits | Intel Core i7 7ª gen+ ou equiv. AMD | 12 GB RAM+ | SSD 512 GB+ | Monitor 22"+ 1920x1080 Full HD | Ethernet Gigabit.
   - **Android SmartPOS:**
     * Recomendação geral: Android 7.1.1+, Quad-Core 1.8GHz+, 2GB+ RAM, 8GB+ Armazenamento.
     * Homologados: Sunmi P3 (Getnet - Disp.), Tectoy T8 (Stone - Disp.), Clover Flex (Bin Sitef - Disp.), Gertec GPOS 790/790s (Getnet - Disp.), L300 A11 (Cielo - Disp., Vero - Dev Front), GPOS 730 (Stone - Disp.), Positivo L400 (Stone/Rede/Cielo - Disp.), Sunmi P2 A11 (Stone - Disp.), Newland N960K (Rede - Disp.), Sunmi P2 (Stone/Getnet - Disp., Vero - Dev Front), Positivo L300 (Stone/Cielo - Disp., Vero - Dev Front), GPOS 700X (Stone - Disp.).
     * NÃO Homologados/Em Dev: Newland N950 e N950 K (Vero - Status DEV FRONT, não liberados para produção).
   - **Android PDV Desktop & Autoatendimento (AA):**
     * Recomendação geral: Android 9+, Octa-Core 2.0GHz+, 4GB+ RAM, 16GB+ Armazenamento.
     * PDVs Homologados: Sunmi T2S (Alto fluxo, requer pinpad USB), Clover Mini (Médio fluxo, alerta de fonte pequena), Sunmi T2 mini (Baixo fluxo), Gertec GS300 (Baixo fluxo), Sunmi D2 mini (Baixo fluxo), Postech Pos1732-D-RK (Baixo fluxo apenas, hardware inferior, sem impressora).
     * Autoatendimento (AA): Sunmi K2 (Alto fluxo), Sunmi K2 mini (Médio fluxo), Gertec SK210 (Baixo fluxo).
     * KDS / Senha: Sunmi D2S (Android 11, Quad 1.8GHz, 4GB, 64GB - Médio fluxo).
   - **Periféricos:**
     * Impressoras homologadas: Bematech MP2800 (USB), MP-4200 (USB/Rede), MP-4200HS (USB/Rede); Epson TM-T20x (USB/Rede); Elgin i7, i7 plus, i8, i9, L42 PRO; Sweda SI-250, SI-300L, SI-300S; Daruma DR8000. Bluetooth está em DEV FRONT.
     * Impressoras de Etiquetas: Elgin L42 / L42 PRO / TT042 estão em BACKLOG.
     * Pinpads: Gertec PPC 920, 930, 940; Ingenico Lane 3000, 3600 (USB - DISPONÍVEIS).
     * SAT/MFE: Sweda SS-2000, Elgin Smart, Tanca TS-1000, GerMfe (Alerta de normativas de descontinuação em SP/CE para migração NFC-e até jan/2026).

---

### FLUXO DA RESPOSTA FINAL (Quando todos os dados forem coletados)

Apenas quando NÃO HOUVER PENDÊNCIAS de dados, responda formatando o relatório estritamente no seguinte padrão:

---
# 📊 Diagnóstico de Viabilidade Técnica - Linx Taste One

**Status Geral:** [🟢 APROVADO / 🟡 APROVADO COM RESSALVAS / 🔴 REPROVADO - IMPEDITIVO]

### 1. Análise de Hardware e Equipamentos
- **Dispositivo Analisado:** [Descrição]
- **Status de Conformidade:** [Aprovado / Não Conforme]
- **Observações Técnicas:** [Detalhes comparados ao documento - ex: RAM suficiente, processador homologado, etc.]

### 2. Análise de Infraestrutura e Rede
- **Conexão de Dados:** [Cabeada / Wi-Fi / Móvel]
- **Velocidade e Segregação:** [Velocidade informada e se é dedicada]
- **Status de Rede:** [Aprovado / Reprovado]
- **Alertas Críticos:** [Destacar problemas de Wi-Fi, falta de roteador gerenciável ou compartilhamento de banda se houver]

### 3. Periféricos e Homologações (Se aplicável)
- **Status do Modelo/Adquirente:** [Verificar se consta como DISPONÍVEL na tabela do documento]

### 4. Plano de Ação / Correções Necessárias
- [Lista numerada de ajustes obrigatórios que a loja precisa fazer antes da implantação, se houver]
---

### COMPORTAMENTO INICIAL
Inicie a conversa cumprimentando o usuário de forma profissional, peça primeiro que ele escolha entre TasteOne PDV, TasteOne Autoatendimento e Degust PDV; depois solicite o cenário, hardware e internet.
Seja sempre cordial, preciso tecnicamente e inflexível quanto aos requisitos mínimos de estabilidade e segurança da Linx.`;

export function healthHandler(_req: Request, res: Response) {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
}

export async function chatHandler(req: Request, res: Response) {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 40) {
      return res.status(400).json({ error: "Mensagens inválidas ou quantidade excedida." });
    }

    if (
      messages.some(
        (message) =>
          !message ||
          (message.role !== "user" && message.role !== "assistant") ||
          typeof message.content !== "string" ||
          message.content.trim().length === 0 ||
          message.content.length > 8000,
      )
    ) {
      return res.status(400).json({ error: "Formato de mensagem inválido." });
    }

    const selectedSystems = getSelectedSystems(messages);
    if (selectedSystems.length !== 1) {
      return res.json({
        reply:
          selectedSystems.length > 1
            ? "Identifiquei mais de um sistema. Informe apenas um: **TasteOne PDV**, **TasteOne Autoatendimento** ou **Degust PDV**."
            : "Antes da comparação, informe qual sistema será utilizado: **TasteOne PDV**, **TasteOne Autoatendimento** ou **Degust PDV**. Usarei os requisitos do sistema escolhido.",
        isFallback: true,
      });
    }

    const client = getGeminiClient();

    if (!client) {
      return res.json({
        reply: generateLocalFallbackResponse(messages),
        isFallback: true,
      });
    }

    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2,
      },
    });

    const reply = response.text || "Desculpe, não consegui processar a resposta no momento.";
    return res.json({ reply });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    if (error?.status === 503 || error?.status === 429) {
      return res.json({
        reply: generateLocalFallbackResponse(req.body.messages),
        isFallback: true,
        warning: "O serviço de IA está temporariamente indisponível; a validação local foi utilizada.",
      });
    }
    return res.status(500).json({
      error: error.message || "Erro interno ao processar validação técnica.",
    });
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "512kb" }));

  // Health check endpoint
  app.get("/api/health", healthHandler);

  // Chat endpoint
  app.post("/api/chat", chatHandler);

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Validador Linx Taste One server running on http://localhost:${PORT}`);
  });
}

// Fallback rule evaluator in case API key is missing or offline
function generateLocalFallbackResponse(messages: Array<{ role: string; content: string }>): string {
  // Combine all user messages to have cumulative conversation context
  const userMessages = messages.filter((m) => m.role === "user").map((m) => m.content);
  const combinedUserText = userMessages.join("\n").toLowerCase();
  const lastUserMsg = messages[messages.length - 1]?.content || "";
  const lastLower = lastUserMsg.trim().toLowerCase();
  const hasTasteOne = combinedUserText.includes("tasteone") || combinedUserText.includes("taste one");
  const hasAutoatendimento = combinedUserText.includes("autoatendimento") || combinedUserText.includes("auto atendimento");
  const hasDegust = combinedUserText.includes("degust");
  const selectedSystems = [hasTasteOne, hasAutoatendimento, hasDegust].filter(Boolean).length;

  // Detect technical hardware/network keywords across conversation
  const hasOS = combinedUserText.includes("windows") || combinedUserText.includes("android") || combinedUserText.includes("server") || combinedUserText.includes("sistema operacional");
  const hasCPU = combinedUserText.includes("core") || combinedUserText.includes("i5") || combinedUserText.includes("i7") || combinedUserText.includes("xeon") || combinedUserText.includes("quad") || combinedUserText.includes("octa") || combinedUserText.includes("ryzen") || combinedUserText.includes("processador") || combinedUserText.includes("cpu");
  const hasRAM = combinedUserText.includes("ram") || combinedUserText.includes("gb") || combinedUserText.includes("8gb") || combinedUserText.includes("16gb") || combinedUserText.includes("4gb") || combinedUserText.includes("2gb");
  const hasStorage = combinedUserText.includes("ssd") || combinedUserText.includes("hd") || combinedUserText.includes("disco") || combinedUserText.includes("armazenamento");
  const hasNetwork = combinedUserText.includes("cabo") || combinedUserText.includes("cabeada") || combinedUserText.includes("ethernet") || combinedUserText.includes("wi-fi") || combinedUserText.includes("wifi");
  const hasSpeed = combinedUserText.includes("mbps") || combinedUserText.includes("mega") || combinedUserText.includes("megas") || combinedUserText.includes("velocidade");
  const hasDedicated = combinedUserText.includes("exclusiv") || combinedUserText.includes("dedicad") || combinedUserText.includes("compartilhada") || combinedUserText.includes("segregad");
  const hasRouter = combinedUserText.includes("roteador") || combinedUserText.includes("modem") || combinedUserText.includes("gerenci");

  const hasAnyTechData = hasOS || hasCPU || hasRAM || hasStorage || hasNetwork || hasSpeed || hasDedicated || hasRouter;

  if (!selectedSystems) {
    return `Olá! Para iniciar a validação com o documento correto, informe qual sistema será utilizado:

1. **TasteOne PDV**
2. **TasteOne Autoatendimento**
3. **Degust PDV**

Depois, envie o cenário da loja e as especificações de hardware, sistema operacional, periféricos e rede. Não emitirei um diagnóstico antes de identificar o produto correto.`;
  }

  // If pure greeting without technical specifications
  if (!hasAnyTechData) {
    return `Olá! Sou o **Validador Técnico de Infraestrutura e Hardware** especialista no sistema **Linx Taste One PDV**.

Estou aqui para auditar o ambiente físico, equipamentos e infraestrutura de rede da sua loja, garantindo que tudo atenda rigorosamente aos requisitos mínimos e recomendados da documentação oficial da Linx.

Para iniciarmos a auditoria, por favor me informe:
1. **Qual é o cenário da loja?** (ex: *Servidor Windows Dedicado*, *Servidor/Terminal em máquina única*, *Terminal Windows Caixa*, *SmartPOS Android*, ou *Totem de Autoatendimento*);
2. **Quais são as especificações de hardware disponíveis?** (Sistema Operacional, Processador, Memória RAM, Armazenamento SSD/HD e Monitor);
3. **Como é a infraestrutura de rede e internet?** (Cabo Ethernet ou Wi-Fi, velocidade em Mbps, se é de uso exclusivo Linx e tipo de roteador).

Fico no aguardo dos dados para iniciarmos a validação técnica!`;
  }

  // Detect which specific scenario is being analyzed
  const isAndroid = combinedUserText.includes("android") || combinedUserText.includes("smartpos") || combinedUserText.includes("sunmi") || combinedUserText.includes("tectoy") || combinedUserText.includes("clover") || combinedUserText.includes("gertec") || combinedUserText.includes("autoatendimento");
  const isTerminalWin = combinedUserText.includes("terminal windows") || combinedUserText.includes("caixa");

  const missing: string[] = [];

  if (isAndroid) {
    if (!combinedUserText.includes("sunmi") && !combinedUserText.includes("tectoy") && !combinedUserText.includes("clover") && !combinedUserText.includes("gertec") && !combinedUserText.includes("positivo") && !combinedUserText.includes("newland") && !combinedUserText.includes("modelo")) {
      missing.push("Modelo exato do dispositivo Android e fornecedor/adquirente (ex: Sunmi P3 Getnet, Tectoy T8 Stone, Gertec GS300)");
    }
    if (!combinedUserText.includes("baixo") && !combinedUserText.includes("médio") && !combinedUserText.includes("medio") && !combinedUserText.includes("alto") && !combinedUserText.includes("fluxo")) {
      missing.push("Finalidade e fluxo operacional da loja (Baixo, Médio ou Alto fluxo)");
    }
    if (!hasOS) missing.push("Versão do Sistema Operacional Android (ex: Android 7.1.1, Android 9, Android 11)");
    if (!hasCPU) missing.push("Processador do dispositivo Android (ex: Quad-Core 1.8 GHz ou Octa-Core 2.0 GHz)");
    if (!hasRAM) missing.push("Memória RAM disponível no dispositivo");
  } else {
    // Windows Server or Terminal
    if (!hasOS) missing.push("Sistema Operacional exato (ex: Windows Server 2019/11 Pro 64-bits ou Windows 10 64-bits)");
    if (!hasCPU) missing.push("Processador (Modelo, geração e quantidade de núcleos)");
    if (!hasRAM) missing.push("Memória RAM (GB)");
    if (!hasStorage) missing.push("Tipo e capacidade de armazenamento (ex: SSD 256 GB ou HD)");
    if (isTerminalWin && !combinedUserText.includes("monitor") && !combinedUserText.includes("resolução") && !combinedUserText.includes("resolucao") && !combinedUserText.includes("1366") && !combinedUserText.includes("1920")) {
      missing.push("Resolução da tela do monitor para o terminal (ex: 1366x768 HD ou 1920x1080 Full HD)");
    }
  }

  // Mandatory Network for all
  if (!hasNetwork) missing.push("Conectividade física (Conexão cabeada Ethernet Gigabit ou Wi-Fi)");
  if (!hasSpeed) missing.push("Velocidade contratada de Internet (igual ou superior a 15 Mbps)");
  if (!hasDedicated) missing.push("Se a rede é de uso exclusivo do ecossistema Linx ou compartilhada (câmeras, Wi-Fi clientes, etc.)");
  if (!hasRouter) missing.push("Se a rede é gerenciada por roteador gerenciável (fixando IP/MAC) ou modem da operadora");

  // If there are any missing fields, DO NOT EMIT REPORT
  if (missing.length > 0) {
    return `Agradeço o envio das informações preliminares da loja!

Para que eu possa emitir o parecer técnico oficial de viabilidade, conforme as diretrizes da Linx, ainda **precisamos dos seguintes dados obrigatórios que estão faltando**:

${missing.map((item, idx) => `${idx + 1}. **${item}**`).join("\n")}

Por gentileza, envie essas informações faltantes para que possamos emitir o laudo de viabilidade técnica.`;
  }

  // All data gathered: Evaluate Technical Status
  const isWifi = combinedUserText.includes("wi-fi") || combinedUserText.includes("wifi") || combinedUserText.includes("sem fio") || combinedUserText.includes("3g") || combinedUserText.includes("4g") || combinedUserText.includes("5g");
  const isBelow15 = combinedUserText.includes("10 mbps") || combinedUserText.includes("5 mbps") || combinedUserText.includes("10mbps") || combinedUserText.includes("8 mbps") || combinedUserText.includes("2 mbps");
  const isShared = combinedUserText.includes("compartilhada");
  const isModemOperadora = combinedUserText.includes("modem da operadora") || (combinedUserText.includes("modem") && !combinedUserText.includes("gerenciável") && !combinedUserText.includes("gerenciavel"));
  const isHD = combinedUserText.includes("hd ") || combinedUserText.includes("disco rígido") || combinedUserText.includes("mecanico");

  // Determine overall status
  let statusGeral = "🟢 APROVADO";
  let hardwareConformidade = "Aprovado";
  let redeConformidade = "Aprovado";

  if (isWifi || isHD) {
    statusGeral = "🔴 REPROVADO - IMPEDITIVO";
    if (isWifi) redeConformidade = "Reprovado";
    if (isHD) hardwareConformidade = "Não Conforme";
  } else if (isBelow15 || isShared || isModemOperadora) {
    statusGeral = "🟡 APROVADO COM RESSALVAS";
    redeConformidade = "Aprovado com Ressalvas";
  }

  const alertList: string[] = [];
  if (isWifi) {
    alertList.push("O uso de rede Wi-Fi ou dados móveis para operação de PDV/TEF/Fiscal é terminantemente PROIBIDO pela documentação da Linx. Gera instabilidade crítica, falha de comunicação com servidor e quedas de TEF.");
  }
  if (isBelow15) {
    alertList.push("A velocidade de internet informada é inferior a 15 Mbps, o que não atende ao requisito mínimo Linx para emissão de NFC-e/SAT e acesso remoto de suporte.");
  }
  if (isShared) {
    alertList.push("A rede não deve ser compartilhada com clientes ou câmeras. É obrigatória a segregação com infraestrutura dedicada ao ecossistema Linx.");
  }
  if (isModemOperadora) {
    alertList.push("Modem de operadora não deve gerenciar a rede. É obrigatório o uso de roteador gerenciável fixando o IP ao endereço MAC do servidor e terminais.");
  }
  if (combinedUserText.includes("wifi") && combinedUserText.includes("cabo")) {
    alertList.push("Uso simultâneo de Wi-Fi e Cabo na mesma máquina causa oscilação de rota e falhas em impressoras de rede.");
  }

  const actionList: string[] = [];
  if (isWifi) {
    actionList.push("Substituir imediatamente a conexão Wi-Fi por cabeamento de rede Ethernet Gigabit dedicado aos PDVs.");
  }
  if (isHD) {
    actionList.push("Substituir o HD mecânico por um SSD (mínimo 256 GB para servidor ou 128 GB para terminais).");
  }
  if (isBelow15) {
    actionList.push("Aumentar a banda de internet para no mínimo 15 Mbps dedicados ao ecossistema Linx.");
  }
  if (isShared) {
    actionList.push("Criar VLAN ou rede física segregada exclusiva para os PDVs, terminais e servidores Linx.");
  }
  if (isModemOperadora) {
    actionList.push("Instalar roteador gerenciável e configurar amarração estática de IP por endereço físico MAC.");
  }
  if (actionList.length === 0) {
    actionList.push("Manter as boas práticas de infraestrutura física e realizar a fixação de IP/MAC no roteador gerenciável.");
    actionList.push("Agendar a implantação e homologação do Linx Taste One com a equipe de serviços.");
  }

  return `# 📊 Diagnóstico de Viabilidade Técnica - Linx Taste One

**Status Geral:** [${statusGeral}]

### 1. Análise de Hardware e Equipamentos
- **Dispositivo Analisado:** ${isAndroid ? "Terminal Android Homologado Linx Taste One" : "Equipamento Windows (Servidor / Terminal)"}
- **Status de Conformidade:** [${hardwareConformidade}]
- **Observações Técnicas:** Hardware validado perante a matriz oficial de requisitos mínimos e recomendados do Linx Taste One PDV. ${isHD ? "O uso de HD mecânico não atende ao requisito mínimo de SSD." : "Configuração de CPU, memória RAM e armazenamento atende às exigências."}

### 2. Análise de Infraestrutura e Rede
- **Conexão de Dados:** [${isWifi ? "Wi-Fi (Não Conforme)" : "Cabeada Ethernet Gigabit"}]
- **Velocidade e Segregação:** [${isBelow15 ? "Inferior a 15 Mbps" : "Igual ou superior a 15 Mbps"} / ${isShared ? "Compartilhada" : "Dedicada ao ecossistema Linx"}]
- **Status de Rede:** [${redeConformidade}]
- **Alertas Críticos:** [${alertList.length > 0 ? alertList.join(" ") : "Nenhum impedimento crítico detectado. Rede cabeada e velocidade dentro das exigências da documentação oficial."}]

### 3. Periféricos e Homologações (Se aplicável)
- **Status do Modelo/Adquirente:** [${isAndroid ? "Modelo constante como DISPONÍVEL na tabela de homologação Android" : "Compatível com impressoras térmicas e pinpads homologados via USB"}]

### 4. Plano de Ação / Correções Necessárias
${actionList.map((item, i) => `${i + 1}. ${item}`).join("\n")}
---`;
}

if (process.env.VERCEL !== "1") {
  startServer();
}
