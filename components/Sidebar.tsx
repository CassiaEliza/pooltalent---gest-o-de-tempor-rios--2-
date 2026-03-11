
import React from 'react';
import { Home, ClipboardList, Users, TrendingUp, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
  activeTab: 'home' | 'evaluations' | 'talents' | 'requests' | 'competencies' | 'settings';
  onNavigate: (tab: 'home' | 'evaluations' | 'talents' | 'requests' | 'competencies' | 'settings') => void;
}

const NavItem = ({ 
  icon: Icon, 
  label, 
  active = false, 
  onClick 
}: { 
  icon: any, 
  label: string, 
  active?: boolean, 
  onClick: () => void
}) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200 rounded-xl group mb-1 ${
      active 
        ? 'bg-[#22c55e] text-white shadow-lg shadow-emerald-900/20' 
        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
    }`}
  >
    <Icon size={20} className={active ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
    <span className="font-medium text-sm">{label}</span>
  </div>
);

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onNavigate }) => {
  return (
    <aside className="w-64 bg-[#064e3b] h-screen flex flex-col shrink-0 text-white border-r border-slate-700/50 sticky top-0 overflow-y-auto transition-all custom-scrollbar">
      <div className="p-6 mb-8">
        <h1 className="text-xl font-extrabold leading-tight tracking-tight text-emerald-50">
          Gestão do Pool de <br /> Talentos de TI
        </h1>
      </div>

      <nav className="flex-1 px-4">
        <NavItem 
          icon={Home} 
          label="Página Inicial" 
          active={activeTab === 'home'} 
          onClick={() => onNavigate('home')}
        />
        
        <NavItem 
          icon={ClipboardList} 
          label="Solicitações" 
          active={activeTab === 'requests'}
          onClick={() => onNavigate('requests')}
        />

        <NavItem 
          icon={Users} 
          label="Pool de Talentos" 
          active={activeTab === 'talents'} 
          onClick={() => onNavigate('talents')}
        />

        <NavItem 
          icon={TrendingUp} 
          label="Gestão de Performance" 
          active={activeTab === 'evaluations'} 
          onClick={() => onNavigate('evaluations')}
        />
      </nav>

      <div className="p-4 border-t border-emerald-900/50 space-y-1">
        <NavItem 
          icon={Settings} 
          label="Configurações" 
          active={activeTab === 'settings'}
          onClick={() => onNavigate('settings')} 
        />
        <NavItem icon={LogOut} label="Sair" onClick={() => {}} />
      </div>
    </aside>
  );
};
