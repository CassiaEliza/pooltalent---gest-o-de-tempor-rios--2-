
import React from 'react';
import { Bell, ChevronRight, Home } from 'lucide-react';

interface HeaderProps {
  activeTab: 'home' | 'evaluations' | 'talents' | 'requests' | 'competencies' | 'settings';
  onNavigate: (tab: 'home' | 'evaluations' | 'talents' | 'requests' | 'competencies' | 'settings') => void;
  isProfile?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onNavigate, isProfile }) => {
  const titles = {
    home: { main: "Página Inicial", sub: "Visão Geral" },
    evaluations: { main: "Avaliações de Desempenho", sub: "Gestão de Performance" },
    talents: { main: "Profissionais do Pool de Talentos", sub: "Lista de Profissionais" },
    requests: { main: "Solicitações", sub: "Gerenciamento de Projetos" },
    competencies: { main: "Mapa de Competências", sub: "Detalhamento Técnico" },
    settings: { main: "Configurações", sub: "Preferências do Sistema" }
  };

  const currentMainTitle = isProfile ? "Perfil do Talento" : titles[activeTab].main;

  return (
    <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm shrink-0">
      <div className="flex flex-col">
        <h2 className="text-xl font-bold text-slate-800">
          {currentMainTitle}
        </h2>
        <div className="flex items-center text-xs text-slate-400 gap-2 mt-1">
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1 hover:text-emerald-600 transition-colors"
          >
            <Home size={12} />
            <span>Início</span>
          </button>
          
          {activeTab !== 'home' && (
            <>
              <ChevronRight size={12} className="text-slate-300" />
              <button 
                onClick={() => onNavigate(activeTab)}
                className={`hover:text-emerald-600 transition-colors ${!isProfile ? 'text-slate-600 font-medium cursor-default' : ''}`}
                disabled={!isProfile && activeTab !== 'competencies' && activeTab !== 'settings'}
              >
                {titles[activeTab].main}
              </button>
            </>
          )}

          {isProfile && activeTab === 'talents' && (
            <>
              <ChevronRight size={12} className="text-slate-300" />
              <span className="text-slate-600 font-medium">Perfil do Talento</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
          <Bell size={22} />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            5
          </span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800">Maria Silva</p>
          </div>
          <div className="w-10 h-10 bg-[#1e40af] text-white rounded-full flex items-center justify-center font-bold text-sm ring-4 ring-blue-50">
            MS
          </div>
        </div>
      </div>
    </header>
  );
};
