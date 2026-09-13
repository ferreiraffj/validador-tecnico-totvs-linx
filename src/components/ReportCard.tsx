import React, { useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Copy, Check, Download, Printer, ShieldAlert, Award } from "lucide-react";
import Markdown from "react-markdown";

interface ReportCardProps {
  content: string;
}

export const ReportCard: React.FC<ReportCardProps> = ({ content }) => {
  const [copied, setCopied] = useState(false);

  // Extract status
  let statusType: "APROVADO" | "RESSALVAS" | "REPROVADO" = "APROVADO";
  if (content.includes("REPROVADO")) {
    statusType = "REPROVADO";
  } else if (content.includes("RESSALVAS") || content.includes("RESSALVA")) {
    statusType = "RESSALVAS";
  } else if (content.includes("APROVADO")) {
    statusType = "APROVADO";
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `Laudo_Tecnico_Linx_Taste_One_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="my-4 rounded-xl border-2 bg-white shadow-xl overflow-hidden transition-all duration-300 print:m-0 print:border-none print:shadow-none ${
      statusType === 'APROVADO'
        ? 'border-emerald-500/80 ring-1 ring-emerald-500/20'
        : statusType === 'RESSALVAS'
        ? 'border-amber-500/80 ring-1 ring-amber-500/20'
        : 'border-rose-500/80 ring-1 ring-rose-500/20'
    }">
      {/* Header Banner */}
      <div
        className={`px-5 py-4 flex flex-wrap items-center justify-between gap-3 text-white ${
          statusType === "APROVADO"
            ? "bg-gradient-to-r from-emerald-700 to-teal-800"
            : statusType === "RESSALVAS"
            ? "bg-gradient-to-r from-amber-700 to-orange-800"
            : "bg-gradient-to-r from-rose-700 to-red-800"
        }`}
      >
        <div className="flex items-center gap-3">
          {statusType === "APROVADO" && <CheckCircle2 className="w-8 h-8 text-emerald-200 shrink-0" />}
          {statusType === "RESSALVAS" && <AlertTriangle className="w-8 h-8 text-amber-200 shrink-0" />}
          {statusType === "REPROVADO" && <XCircle className="w-8 h-8 text-rose-200 shrink-0" />}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold opacity-90">
                Laudo de Homologação Técnica
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-black/25 backdrop-blur-sm border border-white/20">
                <Award className="w-3 h-3" /> TOTVS Linx Taste One
              </span>
            </div>
            <h3 className="text-lg font-bold">
              {statusType === "APROVADO" && "Ambiente Aprovado para Implantação"}
              {statusType === "RESSALVAS" && "Aprovado com Ressalvas de Infraestrutura"}
              {statusType === "REPROVADO" && "Reprovado - Requisitos Impeditivos Detectados"}
            </h3>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 print:hidden">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-black/20 hover:bg-black/30 border border-white/20 text-white transition"
            title="Copiar relatório em formato Markdown"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copiado!" : "Copiar"}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-black/20 hover:bg-black/30 border border-white/20 text-white transition"
            title="Baixar Laudo Técnico (.txt)"
          >
            <Download className="w-3.5 h-3.5" />
            Salvar
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-black/20 hover:bg-black/30 border border-white/20 text-white transition"
            title="Imprimir laudo de auditoria"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimir
          </button>
        </div>
      </div>

      {/* Critical Alert Notice if Reprovado */}
      {statusType === "REPROVADO" && (
        <div className="bg-rose-50 border-b border-rose-200 px-5 py-3 flex items-start gap-2.5 text-rose-900 text-xs sm:text-sm">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <p>
            <strong>Atenção Franqueadora / Equipe de Implantação:</strong> Este ambiente contém bloqueios de segurança e estabilidade física que violam a documentação da Linx. A implantação do PDV não deve ocorrer até que as correções listadas no item 4 sejam concluídas.
          </p>
        </div>
      )}

      {/* Report Markdown Content */}
      <div className="p-6 text-slate-800 text-sm leading-relaxed prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-h1:text-xl prose-h1:border-b prose-h1:pb-2 prose-h1:mb-4 prose-h3:text-base prose-h3:mt-4 prose-h3:mb-2 prose-ul:my-2 prose-li:my-0.5">
        <Markdown>{content}</Markdown>
      </div>

      {/* Footer stamp */}
      <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
        <span>Auditoria baseada nas especificações oficiais TOTVS Linx Taste/Degust One PDV 2026.</span>
        <span className="font-mono text-[11px] text-slate-400">
          Autenticação Técnica: LINX-VAL-{(Date.now().toString(36)).toUpperCase()}
        </span>
      </div>
    </div>
  );
};
