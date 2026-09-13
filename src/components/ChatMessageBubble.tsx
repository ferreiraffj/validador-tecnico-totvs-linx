import React, { useState } from "react";
import { Message } from "../types";
import { ShieldCheck, User, Copy, Check, AlertCircle } from "lucide-react";
import Markdown from "react-markdown";
import { ReportCard } from "./ReportCard";

interface ChatMessageBubbleProps {
  message: Message;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isAssistant = message.role === "assistant";

  // Check if content is a technical report
  const isReport =
    message.content.includes("# 📊 Diagnóstico de Viabilidade Técnica") ||
    (message.content.includes("Diagnóstico de Viabilidade Técnica") && message.content.includes("Status Geral:")) ||
    (message.content.includes("Status Geral:") &&
      message.content.includes("Análise de Hardware") &&
      message.content.includes("Plano de Ação"));

  // Check if message is notifying about missing fields (pendências)
  const isPendingWarning =
    isAssistant &&
    (message.content.includes("estão faltando") ||
      message.content.includes("precisamos dos seguintes dados que estão pendentes") ||
      message.content.includes("dados que ainda estão faltando") ||
      message.content.includes("faltantes para prosseguir"));

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex items-start gap-3 my-4 group ${
        isAssistant ? "justify-start" : "justify-end"
      }`}
    >
      {/* Avatar for Assistant */}
      {isAssistant && (
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-700 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
          <ShieldCheck className="w-5 h-5" />
        </div>
      )}

      {/* Message Box */}
      <div
        className={`relative max-w-3xl rounded-2xl p-4 shadow-sm transition-all ${
          isAssistant
            ? isPendingWarning
              ? "bg-amber-50/90 border border-amber-300 text-slate-800"
              : "bg-white border border-slate-200 text-slate-800"
            : "bg-blue-600 text-white"
        }`}
      >
        {/* Pending Notice Banner */}
        {isPendingWarning && (
          <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-amber-200 text-amber-900 font-semibold text-xs">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Pendência de Dados Obrigatórios para Diagnóstico</span>
          </div>
        )}

        {/* Message Content */}
        {isReport ? (
          <ReportCard content={message.content} />
        ) : (
          <div
            className={`text-sm leading-relaxed prose prose-sm max-w-none ${
              isAssistant
                ? "prose-slate prose-headings:font-bold prose-headings:text-slate-900 prose-strong:text-slate-900 prose-ul:my-2 prose-li:my-0.5"
                : "text-white prose-headings:text-white prose-strong:text-white prose-a:text-cyan-200"
            }`}
          >
            <Markdown>{message.content}</Markdown>
          </div>
        )}

        {/* Bubble Footer */}
        <div
          className={`flex items-center justify-between gap-4 mt-2 pt-1.5 text-[11px] border-t ${
            isAssistant
              ? isPendingWarning
                ? "border-amber-200/80 text-amber-800/80"
                : "border-slate-100 text-slate-400"
              : "border-blue-500/50 text-blue-100"
          }`}
        >
          <span>{message.timestamp}</span>

          <button
            onClick={handleCopy}
            className={`opacity-0 group-hover:opacity-100 flex items-center gap-1 transition px-1.5 py-0.5 rounded text-[10px] ${
              isAssistant
                ? "hover:bg-slate-100 text-slate-500"
                : "hover:bg-blue-700 text-blue-200"
            }`}
            title="Copiar mensagem"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? "Copiado" : "Copiar"}</span>
          </button>
        </div>
      </div>

      {/* Avatar for User */}
      {!isAssistant && (
        <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
          <User className="w-4 h-4 text-slate-300" />
        </div>
      )}
    </div>
  );
};
