import React, { useEffect, useState } from "react";
import { BookOpen, RotateCcw, ClipboardEdit, Sparkles, Menu, X } from "lucide-react";
import totvsLogo from "../assets/logo-totvs-branco.svg";
import totvsIcon from "../assets/icon-totvs-branco.svg";

interface HeaderProps {
  onReset: () => void;
  onOpenDoc: () => void;
  onOpenWizard: () => void;
  isAuditing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  onOpenDoc,
  onOpenWizard,
  isAuditing
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  const runMenuAction = (action: () => void) => {
    action();
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <img src={totvsIcon} alt="TOTVS" className="md:hidden w-10 h-10 object-contain" />
          <img src={totvsLogo} alt="TOTVS" className="hidden md:block w-28 lg:w-32 h-auto object-contain" />
          <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white">
                Validador Técnico
              </h1>
                <span className="hidden sm:inline text-xs px-2 py-0.5 rounded-full font-medium bg-cyan-950 text-cyan-300 border border-cyan-800">
                Auditor de Infraestrutura
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Validador Técnico de Hardware e Rede para Franqueadoras e Lojas
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenWizard}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition"
            title="Preencher especificações em formulário assistido"
          >
            <ClipboardEdit className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Formulário Guiado</span>
            <span className="md:hidden">Coleta</span>
          </button>

          <button
            onClick={onOpenDoc}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            title="Consultar requisitos oficiais e homologações Linx"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Manual de Homologação</span>
            <span className="md:hidden">Manual</span>
          </button>

          <button
            onClick={onReset}
            disabled={isAuditing}
            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition disabled:opacity-50"
            title="Reiniciar conversa e iniciar nova auditoria"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden lg:inline">Nova Auditoria</span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300">
            <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span className="text-[11px] text-slate-300">Auditor Ativo</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen(true)}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
          aria-label="Abrir menu de ações"
          aria-expanded={isMenuOpen}
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-[2px]">
          <button
            type="button"
            onClick={() => setIsMenuOpen(false)}
            className="absolute inset-0 w-full cursor-default"
            aria-label="Fechar menu"
          />
          <aside
            className="absolute right-0 top-0 h-full w-[min(86vw,22rem)] bg-slate-900 border-l border-slate-700 shadow-2xl p-5 animate-in slide-in-from-right duration-200"
            aria-label="Menu de ações"
          >
            <div className="flex items-center justify-between pb-5 border-b border-slate-800">
              <div>
                <p className="text-sm font-semibold text-white">Ações da auditoria</p>
                <p className="text-xs text-slate-400 mt-1">Escolha uma opção para continuar</p>
              </div>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                aria-label="Fechar menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-3 pt-5">
              <button
                type="button"
                onClick={() => runMenuAction(onOpenWizard)}
                className="flex items-center gap-3 w-full rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-3 text-left text-sm font-semibold transition"
              >
                <ClipboardEdit className="w-5 h-5" />
                <span>
                  Coleta guiada
                  <small className="block text-xs font-normal text-blue-100 mt-0.5">Preencher especificações passo a passo</small>
                </span>
              </button>

              <button
                type="button"
                onClick={() => runMenuAction(onOpenDoc)}
                className="flex items-center gap-3 w-full rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-3 text-left text-sm font-semibold transition"
              >
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <span>
                  Manual de homologação
                  <small className="block text-xs font-normal text-slate-400 mt-0.5">Consultar requisitos e equipamentos</small>
                </span>
              </button>

              <button
                type="button"
                onClick={() => runMenuAction(onReset)}
                disabled={isAuditing}
                className="flex items-center gap-3 w-full rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-3 text-left text-sm font-semibold text-slate-200 transition disabled:opacity-50"
              >
                <RotateCcw className="w-5 h-5 text-slate-400" />
                <span>
                  Nova auditoria
                  <small className="block text-xs font-normal text-slate-400 mt-0.5">Limpar a conversa atual</small>
                </span>
              </button>
            </nav>
          </aside>
        </div>
      )}
    </header>
  );
};
