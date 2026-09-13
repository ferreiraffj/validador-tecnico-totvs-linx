import React, { useState } from "react";
import { X, Send, Sparkles, AlertCircle } from "lucide-react";

interface SpecBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
}

export const SpecBuilderModal: React.FC<SpecBuilderModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [system, setSystem] = useState<"tasteone" | "autoatendimento" | "degust">("tasteone");
  const [scenario, setScenario] = useState<"servidor_windows" | "servidor_terminal_unico" | "terminal_windows" | "android_smartpos" | "android_pdv_desktop" | "android_autoatendimento">("servidor_windows");

  // Windows Specs
  const [winOS, setWinOS] = useState("Windows Server 2019 64-bits");
  const [winCPU, setWinCPU] = useState("Intel Core i5 10ª geração (6 núcleos)");
  const [winRAM, setWinRAM] = useState("16");
  const [winStorageType, setWinStorageType] = useState<"SSD" | "HD">("SSD");
  const [winStorageSize, setWinStorageSize] = useState("512");
  const [winMonitor, setWinMonitor] = useState("1920 x 1080 (Full HD)");

  // Android Specs
  const [androidModel, setAndroidModel] = useState("Sunmi P3");
  const [androidAcquirer, setAndroidAcquirer] = useState("Getnet");
  const [androidFlow, setAndroidFlow] = useState<"Baixo" | "Médio" | "Alto">("Médio");
  const [androidOS, setAndroidOS] = useState("Android 11");
  const [androidCPU, setAndroidCPU] = useState("Quad-Core 1.8 GHz");
  const [androidRAM, setAndroidRAM] = useState("2");
  const [androidStorage, setAndroidStorage] = useState("16");

  // Network & Internet Specs (All)
  const [netConnection, setNetConnection] = useState<"Ethernet (Cabo)" | "Wi-Fi" | "3G/4G/5G">("Ethernet (Cabo)");
  const [netSpeed, setNetSpeed] = useState("50");
  const [netExclusive, setNetExclusive] = useState<"Exclusiva Linx" | "Compartilhada">("Exclusiva Linx");
  const [netRouter, setNetRouter] = useState<"Roteador Gerenciável (IP/MAC fixado)" | "Modem da Operadora">("Roteador Gerenciável (IP/MAC fixado)");
  const [peripherals, setPeripherals] = useState("");

  if (!isOpen) return null;

  const isWindows = scenario.startsWith("servidor") || scenario === "terminal_windows";

  const handleGenerate = () => {
    let prompt = `Olá, solicito a auditoria técnica da seguinte infraestrutura:\n\n`;
    const systemName =
      system === "tasteone"
        ? "TasteOne PDV"
        : system === "autoatendimento"
        ? "TasteOne Autoatendimento"
        : "Degust PDV";
    prompt += `- **Sistema Linx a ser validado:** ${systemName}\n`;

    if (scenario === "servidor_windows") {
      prompt += `- **Tipo de Cenário:** Servidor Dedicado Windows\n`;
      prompt += `- **Sistema Operacional:** ${winOS}\n`;
      prompt += `- **Processador:** ${winCPU}\n`;
      prompt += `- **Memória RAM:** ${winRAM} GB\n`;
      prompt += `- **Armazenamento:** ${winStorageType} de ${winStorageSize} GB\n`;
      prompt += `- **Conectividade:** ${netConnection}\n`;
    } else if (scenario === "servidor_terminal_unico") {
      prompt += `- **Tipo de Cenário:** Servidor/Terminal (máquina única que atua como servidor e PDV caixa)\n`;
      prompt += `- **Sistema Operacional:** ${winOS}\n`;
      prompt += `- **Processador:** ${winCPU}\n`;
      prompt += `- **Memória RAM:** ${winRAM} GB\n`;
      prompt += `- **Armazenamento:** ${winStorageType} de ${winStorageSize} GB\n`;
      prompt += `- **Conectividade:** ${netConnection}\n`;
      prompt += `- **Resolução do Monitor:** ${winMonitor}\n`;
    } else if (scenario === "terminal_windows") {
      prompt += `- **Tipo de Cenário:** Terminal Windows (PDV Caixa)\n`;
      prompt += `- **Sistema Operacional:** ${winOS}\n`;
      prompt += `- **Processador:** ${winCPU}\n`;
      prompt += `- **Memória RAM:** ${winRAM} GB\n`;
      prompt += `- **Armazenamento:** ${winStorageType} de ${winStorageSize} GB\n`;
      prompt += `- **Conectividade:** ${netConnection}\n`;
      prompt += `- **Resolução do Monitor:** ${winMonitor}\n`;
    } else {
      const scenarioTitle =
        scenario === "android_smartpos"
          ? "SmartPOS Android Mobile"
          : scenario === "android_pdv_desktop"
          ? "PDV Desktop Android"
          : "Totem de Autoatendimento (AA) Android";

      prompt += `- **Tipo de Cenário:** ${scenarioTitle}\n`;
      prompt += `- **Modelo Exato e Adquirente:** ${androidModel} (Ofertado por: ${androidAcquirer})\n`;
      prompt += `- **Finalidade e Fluxo da Loja:** ${androidFlow} fluxo operacional\n`;
      prompt += `- **Sistema Operacional:** ${androidOS}\n`;
      prompt += `- **Processador e RAM:** ${androidCPU} com ${androidRAM} GB RAM e ${androidStorage} GB de armazenamento\n`;
      prompt += `- **Conectividade:** ${netConnection}\n`;
    }

    prompt += `- **Velocidade de Internet:** ${netSpeed} Mbps\n`;
    prompt += `- **Segregação de Banda:** ${netExclusive}\n`;
    prompt += `- **Gerenciamento de Rede:** ${netRouter}\n`;
    prompt += `- **Periféricos:** ${peripherals.trim() || "Nenhum periférico informado"}\n`;

    onSubmit(prompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-6 border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div>
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
              Assistente de Entrada
            </span>
            <h2 className="text-lg font-bold">Formulário Guiado de Coleta Técnica</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* Scenario Picker */}
          <div>
            <label className="block font-bold text-slate-900 mb-1.5">
              1. Qual sistema será utilizado?
            </label>
            <select
              value={system}
              onChange={(e) => setSystem(e.target.value as "tasteone" | "autoatendimento" | "degust")}
              className="w-full p-2.5 mb-4 rounded-lg border border-slate-300 bg-white text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="tasteone">TasteOne PDV</option>
              <option value="autoatendimento">TasteOne Autoatendimento</option>
              <option value="degust">Degust PDV</option>
            </select>
            <label className="block font-bold text-slate-900 mb-1.5">
              2. Qual o tipo de ambiente da loja?
            </label>
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value as any)}
              className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="servidor_windows">Servidor Windows Dedicado</option>
              <option value="servidor_terminal_unico">Servidor/Terminal (Máquina Única Servidor + Caixa)</option>
              <option value="terminal_windows">Terminal Windows (Caixa)</option>
              <option value="android_smartpos">SmartPOS Android Mobile (ex: Sunmi P3, Tectoy T8, GPOS 790)</option>
              <option value="android_pdv_desktop">PDV Desktop Android (ex: Sunmi T2S, Clover Mini, GS300)</option>
              <option value="android_autoatendimento">Totem de Autoatendimento Android (ex: Sunmi K2, K2 mini, SK210)</option>
            </select>
          </div>

          {/* Section: Hardware Specs */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
              2. Especificações de Hardware
            </h3>

            {isWindows ? (
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Sistema Operacional</label>
                  <input
                    type="text"
                    value={winOS}
                    onChange={(e) => setWinOS(e.target.value)}
                    placeholder="ex: Windows Server 2019 ou Windows 11 Pro 64-bits"
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Processador (CPU)</label>
                  <input
                    type="text"
                    value={winCPU}
                    onChange={(e) => setWinCPU(e.target.value)}
                    placeholder="ex: Intel Core i5 7ª gen ou Intel Xeon 8 cores"
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Memória RAM (GB)</label>
                  <select
                    value={winRAM}
                    onChange={(e) => setWinRAM(e.target.value)}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="4">4 GB (Abaixo do mínimo)</option>
                    <option value="8">8 GB (Mínimo)</option>
                    <option value="12">12 GB (Recomendado Terminais)</option>
                    <option value="16">16 GB (Recomendado Servidor)</option>
                    <option value="32">32 GB ou mais</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Armazenamento</label>
                  <div className="flex gap-2">
                    <select
                      value={winStorageType}
                      onChange={(e) => setWinStorageType(e.target.value as any)}
                      className="w-24 p-2 text-xs border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="SSD">SSD</option>
                      <option value="HD">HD (Mecânico)</option>
                    </select>
                    <input
                      type="number"
                      value={winStorageSize}
                      onChange={(e) => setWinStorageSize(e.target.value)}
                      placeholder="GB"
                      className="flex-1 p-2 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                    <span className="self-center text-xs text-slate-500">GB</span>
                  </div>
                </div>

                {scenario !== "servidor_windows" && (
                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-medium mb-1">Resolução do Monitor</label>
                    <input
                      type="text"
                      value={winMonitor}
                      onChange={(e) => setWinMonitor(e.target.value)}
                      placeholder="ex: 1366 x 768 (HD) ou 1920 x 1080 (Full HD)"
                      className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Modelo Exato</label>
                  <input
                    type="text"
                    value={androidModel}
                    onChange={(e) => setAndroidModel(e.target.value)}
                    placeholder="ex: Sunmi P3, Tectoy T8, Clover Flex, K2"
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Adquirente / Parceiro</label>
                  <input
                    type="text"
                    value={androidAcquirer}
                    onChange={(e) => setAndroidAcquirer(e.target.value)}
                    placeholder="ex: Getnet, Stone, Cielo, Rede, Bin Sitef"
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Fluxo Operacional</label>
                  <select
                    value={androidFlow}
                    onChange={(e) => setAndroidFlow(e.target.value as any)}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Baixo">Baixo Fluxo</option>
                    <option value="Médio">Médio Fluxo</option>
                    <option value="Alto">Alto Fluxo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Versão do Android</label>
                  <input
                    type="text"
                    value={androidOS}
                    onChange={(e) => setAndroidOS(e.target.value)}
                    placeholder="ex: Android 9 ou Android 11"
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Processador & RAM</label>
                  <input
                    type="text"
                    value={androidCPU}
                    onChange={(e) => setAndroidCPU(e.target.value)}
                    placeholder="ex: Quad-Core 1.8 GHz ou Octa-Core 2.0 GHz"
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Memória RAM</label>
                  <select
                    value={androidRAM}
                    onChange={(e) => setAndroidRAM(e.target.value)}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="1">1 GB (Abaixo do mínimo)</option>
                    <option value="2">2 GB (Mínimo SmartPOS)</option>
                    <option value="4">4 GB (Mínimo PDV/AA)</option>
                    <option value="8">8 GB ou mais</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Section: Optional Peripherals */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
              4. Periféricos (Opcional)
            </h3>
            <label className="block text-slate-700 font-medium" htmlFor="peripherals">
              Informe impressora, pinpad, leitor, gaveta, balança ou outros equipamentos:
            </label>
            <textarea
              id="peripherals"
              value={peripherals}
              onChange={(e) => setPeripherals(e.target.value)}
              rows={3}
              placeholder="Ex: Impressora Epson TM-T20x USB, pinpad Gertec PPC 930 e leitor de código de barras."
              className="w-full resize-y p-2 text-xs border border-slate-300 rounded-lg bg-white"
            />
          </div>

          {/* Section: Network & Connectivity */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
              5. Conectividade de Rede e Internet (Obrigatório)
            </h3>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Tipo de Conexão</label>
                <select
                  value={netConnection}
                  onChange={(e) => setNetConnection(e.target.value as any)}
                  className={`w-full p-2 text-xs border rounded-lg bg-white ${
                    netConnection !== "Ethernet (Cabo)" ? "border-rose-400 bg-rose-50/50" : "border-slate-300"
                  }`}
                >
                  <option value="Ethernet (Cabo)">Ethernet Cabeada (Gigabit)</option>
                  <option value="Wi-Fi">Wi-Fi (Sem fio)</option>
                  <option value="3G/4G/5G">Rede Móvel 3G/4G/5G</option>
                </select>
                {netConnection !== "Ethernet (Cabo)" && (
                  <p className="text-[10px] text-rose-600 font-semibold mt-1">
                    ⚠️ Conexões sem fio são reprovadas para PDVs/TEF pela documentação Linx.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Velocidade da Internet (Mbps)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={netSpeed}
                    onChange={(e) => setNetSpeed(e.target.value)}
                    placeholder="Mínimo 15"
                    className="flex-1 p-2 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                  <span className="text-xs text-slate-500">Mbps</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Segregação da Rede</label>
                <select
                  value={netExclusive}
                  onChange={(e) => setNetExclusive(e.target.value as any)}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Exclusiva Linx">Exclusiva do Ecossistema Linx</option>
                  <option value="Compartilhada">Compartilhada (com Wi-Fi de clientes ou câmeras)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Gerenciamento de Rede</label>
                <select
                  value={netRouter}
                  onChange={(e) => setNetRouter(e.target.value as any)}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Roteador Gerenciável (IP/MAC fixado)">
                    Roteador Gerenciável (IP fixado por MAC)
                  </option>
                  <option value="Modem da Operadora">
                    Modem Padrão da Operadora (Não recomendado)
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 transition"
          >
            Cancelar
          </button>

          <button
            onClick={handleGenerate}
            className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-md transition"
          >
            <Send className="w-3.5 h-3.5" />
            Enviar para Validação Técnica
          </button>
        </div>
      </div>
    </div>
  );
};
