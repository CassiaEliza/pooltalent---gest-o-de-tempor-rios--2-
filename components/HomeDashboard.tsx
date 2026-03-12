
import React, { useState, useMemo } from 'react';
import { 
  Download, Info, Filter, 
  ArrowUp, ArrowDown, 
  Users, BarChart3, Clock, CheckCircle2, AlertCircle, Package, 
  Star, TrendingUp, Search,
  ExternalLink, ArrowUpDown, Check
} from 'lucide-react';
import { RANKING_ITEMS } from '@/constants';

const MOCK_REQUESTS = [
  { id: '#001', gomap: 'SOL-24.001', title: 'Desenvolvedor Java Pleno', description: 'Atuação no desenvolvimento do back-end do sistema de gestão tributária estadual utilizando Spring Boot e Microservices.', org: 'SUTIC', date: '12/12/2024', start: '15/12/2024', end: '15/06/2025', status: 'Em Andamento', talents: 3 },
  { id: '#002', gomap: 'SOL-24.002', title: 'Analista de Dados Senior', description: 'Criação de dashboards estratégicos para a controladoria geral com foco em otimização de gastos públicos.', org: 'SUPGF', date: '10/12/2024', start: '20/12/2024', end: '20/12/2025', status: 'Pendente Análise', talents: 1 },
  { id: '#003', gomap: 'SOL-24.003', title: 'Especialista DevOps', description: 'Migração de infraestrutura on-premise para nuvem governamental focando em segurança e alta disponibilidade.', org: 'SUTIC', date: '08/12/2024', start: '01/01/2025', end: '01/01/2026', status: 'Em Backlog', talents: 2 },
  { id: '#004', gomap: 'SOL-24.004', title: 'UX/UI Designer Junior', description: 'Modernização da interface do Portal do Cidadão seguindo as novas diretrizes de acessibilidade e usabilidade.', org: 'SUPGI', date: '05/12/2024', start: '10/12/2024', end: '10/06/2025', status: 'Concluídas', talents: 1 },
  { id: '#005', gomap: 'SOL-24.005', title: 'Gerente de Projetos TI', description: 'Gestão de cronogramas e stakeholders da implementação da nova rede estadual de dados.', org: 'SEFAZ', date: '01/12/2024', start: '15/12/2024', end: '15/12/2025', status: 'Em Andamento', talents: 1 },
  { id: '#006', gomap: 'SOL-24.006', title: 'Suporte Nível 2', description: 'Atendimento de chamados técnicos críticos para as setoriais de saúde e educação no interior.', org: 'SUREG', date: '28/11/2024', start: '05/12/2024', end: '05/06/2025', status: 'Concluídas', talents: 4 },
];

interface HomeDashboardProps {
  onNavigateToEvaluations: () => void;
  onNavigateToCompetencies: () => void;
  onNavigateToTalents: () => void;
  onNavigateToRequests: () => void;
}

const CustomCheckbox = ({ checked, onChange }: { checked: boolean; onChange: (e: any) => void }) => (
  <input 
    type="checkbox" 
    checked={checked}
    onChange={onChange}
    className="w-4 h-4 bg-white rounded border border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer appearance-none checked:bg-emerald-600 checked:border-emerald-600 transition-all relative after:content-[''] after:absolute after:hidden after:checked:block after:left-[5px] after:top-[1px] after:w-[4px] after:h-[8px] after:border-white after:border-b-2 after:border-r-2 after:rotate-45" 
  />
);

const StatMiniCard = ({ label, value, trend, trendType, icon: Icon, description }: any) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col h-full cursor-pointer group hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
    <div className="flex justify-between items-start mb-3">
      <div className="p-2 bg-slate-50 rounded-lg text-indigo-600 group-hover:bg-indigo-50 transition-all duration-300">
        <Icon size={18} />
      </div>
      <Info size={14} className="text-slate-200" />
    </div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
    <div className="flex items-baseline gap-2">
      <span className="text-xl font-bold text-slate-800">{value}</span>
      {trend && (
        <span className={`flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded ${
          trendType === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
        }`}>
          {trendType === 'up' ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
          {trend}
        </span>
      )}
    </div>
    <p className="text-[10px] text-slate-400 mt-1">{description}</p>
  </div>
);

const AllocationBar = ({ label, current, total, colorClass, percent }: any) => (
  <div className="group cursor-default">
    <div className="flex justify-between text-xs items-center mb-1.5">
      <span className="font-semibold text-slate-700">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-slate-400 font-medium">{current}/{total}</span>
        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${percent >= 80 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
          {percent}%
        </span>
      </div>
    </div>
    <div className="h-5 w-full bg-slate-100 rounded-lg overflow-hidden flex shadow-inner">
      <div 
        className={`${colorClass} h-full flex items-center justify-center text-[9px] font-bold text-white transition-all duration-1000 ease-out`}
        style={{ width: `${percent}%` }}
      >
        <span>{current} alocados</span>
      </div>
      <div className="flex-1 bg-slate-100 h-full"></div>
    </div>
  </div>
);

const SectorProgressItem = ({ label, description, talents, trend, total, pBacklog, pAndamento, pConcluida }: any) => (
  <div className="space-y-2 group cursor-pointer p-2 -m-2 rounded-xl hover:bg-slate-50 transition-all">
    <div className="flex justify-between items-end">
      <div>
        <h4 className="text-sm font-bold text-slate-800">{label} <span className="text-slate-400 font-normal">- {description}</span></h4>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-[10px] text-slate-400 font-medium">{talents} talentos alocados</span>
          {trend && (
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1 rounded flex items-center gap-0.5">
              <TrendingUp size={10} /> {trend}
            </span>
          )}
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold text-slate-800 leading-none">{total}</p>
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Solicitações</p>
      </div>
    </div>
    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
      <div style={{ width: `${pBacklog}%` }} className="bg-amber-500 h-full" title={`Backlog: ${pBacklog}%`}></div>
      <div style={{ width: `${pAndamento}%` }} className="bg-emerald-500 h-full" title={`Andamento: ${pAndamento}%`}></div>
      <div style={{ width: `${pConcluida}%` }} className="bg-blue-500 h-full" title={`Concluída: ${pConcluida}%`}></div>
    </div>
  </div>
);

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Em Andamento': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
    case 'Pendente Análise': return 'bg-purple-50 text-purple-600 border border-purple-100';
    case 'Em Backlog': return 'bg-amber-50 text-amber-600 border border-amber-100';
    case 'Concluídas': return 'bg-blue-50 text-blue-600 border border-blue-100';
    case 'Reprovadas': return 'bg-rose-50 text-rose-600 border border-rose-100';
    case 'Canceladas': return 'bg-slate-50 text-slate-600 border border-slate-200';
    default: return 'bg-slate-50 text-slate-500 border border-slate-100';
  }
};

const getSlaStatus = (date: string) => {
  // Simple mock logic for SLA
  const day = parseInt(date.split('/')[0]);
  if (day > 10) return { label: 'Atrasado', color: 'text-rose-600 bg-rose-50 border-rose-100', icon: AlertCircle };
  if (day > 5) return { label: 'Atenção', color: 'text-amber-600 bg-amber-50 border-amber-100', icon: Clock };
  return { label: 'No Prazo', color: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: Check };
};

export const HomeDashboard: React.FC<HomeDashboardProps> = ({ onNavigateToEvaluations, onNavigateToCompetencies, onNavigateToTalents, onNavigateToRequests }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [hoveredStatusId, setHoveredStatusId] = useState<string | null>(null);
  
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'date',
    direction: 'desc'
  });

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedRequests = useMemo(() => {
    const data = [...MOCK_REQUESTS].filter(req => 
      req.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      req.org.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.gomap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    data.sort((a: any, b: any) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return data;
  }, [searchTerm, sortConfig]);

  const visibleRequests = useMemo(() => sortedRequests.slice(0, 5), [sortedRequests]);

  const statusData = [
    { id: 'reprovadas', color: '#EF4444', tailwindColor: 'bg-rose-500', label: "Reprovadas", count: 8, percent: "10%" },
    { id: 'backlog', color: '#F59E0B', tailwindColor: 'bg-amber-500', label: "Em Backlog", count: 16, percent: "20%" },
    { id: 'andamento', color: '#10B981', tailwindColor: 'bg-emerald-500', label: "Em Andamento", count: 28, percent: "35%" },
    { id: 'concluidas', color: '#3B82F6', tailwindColor: 'bg-blue-500', label: "Concluídas", count: 16, percent: "20%" },
    { id: 'pendente', color: '#A855F7', tailwindColor: 'bg-purple-500', label: "Pendente Análise", count: 8, percent: "10%" },
    { id: 'canceladas', color: '#6B7280', tailwindColor: 'bg-slate-500', label: "Canceladas", count: 4, percent: "5%" },
  ];

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(visibleRequests.map(req => req.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const SortIcon = ({ colKey }: { colKey: string }) => {
    const isActive = sortConfig.key === colKey;
    if (!isActive) return <ArrowUpDown size={12} className="text-slate-300 ml-1 inline" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp size={12} className="text-blue-600 font-bold ml-1 inline" /> 
      : <ArrowDown size={12} className="text-blue-600 font-bold ml-1 inline" />;
  };

  const isAllSelected = visibleRequests.length > 0 && selectedIds.length === visibleRequests.length;
  const hoveredItem = statusData.find(item => item.id === hoveredStatusId);

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500 pb-16 text-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Executivo</h1>
          <p className="text-slate-500 text-sm">Visão consolidada do Pool de Talentos Temporários</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-100 transition-all active:scale-95">
          <Download size={18} />
          Exportar Relatório
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">Alocação por Competência <Info size={16} className="text-slate-300" /></h3>
              <p className="text-xs text-slate-400 font-medium">Capacidade vs. Ocupação do Pool</p>
            </div>
            <button 
              onClick={onNavigateToTalents}
              className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 transition-all"
              title="Ver Pool de Talentos"
            >
              <ExternalLink size={18} />
            </button>
          </div>
          <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 flex justify-between items-center group cursor-pointer hover:bg-emerald-100/50 transition-colors">
            <div><p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Taxa de Utilização Geral</p><p className="text-3xl font-bold text-slate-800">81%</p></div>
            <div className="text-right"><p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Capacidade Total</p><p className="text-sm font-medium text-slate-600"><span className="text-xl font-bold text-slate-800">62 / 77</span> talentos alocados</p></div>
          </div>
          <div className="space-y-5">
            <AllocationBar label="Desenvolvimento de Sistemas" current={18} total={22} percent={82} colorClass="bg-blue-600" />
            <AllocationBar label="DevOps & Infraestrutura" current={14} total={18} percent={78} colorClass="bg-orange-500" />
            <AllocationBar label="Dados & Analytics" current={12} total={15} percent={80} colorClass="bg-emerald-500" />
            <AllocationBar label="Gestão de Projetos TIC" current={10} total={12} percent={83} colorClass="bg-amber-400" />
            <AllocationBar label="UX/UI Design" current={8} total={10} percent={80} colorClass="bg-purple-500" />
          </div>
          <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400"><div className="w-2 h-2 rounded-full bg-blue-600"></div> Alocado</div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400"><div className="w-2 h-2 rounded-full bg-slate-200"></div> Disponível</div>
            </div>
            <button onClick={onNavigateToCompetencies} className="text-[11px] font-bold text-emerald-600 hover:text-emerald-800 hover:underline transition-colors">Ver todas competências →</button>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col transition-colors">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">Solicitações por Status <Info size={16} className="text-slate-300" /></h3>
              <p className="text-xs text-slate-400 font-medium">Ciclo de vida das demandas</p>
            </div>
            <button 
              onClick={onNavigateToRequests}
              className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 transition-all"
              title="Ver Gestão de Solicitações"
            >
              <ExternalLink size={18} />
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center py-4">
            <div className="relative w-44 h-44 rounded-full flex items-center justify-center shadow-sm" style={{ background: hoveredStatusId ? `conic-gradient(${statusData.map((s, idx, arr) => { const start = arr.slice(0, idx).reduce((acc, curr) => acc + parseInt(curr.percent), 0); const end = start + parseInt(s.percent); return `${s.color}${s.id === hoveredStatusId ? 'FF' : '33'} ${start}% ${end}%`; }).join(', ')})` : 'conic-gradient(#EF4444 0% 10%, #F59E0B 10% 30%, #10B981 30% 65%, #3B82F6 65% 85%, #A855F7 85% 95%, #6B7280 95% 100%)' }}>
              <div className="w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                {hoveredItem ? (<div className="text-center animate-in fade-in zoom-in-95"><span className="text-4xl font-bold" style={{ color: hoveredItem.color }}>{hoveredItem.count}</span><span className="text-[9px] block font-bold text-slate-400 uppercase">{hoveredItem.label}</span></div>) : (<div className="text-center"><span className="text-4xl font-bold text-slate-800">80</span><span className="text-[10px] block font-bold text-slate-400 uppercase">Total Geral</span></div>)}
              </div>
            </div>
          </div>
          <div className="mt-8 space-y-2">
            {statusData.map(item => (<div key={item.id} onMouseEnter={() => setHoveredStatusId(item.id)} onMouseLeave={() => setHoveredStatusId(null)} className={`flex justify-between items-center text-[11px] font-bold p-1.5 px-2 rounded-lg transition-all ${hoveredStatusId && hoveredStatusId !== item.id ? 'opacity-30 scale-95' : 'opacity-100 bg-slate-50 shadow-sm'}`}><div className="flex items-center gap-2"><div className={`w-2.5 h-2.5 rounded-full ${item.tailwindColor}`}></div><span>{item.label}</span></div><div className="flex items-center gap-2"><span className="text-slate-300">{item.count}</span><span className="text-slate-800 w-8 text-right">{item.percent}</span></div></div>))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        <StatMiniCard label="Taxa Utilização" value="84%" trend="5%" trendType="up" icon={BarChart3} description="vs. Mês Anterior" />
        <StatMiniCard label="Tempo Médio" value="4.2 dias" trend="8%" trendType="down" icon={Clock} description="vs. Última Semana" />
        <StatMiniCard label="Prioritários" value="8" icon={CheckCircle2} description="Concluídos este mês" />
        <StatMiniCard label="Urgências" value="3" icon={AlertCircle} description="Vencimento próximo" />
        <StatMiniCard label="Backlog" value="15" trend="20%" trendType="down" icon={Package} description="vs. Mês Anterior" />
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">Setoriais <Info size={16} className="text-slate-300" /></h3>
            <p className="text-xs text-slate-400 font-medium">Desempenho por Órgão Setorial</p>
          </div>
          <button 
            onClick={onNavigateToRequests}
            className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 transition-all"
            title="Ver Detalhamento por Setorial"
          >
            <ExternalLink size={18} />
          </button>
        </div>
        <div className="space-y-8">
          <SectorProgressItem label="SUTIC" description="Superintendência de TIC" talents={12} trend="+2" total={25} pBacklog={15} pAndamento={50} pConcluida={35} />
          <SectorProgressItem label="SUPGF" description="Superintendência de Gestão Fiscal" talents={10} trend="+1" total={18} pBacklog={20} pAndamento={40} pConcluida={40} />
          <SectorProgressItem label="SUPGI" description="Superintendência de Gestão de Inovação" talents={9} total={15} pBacklog={30} pAndamento={40} pConcluida={30} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div><h2 className="text-lg font-bold text-slate-800">Solicitações Recentes</h2><p className="text-xs text-slate-400 font-medium">Visualização rápida das últimas demandas</p></div>
            <div className="flex items-center gap-2">
              <button disabled={selectedIds.length === 0} className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-bold transition-all ${selectedIds.length > 0 ? 'border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm' : 'border-slate-100 text-slate-300 cursor-not-allowed opacity-50'}`}><Download size={14} /> Exportar</button>
              <button disabled={selectedIds.length === 0} className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-bold transition-all ${selectedIds.length > 0 ? 'border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100 shadow-sm' : 'border-slate-100 text-slate-300 cursor-not-allowed opacity-50'}`}><CheckCircle2 size={14} /> Aprovar</button>
              <button disabled={selectedIds.length === 0} className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-bold transition-all ${selectedIds.length > 0 ? 'border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100 shadow-sm' : 'border-slate-100 text-slate-300 cursor-not-allowed opacity-50'}`}><AlertCircle size={14} /> Reprovar</button>
              <button disabled={selectedIds.length === 0} className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-bold transition-all ${selectedIds.length > 0 ? 'border-amber-100 bg-amber-50 text-amber-600 hover:bg-amber-100 shadow-sm' : 'border-slate-100 text-slate-300 cursor-not-allowed opacity-50'}`}><Clock size={14} /> Backlog</button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar por ID, GOMAP, projeto ou órgão..." className="w-full pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 ring-blue-100 font-medium" /></div>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all"><Filter size={16} /> Filtros</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4 w-10 text-center"><CustomCheckbox checked={isAllSelected} onChange={handleSelectAll} /></th>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('id')}>ID / GOMAP <SortIcon colKey="id" /></th>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('title')}>SOLICITAÇÃO <SortIcon colKey="title" /></th>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('org')}>ÓRGÃO <SortIcon colKey="org" /></th>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('date')}>DATA <SortIcon colKey="date" /></th>
                <th className="px-6 py-4 text-center">SLA</th>
                <th className="px-6 py-4 text-center cursor-pointer hover:bg-slate-100" onClick={() => handleSort('talents')}>TALENTOS <SortIcon colKey="talents" /></th>
                <th className="px-6 py-4 text-center">INÍCIO / FIM</th>
                <th className="px-6 py-4 pr-8">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleRequests.map((req) => (
                <tr key={req.id} className={`hover:bg-blue-50/30 transition-all group ${selectedIds.includes(req.id) ? 'bg-blue-50/10' : ''}`}>
                  <td className="px-6 py-4 text-center"><CustomCheckbox checked={selectedIds.includes(req.id)} onChange={() => handleSelectOne(req.id)} /></td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col leading-tight">
                      <span className="text-sm font-black text-blue-900 font-mono tracking-tight">
                        {req.id}
                      </span>
                      <span className="text-[11px] font-bold text-slate-600 font-mono mt-0.5">
                        {req.gomap}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-[320px]">
                    <div className="text-sm font-bold text-slate-800 leading-tight mb-0.5 truncate" title={req.title}>{req.title}</div>
                    <div className="text-[10px] font-medium text-slate-400 line-clamp-1 italic" title={req.description}>{req.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-tight">{req.org}</span></td>
                  <td className="px-6 py-4 text-xs text-slate-600 font-bold whitespace-nowrap">{req.date}</td>
                  <td className="px-6 py-4">
                    {(() => {
                      const sla = getSlaStatus(req.date);
                      const SlaIcon = sla.icon;
                      return (
                        <div className={`flex items-center justify-center gap-1 px-2 py-1 rounded-lg border text-[9px] font-bold whitespace-nowrap ${sla.color}`}>
                          <SlaIcon size={10} />
                          {sla.label}
                        </div>
                      );
                    })()}
                  </td>
                  <td className="px-6 py-4 text-center"><div className="flex items-center justify-center gap-1.5 font-bold text-slate-700"><Users size={14} className="text-slate-400" />{req.talents}</div></td>
                  <td className="px-6 py-4 text-center"><div className="text-[11px] text-slate-600 font-medium">{req.start}<br/><span className="text-slate-300">até</span><br/>{req.end}</div></td>
                  <td className="px-6 py-4 pr-8"><span className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap shadow-sm border ${getStatusColor(req.status)}`}>{req.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-slate-50 flex items-center justify-between bg-slate-50/10"><p className="text-xs text-slate-400 font-medium font-bold uppercase tracking-tight">Exibindo {visibleRequests.length} de {sortedRequests.length} solicitações</p></div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col mt-8">
        <div className="p-6 border-b border-slate-100 flex justify-between items-start">
          <div><h3 className="text-lg font-bold text-slate-800">Ranking de Desempenho</h3><p className="text-xs text-slate-400 mt-1 font-medium italic">Avaliação Trimestral • Out-Dez 2024</p></div>
          <button onClick={onNavigateToEvaluations} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 transition-all"><ExternalLink size={18} /></button>
        </div>
        <div className="px-6 py-6 space-y-6">
          {RANKING_ITEMS.map((item, idx) => (
            <div key={item.id} className="flex items-center gap-4 hover:bg-slate-50 p-2 -m-2 rounded-xl transition-all group">
              <div className="w-8 shrink-0 flex justify-center"><div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-amber-400 text-white shadow-sm' : 'bg-slate-100 text-slate-500'}`}>{idx + 1}</div></div>
              <div className="relative shrink-0"><div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm" style={{ backgroundColor: item.color }}>{item.initials}</div>{idx === 0 && (<div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center text-white"><Star size={10} fill="currentColor" /></div>)}</div>
              <div className="w-48 shrink-0 min-w-0"><div className="flex items-center gap-2 overflow-hidden"><span className="text-sm font-bold text-slate-800 truncate">{item.name}</span><span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{item.dept}</span></div></div>
              <div className="flex-1 flex items-center gap-4"><div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${item.score}%`, backgroundColor: item.color }} /></div><span className="text-[11px] font-bold text-slate-400 w-8 text-right">{item.score}%</span></div>
              <div className="w-20 text-center border-l border-slate-100 pl-4"><p className="text-sm font-bold text-slate-800 leading-tight">{item.projects}</p><p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">projetos</p></div>
              <div className="shrink-0 pl-4"><div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 group-hover:bg-amber-50 group-hover:border-amber-100 transition-colors"><Star size={14} className="text-amber-400 fill-amber-400" /><span className="text-xs font-bold text-slate-800">{item.rating.toFixed(1)}</span></div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
