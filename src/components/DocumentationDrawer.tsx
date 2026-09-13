import React, { useState } from "react";
import { X, Server, Monitor, Smartphone, Printer, Network, Search, AlertCircle, CheckCircle } from "lucide-react";
import {
  LINX_TAGS_EXPLANATION,
  WINDOWS_SERVER_SPECS,
  WINDOWS_TERMINAL_SPECS,
  ANDROID_GENERAL_SPECS,
  HOMOLOGATED_ANDROID_DEVICES,
  PERIPHERAL_LIST,
  NETWORK_CRITICAL_RULES,
} from "../data/linxSpecs";

interface DocumentationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentationDrawer: React.FC<DocumentationDrawerProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"windows" | "android" | "perifericos" | "rede" | "tags">("windows");
  const [searchFilter, setSearchFilter] = useState("");

  if (!isOpen) return null;

  const filteredAndroid = HOMOLOGATED_ANDROID_DEVICES.filter((d) =>
    d.modelo.toLowerCase().includes(searchFilter.toLowerCase()) ||
    d.categoria.toLowerCase().includes(searchFilter.toLowerCase()) ||
    d.adquirentes.some((a) => a.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  const filteredPeripherals = PERIPHERAL_LIST.filter((p) =>
    p.modelo.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.marca.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.tipo.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div>
            <span className="text-xs uppercase tracking-wider text-cyan-400 font-bold">
              Base de Conhecimento Oficial
            </span>
            <h2 className="text-lg font-bold">Documentação Técnica TOTVS Linx Taste/Degust One PDV</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab("windows")}
            className={`py-3 px-3 border-b-2 whitespace-nowrap flex items-center gap-1.5 transition ${
              activeTab === "windows"
                ? "border-blue-600 text-blue-600 bg-white font-bold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Server className="w-4 h-4" /> Windows (Servidor & Terminais)
          </button>
          <button
            onClick={() => setActiveTab("android")}
            className={`py-3 px-3 border-b-2 whitespace-nowrap flex items-center gap-1.5 transition ${
              activeTab === "android"
                ? "border-blue-600 text-blue-600 bg-white font-bold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Smartphone className="w-4 h-4" /> Dispositivos Android
          </button>
          <button
            onClick={() => setActiveTab("perifericos")}
            className={`py-3 px-3 border-b-2 whitespace-nowrap flex items-center gap-1.5 transition ${
              activeTab === "perifericos"
                ? "border-blue-600 text-blue-600 bg-white font-bold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Printer className="w-4 h-4" /> Periféricos & Balanças
          </button>
          <button
            onClick={() => setActiveTab("rede")}
            className={`py-3 px-3 border-b-2 whitespace-nowrap flex items-center gap-1.5 transition ${
              activeTab === "rede"
                ? "border-blue-600 text-blue-600 bg-white font-bold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Network className="w-4 h-4" /> Regras de Rede & Fiscal
          </button>
          <button
            onClick={() => setActiveTab("tags")}
            className={`py-3 px-3 border-b-2 whitespace-nowrap flex items-center gap-1.5 transition ${
              activeTab === "tags"
                ? "border-blue-600 text-blue-600 bg-white font-bold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Legenda TAGs
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5 text-sm space-y-6">
          {/* TAB: WINDOWS */}
          {activeTab === "windows" && (
            <div className="space-y-6">
              {/* Servidores */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                  <Server className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-base">Requisitos para Servidores Windows</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Mínimo */}
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="inline-block px-2 py-0.5 text-xs font-bold rounded bg-blue-100 text-blue-800 mb-2">
                      MÍNIMO OBRIGATÓRIO (Máquina única Servidor/Terminal)
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      <li><strong>S.O.:</strong> {WINDOWS_SERVER_SPECS.minimo.so}</li>
                      <li><strong>Processador:</strong> {WINDOWS_SERVER_SPECS.minimo.cpu}</li>
                      <li><strong>Memória RAM:</strong> {WINDOWS_SERVER_SPECS.minimo.ram}</li>
                      <li><strong>Armazenamento:</strong> {WINDOWS_SERVER_SPECS.minimo.armazenamento}</li>
                      <li><strong>Conectividade:</strong> {WINDOWS_SERVER_SPECS.minimo.rede}</li>
                    </ul>
                    <p className="mt-2 text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200">
                      ⚠️ <em>{WINDOWS_SERVER_SPECS.minimo.obs}</em>
                    </p>
                  </div>

                  {/* Recomendado */}
                  <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200">
                    <span className="inline-block px-2 py-0.5 text-xs font-bold rounded bg-emerald-100 text-emerald-800 mb-2">
                      RECOMENDADO (Ambientes com múltiplos caixas)
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      <li><strong>S.O.:</strong> {WINDOWS_SERVER_SPECS.recomendado.so}</li>
                      <li><strong>Processador:</strong> {WINDOWS_SERVER_SPECS.recomendado.cpu}</li>
                      <li><strong>Memória RAM:</strong> {WINDOWS_SERVER_SPECS.recomendado.ram}</li>
                      <li><strong>Armazenamento:</strong> {WINDOWS_SERVER_SPECS.recomendado.armazenamento}</li>
                      <li><strong>Conectividade:</strong> {WINDOWS_SERVER_SPECS.recomendado.rede}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Terminais */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                  <Monitor className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-900 text-base">Requisitos para Terminais Windows (Caixas)</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Mínimo */}
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="inline-block px-2 py-0.5 text-xs font-bold rounded bg-slate-200 text-slate-800 mb-2">
                      MÍNIMO OBRIGATÓRIO
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      <li><strong>S.O.:</strong> {WINDOWS_TERMINAL_SPECS.minimo.so}</li>
                      <li><strong>Processador:</strong> {WINDOWS_TERMINAL_SPECS.minimo.cpu}</li>
                      <li><strong>Memória RAM:</strong> {WINDOWS_TERMINAL_SPECS.minimo.ram}</li>
                      <li><strong>Armazenamento:</strong> {WINDOWS_TERMINAL_SPECS.minimo.armazenamento}</li>
                      <li><strong>Conectividade:</strong> {WINDOWS_TERMINAL_SPECS.minimo.rede}</li>
                      <li><strong>Monitor:</strong> {WINDOWS_TERMINAL_SPECS.minimo.monitor}</li>
                    </ul>
                  </div>

                  {/* Recomendado */}
                  <div className="p-3.5 rounded-lg bg-indigo-50/70 border border-indigo-200">
                    <span className="inline-block px-2 py-0.5 text-xs font-bold rounded bg-indigo-100 text-indigo-800 mb-2">
                      RECOMENDADO
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      <li><strong>S.O.:</strong> {WINDOWS_TERMINAL_SPECS.recomendado.so}</li>
                      <li><strong>Processador:</strong> {WINDOWS_TERMINAL_SPECS.recomendado.cpu}</li>
                      <li><strong>Memória RAM:</strong> {WINDOWS_TERMINAL_SPECS.recomendado.ram}</li>
                      <li><strong>Armazenamento:</strong> {WINDOWS_TERMINAL_SPECS.recomendado.armazenamento}</li>
                      <li><strong>Conectividade:</strong> {WINDOWS_TERMINAL_SPECS.recomendado.rede}</li>
                      <li><strong>Monitor:</strong> {WINDOWS_TERMINAL_SPECS.recomendado.monitor}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ANDROID */}
          {activeTab === "android" && (
            <div className="space-y-4">
              {/* Guidelines */}
              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-bold text-blue-900 mb-1">Requisitos SmartPOS Mobile</h4>
                  <p>Android 7.1.1+, Quad-Core 1.8GHz+, 2GB RAM+, 8GB Armazenamento.</p>
                </div>
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-bold text-purple-900 mb-1">Requisitos PDV Desktop & Autoatendimento</h4>
                  <p>Android 9+, Octa-Core 2.0GHz+, 4GB RAM+, 16GB Armazenamento.</p>
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filtrar por modelo, categoria ou adquirente..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Devices Table / List */}
              <div className="space-y-2.5">
                {filteredAndroid.map((dev, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{dev.modelo}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {dev.categoria}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                          Fluxo: {dev.fluxo}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          dev.status === "DISPONÍVEL"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                            : "bg-blue-100 text-blue-800 border-blue-300"
                        }`}
                      >
                        {dev.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1">
                      <p>
                        <strong>Adquirentes / Ofertas:</strong>{" "}
                        {dev.adquirentes.join(", ")}
                      </p>
                      <p>
                        <strong>Impressora:</strong> {dev.impressora}
                      </p>
                      <p className="text-slate-500 italic">{dev.observacoes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PERIFÉRICOS */}
          {activeTab === "perifericos" && (
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar impressora, pinpad, balança ou SAT/MFE..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Fiscal Normative Warning */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                <strong>⚠️ Normativas Fiscais Importantes:</strong>
                <p className="mt-1">
                  São Paulo (Portaria SRE 79/2024) e Ceará (Decreto 36.417/2025) oficializaram a descontinuação e proibição de emissão via SAT e MFE a partir de <strong>01/01/2026</strong>, tornando obrigatória a emissão de <strong>NFC-e</strong>.
                </p>
              </div>

              <div className="grid gap-2 text-xs">
                {filteredPeripherals.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-slate-200 bg-white flex flex-wrap items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">
                          {item.marca} {item.modelo}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {item.tipo}
                        </span>
                      </div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        Conexão: <strong>{item.conexao}</strong> {item.obs && `• ${item.obs}`}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        item.status === "DISPONÍVEL"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : item.status === "BACKLOG"
                          ? "bg-orange-100 text-orange-800 border-orange-300"
                          : "bg-blue-100 text-blue-800 border-blue-300"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: REDE */}
          {activeTab === "rede" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 text-white">
                <h3 className="font-bold text-base text-cyan-400 mb-1">
                  Diretrizes Mandatórias de Conectividade Linx
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  O ecossistema Linx Taste One PDV trafega transações financeiras críticas (TEF), comunicações com a SEFAZ (NFC-e/SAT) e pedidos em tempo real. A infraestrutura física de rede é determinante para o funcionamento sem quedas.
                </p>
              </div>

              <div className="space-y-3">
                {NETWORK_CRITICAL_RULES.map((rule, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-lg border text-xs leading-relaxed ${
                      rule.tipo === "IMPEDITIVO"
                        ? "bg-rose-50/70 border-rose-200 text-rose-900"
                        : rule.tipo === "OBRIGATÓRIO"
                        ? "bg-amber-50/70 border-amber-200 text-amber-900"
                        : "bg-blue-50/70 border-blue-200 text-blue-900"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm">{rule.regra}</span>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          rule.tipo === "IMPEDITIVO"
                            ? "bg-rose-200 text-rose-900"
                            : rule.tipo === "OBRIGATÓRIO"
                            ? "bg-amber-200 text-amber-900"
                            : "bg-blue-200 text-blue-900"
                        }`}
                      >
                        {rule.tipo}
                      </span>
                    </div>
                    <p>{rule.descricao}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: TAGS */}
          {activeTab === "tags" && (
            <div className="space-y-3 text-xs">
              <p className="text-slate-600 mb-2">
                Significado oficial das TAGs de homologação utilizadas pela Linx/Totvs:
              </p>
              {LINX_TAGS_EXPLANATION.map((t, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-white">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${t.color}`}>
                      {t.tag}
                    </span>
                  </div>
                  <p className="text-slate-700">{t.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition"
          >
            Fechar Manual
          </button>
        </div>
      </div>
    </div>
  );
};
