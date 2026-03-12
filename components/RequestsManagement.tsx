
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Download, Plus, Search, Filter, Eye, Edit3, Check, X, 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ClipboardList, Clock, Package, AlertTriangle, Users, Calendar,
  TrendingUp, Info, ArrowUpDown, ArrowUp, ArrowDown, ExternalLink,
  MapPin, Briefcase, FileText, Timer, AlertCircle
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { RequestItem } from '@/types';
import { NewRequestForm } from './NewRequestForm';
import { SectorDetailsView } from './SectorDetailsView';
import { ViewRequestDetail } from './ViewRequestDetail';

const MOCK_REQUESTS: RequestItem[] = [
  { 
    id: '#001',
    gomap: 'SOL-24.001', 
    project: 'Modernização Sistema Tributário Estadual de Alta Complexidade', 
    description: 'Desenvolvimento de módulo de análise fiscal automatizada com integração de APIs fazendárias e processamento em lote.', 
    org: 'SEFAZ', 
    skills: ['Python', 'SQL'], 
    qty: 2, 
    requestDate: '10/01/2024',
    startDate: '14/03/2024',
    endDate: '14/09/2024',
    hasMultiplePeriods: true,
    classification: 'Normal', 
    status: 'Em Andamento',
    type: 'Projeto',
    supportType: ['Apoio para projeto de Dados']
  },
  { 
    id: '#002',
    gomap: 'SOL-24.002', 
    project: 'Portal do Cidadão v2.0', 
    description: 'Redesign completo do portal de serviços digitais focando em acessibilidade e experiência mobile-first.', 
    org: 'SGD', 
    skills: ['React', 'Node.js'], 
    qty: 3, 
    requestDate: '15/01/2024',
    startDate: '31/03/2024',
    endDate: '31/12/2024',
    classification: 'Prioridade Governamental', 
    status: 'Em Backlog',
    type: 'Projeto',
    supportType: ['Apoio para Transformação Digital']
  },
  { 
    id: '#003',
    gomap: 'SOL-24.003', 
    project: 'Gestão Ambiental Digital e Monitoramento Remoto', 
    description: 'Sistema de monitoramento ambiental integrado com satélite e georreferenciamento de áreas protegidas.', 
    org: 'SEMAD', 
    skills: ['GIS', 'Python'], 
    qty: 1, 
    requestDate: '20/01/2024',
    startDate: '19/05/2024',
    endDate: '19/11/2024',
    classification: 'Normal', 
    status: 'Pendente Análise',
    type: 'Projeto',
    supportType: ['Apoio para projeto de Dados']
  },
  { 
    id: '#004',
    gomap: 'SOL-24.004', 
    project: 'Sistema de Saúde Integrado Estadual', 
    description: 'Integração de sistemas hospitalares e prontuário eletrônico unificado para toda a rede pública.', 
    org: 'SES', 
    skills: ['Java', 'Spring Boot'], 
    qty: 4, 
    requestDate: '02/02/2024',
    startDate: '27/02/2024',
    endDate: '27/08/2024',
    hasMultiplePeriods: true,
    classification: 'Normal', 
    status: 'Em Backlog',
    type: 'Operação',
    supportType: ['Apoio para Atendimento ao Usuário']
  },
  { 
    id: '#005',
    gomap: 'SOL-24.005', 
    project: 'Educação Online e Gestão Escolar 2025', 
    description: 'Plataforma de ensino à distância e gestão escolar para rede estadual de ensino médio.', 
    org: 'SEDUC', 
    skills: ['React', 'TypeScript'], 
    qty: 2, 
    requestDate: '10/02/2024',
    startDate: '31/05/2024',
    endDate: '31/12/2024',
    classification: 'Prioridade Governamental', 
    status: 'Reprovadas',
    type: 'Projeto',
    supportType: ['Apoio para Transformação Digital']
  },
  { 
    id: '#006',
    gomap: 'SOL-24.006', 
    project: 'Segurança Pública Digital e IA Forense', 
    description: 'Sistema de análise de imagens e reconhecimento facial para identificação em tempo real.', 
    org: 'SSP', 
    skills: ['Python', 'Computer Vision'], 
    qty: 3, 
    requestDate: '12/02/2024',
    startDate: '29/03/2024',
    endDate: '29/09/2024',
    classification: 'Normal', 
    status: 'Em Andamento',
    type: 'Operação',
    supportType: ['Apoio para Atendimento ao Usuário']
  },
];

const MOCK_SECTORS = [
  { label: "SUTIC", description: "Superintendência de TIC", talents: 12, trend: "+2", total: 25, pBacklog: 15, pAndamento: 50, pConcluida: 35 },
  { label: "SUPGF", description: "Gestão Fiscal", talents: 10, trend: "+1", total: 18, pBacklog: 20, pAndamento: 40, pConcluida: 40 },
  { label: "SUPGI", description: "Gestão de Inovação", talents: 9, total: 15, pBacklog: 30, pAndamento: 40, pConcluida: 30 },
  { label: "SEFAZ", description: "Fazenda Estadual", talents: 8, trend: "+3", total: 12, pBacklog: 10, pAndamento: 60, pConcluida: 30 },
  { label: "SEAD", description: "Administração", talents: 15, trend: "+4", total: 32, pBacklog: 25, pAndamento: 45, pConcluida: 30 },
  { label: "SEDUC", description: "Educação", talents: 22, trend: "+5", total: 48, pBacklog: 40, pAndamento: 30, pConcluida: 30 },
  { label: "SES", description: "Saúde", talents: 18, trend: "+2", total: 40, pBacklog: 35, pAndamento: 35, pConcluida: 30 },
  { label: "SEMAD", description: "Meio Ambiente", talents: 6, trend: "+1", total: 10, pBacklog: 20, pAndamento: 50, pConcluida: 30 },
];

const STATUS_CHART_DATA = [
  { name: 'Reprovadas', value: 8, color: '#EF4444' },
  { name: 'Em Backlog', value: 16, color: '#F59E0B' },
  { name: 'Em Andamento', value: 28, color: '#10B981' },
  { name: 'Concluídas', value: 16, color: '#3B82F6' },
  { name: 'Pendente Análise', value: 8, color: '#A855F7' },
  { name: 'Canceladas', value: 4, color: '#6B7280' },
];

const CLASS_CHART_DATA = [
  { name: 'Prioridade Governamental', value: 4, color: '#f97316' },
  { name: 'Normal', value: 8, color: '#3b82f6' },
];

const STATUS_COLORS: Record<string, string> = {
  'Reprovadas': 'bg-rose-50 text-rose-600 border-rose-100',
  'Em Backlog': 'bg-amber-50 text-amber-600 border-amber-100',
  'Em Andamento': 'bg-emerald-50 text-emerald-600 border-emerald-100',
  'Concluídas': 'bg-blue-50 text-blue-600 border-blue-100',
  'Pendente Análise': 'bg-purple-50 text-purple-600 border-purple-100',
  'Canceladas': 'bg-slate-50 text-slate-600 border-slate-200',
};

const CLASSIFICATION_COLORS: Record<string, string> = {
  'Prioridade Governamental': 'bg-orange-50 text-orange-600 border-orange-100',
  'Normal': 'bg-blue-50 text-blue-600 border-blue-100',
};

const CustomCheckbox = ({ checked, onChange }: { checked: boolean; onChange: (e: any) => void }) => (
  <input 
    type="checkbox" 
    checked={checked}
    onChange={(e) => {
      e.stopPropagation();
      onChange(e);
    }}
    className="w-4 h-4 bg-white rounded border border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer appearance-none checked:bg-emerald-600 checked:border-emerald-600 transition-all relative after:content-[''] after:absolute after:hidden after:checked:block after:left-[5px] after:top-[1px] after:w-[4px] after:h-[8px] after:border-white after:border-b-2 after:border-r-2 after:rotate-45" 
  />
);

const MultiplePeriodsIndicator = () => (
  <span 
    className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-black cursor-help transition-colors hover:bg-blue-100" 
    title="Existem múltiplos prazos para os profissionais desta solicitação"
  >
    +
  </span>
);

const SectorProgressItem = ({ label, description, talents, trend, total, pBacklog, pAndamento, pConcluida }: any) => (
  <div className="space-y-2 group cursor-pointer p-3 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
    <div className="flex justify-between items-end">
      <div>
        <h4 className="text-sm font-bold text-slate-800">{label} <span className="text-slate-400 font-normal truncate max-w-[120px] inline-block align-bottom">- {description}</span></h4>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-[10px] text-slate-400 font-medium">{talents} talentos alocados</span>
          {trend && (
            <span className={`text-[10px] font-bold px-1 rounded flex items-center gap-0.5 ${trend.startsWith('+') ? 'text-emerald-500 bg-emerald-50' : 'text-rose-500 bg-rose-50'}`}>
              <TrendingUp size={10} className={trend.startsWith('-') ? 'rotate-180' : ''} /> {trend}
            </span>
          )}
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="text-lg font-bold text-slate-800 leading-none">{total}</p>
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Solicitações</p>
      </div>
    </div>
    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
      <div style={{ width: `${pBacklog}%` }} className="bg-amber-500 h-full transition-all duration-500" title={`Backlog: ${pBacklog}%`}></div>
      <div style={{ width: `${pAndamento}%` }} className="bg-emerald-500 h-full transition-all duration-500" title={`Andamento: ${pAndamento}%`}></div>
      <div style={{ width: `${pConcluida}%` }} className="bg-blue-500 h-full transition-all duration-500" title={`Concluída: ${pConcluida}%`}></div>
    </div>
  </div>
);

const getSlaStatus = (requestDate: string, classification: string) => {
  // Mock logic for SLA status
  // In a real app, this would compare requestDate + SLA(priority) with current date
  const day = parseInt(requestDate.split('/')[0]);
  
  if (day > 15) return { label: 'Atrasado', color: 'text-rose-600 bg-rose-50 border-rose-100', icon: AlertCircle };
  if (day > 10) return { label: 'Atenção', color: 'text-amber-600 bg-amber-50 border-amber-100', icon: Clock };
  return { label: 'No Prazo', color: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: Check };
};

export const RequestsManagement: React.FC = () => {
  const [requests, setRequests] = useState<RequestItem[]>(MOCK_REQUESTS);
  const [activeView, setActiveView] = useState<'list' | 'create' | 'sectors' | 'view_detail'>('list');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeView]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'requestDate',
    direction: 'desc'
  });
  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);

  const sortedAndFilteredRequests = useMemo(() => {
    let data = requests.filter(req => 
      req.project.toLowerCase().includes(searchTerm.toLowerCase()) || 
      req.org.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.gomap.toLowerCase().includes(searchTerm.toLowerCase())
    );

    data.sort((a: any, b: any) => {
      const valA = a[sortConfig.key as keyof RequestItem];
      const valB = b[sortConfig.key as keyof RequestItem];
      if (valA === undefined || valB === undefined) return 0;
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return data;
  }, [searchTerm, sortConfig]);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRequests = sortedAndFilteredRequests.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(sortedAndFilteredRequests.length / pageSize);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(sortedAndFilteredRequests.map(req => req.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleRowClick = (req: RequestItem) => {
    setSelectedRequest(req);
    setActiveView('view_detail');
  };

  const SortIcon = ({ colKey }: { colKey: string }) => {
    const isActive = sortConfig.key === colKey;
    if (!isActive) return <ArrowUpDown size={12} className="text-slate-300 ml-1 inline" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp size={12} className="text-blue-600 font-bold ml-1 inline" /> 
      : <ArrowDown size={12} className="text-blue-600 font-bold ml-1 inline" />;
  };

  if (activeView === 'create') {
    return <NewRequestForm onBack={() => setActiveView('list')} />;
  }

  if (activeView === 'sectors') {
    return <SectorDetailsView onBack={() => setActiveView('list')} />;
  }

  if (activeView === 'view_detail' && selectedRequest) {
    return (
      <ViewRequestDetail 
        request={selectedRequest} 
        onBack={() => setActiveView('list')} 
        onSave={(updatedRequest) => {
          setRequests(prev => prev.map(req => req.id === updatedRequest.id ? updatedRequest : req));
          setSelectedRequest(updatedRequest);
        }}
      />
    );
  }

  const isAllSelected = sortedAndFilteredRequests.length > 0 && selectedIds.length === sortedAndFilteredRequests.length;

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full space-y-8 animate-in fade-in duration-500 pb-16">
      {/* Header e Métricas */}
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gerenciamento de Solicitações</h1>
            <p className="text-slate-500 text-sm">Controle de fluxos, aprovações e alocação de novas demandas</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <Download size={16} className="text-blue-600" /> Exportar Dashboard
            </button>
            <button 
              onClick={() => setActiveView('create')}
              className="flex items-center gap-2 px-4 py-2 bg-[#1e40af] text-white rounded-xl text-sm font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-100"
            >
              <Plus size={16} /> Nova Solicitação
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-blue-200 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ClipboardList size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Total de Solicitações</p>
              <p className="text-2xl font-black text-slate-800">80</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-emerald-200 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Em Andamento</p>
              <p className="text-2xl font-black text-slate-800">28</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-slate-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center shrink-0">
              <Package size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Em Backlog</p>
              <p className="text-2xl font-black text-slate-800">16</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-amber-200 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">SLA em Atenção</p>
              <p className="text-2xl font-black text-slate-800">5</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-indigo-200 transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Timer size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Tempo Médio</p>
              <p className="text-2xl font-black text-slate-800">14 dias</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos em linha dedicada */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
          <div className="w-full mb-6 flex justify-between items-start">
            <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">Por Status <Info size={14} className="text-slate-300" /></h4>
          </div>
          <div className="w-48 h-48 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={STATUS_CHART_DATA}
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {STATUS_CHART_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2 w-full pt-4 border-t border-slate-50">
            {STATUS_CHART_DATA.map((item) => (
              <div key={item.name} className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                  <span className="truncate">{item.name}</span>
                </div>
                <span className="text-sm font-black text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
          <div className="w-full mb-6 flex justify-between items-start">
            <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">Por Classificação <Info size={14} className="text-slate-300" /></h4>
          </div>
          <div className="w-48 h-48 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CLASS_CHART_DATA}
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CLASS_CHART_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4 w-full pt-4 border-t border-slate-50">
            {CLASS_CHART_DATA.map((item) => (
              <div key={item.name} className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="truncate text-center">{item.name}</span>
                </div>
                <span className="text-sm font-black text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Linha Dedicada para Setoriais Contempladas */}
      <div className="w-full">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wider">Setoriais Contempladas</h3>
              <p className="text-[10px] text-slate-400 font-medium">Análise de atendimento e performance por órgão solicitante</p>
            </div>
            <button 
              onClick={() => setActiveView('sectors')}
              className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 transition-all"
              title="Ver Detalhamento por Setorial"
            >
              <ExternalLink size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {MOCK_SECTORS.map((sector, idx) => (
              <SectorProgressItem key={idx} {...sector} />
            ))}
          </div>
        </div>
      </div>

      {/* Tabela de Solicitações */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">Lista Geral de Solicitações</h3>
              <p className="text-xs text-slate-400 font-medium">Filtragem e ações em massa sobre demandas ativas</p>
            </div>
            <div className="flex items-center gap-2">
              <button disabled={selectedIds.length === 0} className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-bold transition-all ${selectedIds.length > 0 ? 'border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm' : 'border-slate-100 text-slate-300 cursor-not-allowed opacity-50'}`}><Download size={14} /> Exportar</button>
              <button disabled={selectedIds.length === 0} className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-bold transition-all ${selectedIds.length > 0 ? 'border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100 shadow-sm' : 'border-slate-100 text-slate-300 cursor-not-allowed opacity-50'}`}><Check size={14} /> Aprovar</button>
              <button disabled={selectedIds.length === 0} className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-bold transition-all ${selectedIds.length > 0 ? 'border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100 shadow-sm' : 'border-slate-100 text-slate-300 cursor-not-allowed opacity-50'}`}><X size={14} /> Reprovar</button>
              <button disabled={selectedIds.length === 0} className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-bold transition-all ${selectedIds.length > 0 ? 'border-amber-100 bg-amber-50 text-amber-600 hover:bg-amber-100 shadow-sm' : 'border-slate-100 text-slate-300 cursor-not-allowed opacity-50'}`}><Clock size={14} /> Backlog</button>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                placeholder="Buscar por projeto, órgão ou ID..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 ring-blue-50 transition-all font-medium text-slate-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <select className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 outline-none focus:ring-2 ring-blue-50 cursor-pointer">
                <option>Todos os Status</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2.5 border border-emerald-200 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-50 transition-all">
                <Filter size={16} /> Filtros Avançados
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] border-b border-slate-100">
              <tr>
                <th className="px-4 py-4 w-10 text-center"><CustomCheckbox checked={isAllSelected} onChange={handleSelectAll} /></th>
                <th className="px-2 py-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('id')}>ID / GOMAP <SortIcon colKey="id" /></th>
                <th className="px-4 py-6 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('project')}>SOLICITAÇÃO & ÓRGÃO <SortIcon colKey="project" /></th>
                <th className="px-2 py-6 text-center cursor-pointer hover:bg-slate-100" onClick={() => handleSort('qty')}>QTD. <SortIcon colKey="qty" /></th>
                <th className="px-2 py-6">CLASSIFICAÇÃO</th>
                <th className="px-2 py-6 text-center">SLA</th>
                <th className="px-2 py-6 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('requestDate')}>SOLICITAÇÃO <SortIcon colKey="requestDate" /></th>
                <th className="px-4 py-6 text-center">INÍCIO / FIM</th>
                <th className="px-4 py-6 pr-8">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedRequests.map((req) => (
                <tr 
                  key={req.id} 
                  onClick={() => handleRowClick(req)}
                  className={`cursor-pointer hover:bg-blue-50/30 transition-colors group ${selectedIds.includes(req.id) ? 'bg-blue-50/10' : ''}`}
                >
                  <td className="px-4 py-4 text-center">
                    <CustomCheckbox checked={selectedIds.includes(req.id)} onChange={() => handleSelectOne(req.id)} />
                  </td>
                  <td className="px-2 py-4">
                    <div className="flex flex-col leading-tight">
                      <span className="text-sm font-black text-blue-900 font-mono tracking-tight">
                        {req.id}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 font-mono mt-0.5">
                        {req.gomap}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-5 max-w-[400px]">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-800 leading-tight truncate" title={req.project}>{req.project}</span>
                        <span className="shrink-0 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[9px] font-black uppercase tracking-tight">
                          {req.org}
                        </span>
                      </div>
                      <div className="text-[10px] font-medium text-slate-400 line-clamp-1 italic" title={req.description}>{req.description}</div>
                    </div>
                  </td>
                  <td className="px-2 py-5">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-600">
                      <Users size={12} className="text-slate-300" />
                      {req.qty}
                    </div>
                  </td>
                  <td className="px-2 py-5">
                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tight border ${CLASSIFICATION_COLORS[req.classification]}`}>
                      {req.classification}
                    </span>
                  </td>
                  <td className="px-2 py-5">
                    {(() => {
                      const sla = getSlaStatus(req.requestDate, req.classification);
                      const SlaIcon = sla.icon;
                      return (
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[9px] font-bold whitespace-nowrap ${sla.color}`}>
                          <SlaIcon size={10} />
                          {sla.label}
                        </div>
                      );
                    })()}
                  </td>
                  <td className="px-2 py-5 text-[11px] text-slate-500 font-bold whitespace-nowrap">{req.requestDate}</td>
                  <td className="px-4 py-5">
                    <div className="flex flex-col items-center justify-center text-[10px] font-medium text-slate-600">
                      <div className="flex items-center gap-1">
                        {req.startDate} {req.hasMultiplePeriods && <MultiplePeriodsIndicator />}
                      </div>
                      <span className="text-[8px] text-slate-300 my-0.5 uppercase font-bold">até</span>
                      <div className="flex items-center gap-1">
                        {req.endDate} {req.hasMultiplePeriods && <MultiplePeriodsIndicator />}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-5 pr-8">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap ${STATUS_COLORS[req.status]}`}>
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="px-8 py-6 border-t border-slate-50 bg-slate-50/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-400">Itens por página:</span>
              <select 
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-600 outline-none focus:ring-2 ring-blue-50 transition-all cursor-pointer"
              >
                <option value={6}>6</option>
                <option value={12}>12</option>
              </select>
            </div>
            <span className="text-xs font-medium text-slate-400">
              Mostrando {startIndex + 1} a {Math.min(startIndex + pageSize, sortedAndFilteredRequests.length)} de {sortedAndFilteredRequests.length} resultados
            </span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
              className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-white transition-all disabled:opacity-50"
            >
              <ChevronsLeft size={16} />
            </button>
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-white transition-all disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-lg text-xs font-bold bg-[#1e40af] text-white shadow-sm">{currentPage}</button>
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-white transition-all disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(totalPages)}
              className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-white transition-all disabled:opacity-50"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
