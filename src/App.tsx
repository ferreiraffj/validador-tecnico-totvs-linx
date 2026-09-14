import React, { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { ChatInterface } from "./components/ChatInterface";
import { DocumentationDrawer } from "./components/DocumentationDrawer";
import { SpecBuilderModal } from "./components/SpecBuilderModal";
import { ImageAttachment, Message, HardwarePreset } from "./types";

const CHAT_STORAGE_KEY = "linx-taste-one:recent-chat";

const INITIAL_GREETING: Message = {
  id: "initial-greeting",
  role: "assistant",
  content: `Olá! Sou o **Validador Técnico de Infraestrutura e Hardware** especialista nos sistemas **TasteOne PDV, TasteOne Autoatendimento e Degust PDV**.

Estou aqui para auditar o ambiente físico, equipamentos e infraestrutura de rede da sua loja para garantir conformidade rigorosa com os requisitos mínimos e recomendados da documentação oficial da Linx.

Para iniciarmos a validação técnica, primeiro informe qual sistema será utilizado:
1. **TasteOne PDV**;
2. **TasteOne Autoatendimento**;
3. **Degust PDV**.

Depois, informe o cenário da loja, os detalhes de hardware (sistema operacional, processador, RAM, armazenamento e periféricos) e a infraestrutura de rede e internet. Usarei somente os requisitos do sistema escolhido.

Você também pode utilizar os botões de **Cenários Rápidos** acima ou clicar em **Formulário Guiado** para preencher as informações passo a passo!`,
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const storedChat = window.localStorage.getItem(CHAT_STORAGE_KEY);
      if (!storedChat) return [INITIAL_GREETING];

      const parsedChat: unknown = JSON.parse(storedChat);
      if (
        Array.isArray(parsedChat) &&
        parsedChat.every(
          (message): message is Message =>
            typeof message === "object" &&
            message !== null &&
            typeof (message as Message).id === "string" &&
            (message as Message).role !== undefined &&
            typeof (message as Message).content === "string" &&
            typeof (message as Message).timestamp === "string",
        )
      ) {
        return parsedChat;
      }
    } catch (error) {
      console.warn("Não foi possível restaurar o chat salvo localmente.", error);
      window.localStorage.removeItem(CHAT_STORAGE_KEY);
    }

    return [INITIAL_GREETING];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDocOpen, setIsDocOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.warn("Não foi possível salvar o chat localmente.", error);
    }
  }, [messages]);

  const handleSendMessage = async (text: string, images: ImageAttachment[] = []) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      images: images.length > 0 ? images : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Build conversation payload
      const lastImageMessageIndex = updatedMessages.reduce(
        (lastIndex, message, index) => (message.images && message.images.length > 0 ? index : lastIndex),
        -1,
      );
      const payload = updatedMessages.map((m, index) => ({
        role: m.role,
        content: m.content,
        ...(m.images && index === lastImageMessageIndex ? { images: m.images } : {}),
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro de comunicação HTTP ${res.status}`);
      }

      const data = await res.json();
      const assistantReply = data.reply || "Resposta não recebida do auditor.";

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: assistantReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error: any) {
      console.error("Erro ao enviar mensagem:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `⚠️ **Aviso do Sistema:** Ocorreu uma instabilidade na consulta ao auditor técnico (${error.message || "Erro de rede"}). Por favor, tente novamente ou verifique se o serviço está online.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    const newChat = [
      {
        ...INITIAL_GREETING,
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];
    setMessages(newChat);
    try {
      window.localStorage.removeItem(CHAT_STORAGE_KEY);
    } catch (error) {
      console.warn("Não foi possível limpar o chat salvo localmente.", error);
    }
  };

  const handleSelectPreset = (preset: HardwarePreset) => {
    handleSendMessage(preset.prompt);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-100 overflow-hidden font-sans text-slate-800">
      {/* Top Header */}
      <Header
        onReset={handleReset}
        onOpenDoc={() => setIsDocOpen(true)}
        onOpenWizard={() => setIsWizardOpen(true)}
        isAuditing={isLoading}
      />

      {/* Main Conversational Workspace */}
      <main className="flex-1 flex overflow-hidden relative">
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          onOpenWizard={() => setIsWizardOpen(true)}
          onSelectPreset={handleSelectPreset}
        />
      </main>

      {/* Official Documentation Drawer */}
      <DocumentationDrawer isOpen={isDocOpen} onClose={() => setIsDocOpen(false)} />

      {/* Spec Builder Wizard Modal */}
      <SpecBuilderModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSubmit={handleSendMessage}
      />
    </div>
  );
}
