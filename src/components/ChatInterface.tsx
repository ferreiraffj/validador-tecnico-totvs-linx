import React, { useState, useRef, useEffect } from "react";
import { ImageAttachment, Message, HardwarePreset } from "../types";
import { ChatMessageBubble } from "./ChatMessageBubble";
import { SAMPLE_SCENARIOS } from "../data/sampleScenarios";
import { Send, RefreshCw, Layers, ShieldCheck, ChevronRight, ImagePlus, X } from "lucide-react";

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string, images?: ImageAttachment[]) => Promise<void>;
  isLoading: boolean;
  onOpenWizard: () => void;
  onSelectPreset: (preset: HardwarePreset) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onOpenWizard,
  onSelectPreset,
}) => {
  const [input, setInput] = useState("");
  const [images, setImages] = useState<ImageAttachment[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const trimmed = input.trim();
    if ((!trimmed && images.length === 0) || isLoading) return;
    setInput("");
    const selectedImages = images;
    setImages([]);
    await onSendMessage(trimmed || "Analise as imagens anexadas e extraia as especificações técnicas visíveis.", selectedImages);
  };

  const handleImageSelection = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const imageFiles = files.filter((file) => ["image/png", "image/jpeg", "image/webp"].includes(file.type)).slice(0, 4);
    const loadedImages = await Promise.all(
      imageFiles.map(
        (file) =>
          new Promise<ImageAttachment>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const image = new Image();
              image.onload = () => {
                const scale = Math.min(1, 1280 / Math.max(image.naturalWidth, image.naturalHeight));
                const canvas = document.createElement("canvas");
                canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
                canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
                canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
                resolve({ name: file.name, mimeType: "image/jpeg", dataUrl: canvas.toDataURL("image/jpeg", 0.72) });
              };
              image.onerror = () => reject(new Error(`Não foi possível processar ${file.name}.`));
              image.src = String(reader.result);
            };
            reader.onerror = () => reject(new Error(`Não foi possível ler ${file.name}.`));
            reader.readAsDataURL(file);
          }),
      ),
    );
    setImages((current) => [...current, ...loadedImages].slice(0, 4));
    event.target.value = "";
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden relative">
      {/* Scenario Presets Quick Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 shrink-0 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 shrink-0">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Cenários de Teste:</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-0.5 no-scrollbar">
            {SAMPLE_SCENARIOS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition shrink-0 hover:border-slate-300 disabled:opacity-50"
                title={preset.description}
              >
                <span>{preset.title}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold border ${preset.badgeColor}`}>
                  {preset.badge}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Banner Card */}
          <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white shadow-lg border border-slate-700/50">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-700/60">
                    Auditoria Rigorosa
                  </span>
                  <span className="text-xs text-slate-400">TOTVS Linx 2026</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white mb-1">
                  Validador de Viabilidade Técnica e Homologação
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Envie as especificações da loja (hardware, sistema operacional, conexões e roteador) em texto livre ou utilize o{" "}
                  <button
                    onClick={onOpenWizard}
                    className="underline text-cyan-300 font-semibold hover:text-cyan-200"
                  >
                    Formulário Guiado
                  </button>
                  . O auditor verificará pendências, aplicará bloqueios técnicos e emitirá o laudo oficial.
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          {messages.map((msg) => (
            <ChatMessageBubble key={msg.id} message={msg} />
          ))}

          {/* Auditor Thinking Indicator */}
          {isLoading && (
            <div className="flex items-center gap-3 my-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm animate-pulse">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-600 shadow-sm flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                <span>Auditor analisando especificações contra a matriz oficial Linx...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Box Area */}
      <div className="bg-white border-t border-slate-200 p-3 sm:p-4 shrink-0 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="flex items-end gap-2"
          >
            <div className="relative flex-1">
              {images.length > 0 && (
                <div className="flex gap-2 mb-2 overflow-x-auto">
                  {images.map((image, index) => (
                    <div key={`${image.name}-${index}`} className="relative shrink-0">
                      <img src={image.dataUrl} alt={`Anexo ${image.name}`} className="w-14 h-14 object-cover rounded-lg border border-slate-300" />
                      <button
                        type="button"
                        onClick={() => setImages((current) => current.filter((_, imageIndex) => imageIndex !== index))}
                        className="absolute -top-1.5 -right-1.5 rounded-full bg-slate-800 text-white p-0.5"
                        title="Remover imagem"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
                disabled={isLoading}
                placeholder="Informe os dados da loja (ex: Servidor Windows 11 Pro, i5 10ª gen, 16GB RAM, SSD 512GB, Cabo Ethernet, 50Mbps)..."
                className="w-full resize-none p-3 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50 disabled:opacity-50"
              />
            </div>

            <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" multiple className="hidden" onChange={handleImageSelection} />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || images.length >= 4}
              className="h-12 w-12 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 flex items-center justify-center disabled:opacity-40"
              title="Anexar capturas de tela"
            >
              <ImagePlus className="w-4 h-4" />
            </button>
            <button
              type="submit"
              disabled={(!input.trim() && images.length === 0) || isLoading}
              className="h-12 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center justify-center gap-1.5 transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              title="Enviar mensagem para o auditor"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">Validar</span>
            </button>
          </form>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
            <span>Você pode anexar até 4 capturas PNG, JPG ou WebP. Informe o sistema junto com as imagens.</span>
            <button
              onClick={onOpenWizard}
              className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
            >
              <span>Abrir Formulário Passo a Passo</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
