
import React, { useState, useMemo } from 'react';
import { 
  Users, UserCheck, UserPlus, Star, Info, 
  Search, Download, Eye, 
  ChevronLeft, ChevronRight,
  ChevronsRight, ChevronsLeft,
  LayoutGrid, List, ChevronDown, MapPin,
  Calendar, Lightbulb, Clock, TrendingUp
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { INITIAL_TALENTS } from '../constants';

const SUMMARY_STATS = [
  { label: 'Total de Talentos', value: 36, icon: Users, color: 'text-indigo-600', bgColor: 'bg-indigo-50', sub: 'profissionais' },
  { label: 'Alocados', value: 24, sub: '67% de ocupação', icon: UserCheck, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { label: 'Disponíveis', value: 12, trend: '↑ 2', sub: 'prontos para alocar', icon: UserPlus, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  { label: 'ESPERA', value: '12 dias', sub: 'dias médios até alocação', icon: Clock, color: 'text-amber-500', bgColor: 'bg-amber-50' },
];

const UTILIZATION_HISTORY = [
  { period: 'Jan', percent: 62 },
  { period: 'Fev', percent: 65 },
  { period: 'Mar', percent: 70 },
  { period: 'Abr', percent: 68 },
  { period: 'Mai', percent: 75 },
  { period: 'Jun', percent: 82 },
  { period: 'Jul', percent: 78 },
  { period: 'Ago', percent: 84 },
  { period: 'Set', percent: 81 },
];

const SKILLS_DATA = [
  { name: 'Desenvolvimento de Sistemas', current: 18, total: 22, percent: 82, colorClass: 'bg-blue-600' },
  { name: 'DevOps & Cloud', current: 14, total: 18, percent: 78, colorClass: 'bg-emerald-500' },
  { name: 'Dados & Analytics', current: 12, total: 15, percent: 80, colorClass: 'bg-amber-500' },
  { name: 'Gestão de Projetos TIC', current: 10, total: 12, percent: 83, colorClass: 'bg-indigo-400' },
  { name: 'UX/UI Design', current: 8, total: 10, percent: 80, colorClass: 'bg-rose-500' },
];

const GANTT_HIERARCHY = [
  {
    id: 'fullstack',
    category: 'Desenvolvimento Full-Stack',
    count: 8,
    color: 'bg-blue-800',
    barColor: 'bg-blue-100/50',
    professionals: [
      { name: 'Ana Costa', project: 'Projeto Alpha', start: 1.5, end: 4.5, color: 'bg-amber-400' },
      { name: 'Bruno Silva', project: 'Projeto Beta', start: 2.2, end: 3.8, color: 'bg-emerald-500' },
      { name: 'Carlos Mendes', project: 'Projeto Gamma', start: 5.8, end: 10.2, color: 'bg-blue-800' },
      { name: 'Diana Santos', project: 'Projeto Delta', start: 3.8, end: 7.2, color: 'bg-rose-400' },
      { name: 'Eduardo Lima', project: 'Projeto Epsilon', start: 7.5, end: 11.8, color: 'bg-teal-400' },
    ]
  },
  {
    id: 'devops',
    category: 'DevOps & Cloud',
    count: 5,
    color: 'bg-emerald-500',
    barColor: 'bg-emerald-100/50',
    professionals: [
      { name: 'Felipe Nascimento', project: 'Modernização AWS', start: 2, end: 10, color: 'bg-indigo-600' }
    ]
  },
  {
    id: 'uxui',
    category: 'UX/UI Design',
    count: 4,
    color: 'bg-amber-400',
    barColor: 'bg-amber-100/50',
    professionals: []
  },
  {
    id: 'data',
    category: 'Análise de Dados',
    count: 6,
    color: 'bg-rose-400',
    barColor: 'bg-rose-100/50',
    professionals: []
  },
  {
    id: 'sec',
    category: 'Segurança da Informação',
    count: 3,
    color: 'bg-teal-400',
    barColor: 'bg-teal-100/50',
    professionals: []
  }
];

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star 
        key={s} 
        size={14} 
        className={s <= Math.floor(rating) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} 
      />
    ))}
  </div>
);

const AllocationBar = ({ label, current, total, colorClass, percent }: any) => (
  <div className="group cursor-default">
    <div className="flex justify-between text-[11px] items-center mb-1.5">
      <span className="font-bold text-slate-700 group-hover:text-blue-700 transition-colors uppercase tracking-tight">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-slate-400 font-bold">{current}/{total}</span>
        <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${percent >= 80 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
          {percent}%
        </span>
      </div>
    </div>
    <div className="h-5 w-full bg-slate-100 rounded-lg overflow-hidden flex border border-slate-200/50 shadow-inner">
      <div 
        className={`${colorClass} h-full flex items-center justify-center text-[9px] font-black text-white transition-all duration-1000 ease-out`}
        style={{ width: `${percent}%` }}
      >
        <span className="drop-shadow-sm">{current} alocados</span>
      </div>
    </div>
  </div>
);

interface TalentPoolProps {
  onSelectProfessional?: (prof: any) => void;
  onNavigateToCompetencies?: () => void;
}

export const TalentPool: React.FC<TalentPoolProps> = ({ onSelectProfessional, onNavigateToCompetencies }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos os Status');
  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['fullstack']);

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredTalents = useMemo(() => {
    return INITIAL_TALENTS.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           t.role.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'Todos os Status' || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedTalents = filteredTalents.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(filteredTalents.length / pageSize);

  const renderTimeline = () => (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-800 tracking-tight">Timeline de Disponibilidade por Competência</h3>
          <p className="text-xs text-slate-400 font-medium">Clique nas competências para expandir e ver os talentos alocados</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
          <Calendar size={14} className="text-slate-400" />
          <span className="text-[11px] font-bold text-slate-600">Ano 2024</span>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <div className="min-w-[1200px] px-8 pb-8">
          {/* Header meses */}
          <div className="flex border-b border-slate-100 mb-2">
            <div className="w-[300px] py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              COMPETÊNCIA / TALENTO
            </div>
            <div className="flex-1 grid grid-cols-12">
              {MONTHS.map(m => (
                <div key={m} className="text-center py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  {m}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            {/* Linhas de grade verticais */}
            <div className="absolute top-0 bottom-0 left-[300px] right-0 grid grid-cols-12 pointer-events-none">
              {MONTHS.map(m => (
                <div key={m} className="border-r border-slate-50 last:border-none h-full"></div>
              ))}
            </div>

            {/* Categorias e Profissionais */}
            <div className="space-y-1 relative z-10">
              {GANTT_HIERARCHY.map((cat) => (
                <div key={cat.id} className="flex flex-col">
                  {/* Linha da Categoria */}
                  <div 
                    onClick={() => toggleCategory(cat.id)}
                    className="flex items-center group cursor-pointer hover:bg-slate-50 transition-colors rounded-lg py-2"
                  >
                    <div className="w-[300px] flex items-center gap-3 pr-4">
                      <div className={`transition-transform duration-300 ${expandedCategories.includes(cat.id) ? 'rotate-0' : '-rotate-90'}`}>
                        <ChevronDown size={16} className="text-slate-400" />
                      </div>
                      <div className={`w-3 h-3 rounded-full ${cat.color} shrink-0`}></div>
                      <span className="text-sm font-bold text-slate-800 truncate">{cat.category}</span>
                      <div className="flex items-center gap-1 ml-auto text-slate-400">
                        <Users size={12} />
                        <span className="text-[10px] font-bold">{cat.count}</span>
                      </div>
                    </div>
                    <div className="flex-1 relative h-6 flex items-center px-4">
                      <div className={`w-full h-1.5 ${cat.barColor} rounded-full`}></div>
                    </div>
                  </div>

                  {/* Profissionais Expandidos */}
                  {expandedCategories.includes(cat.id) && (
                    <div className="animate-in slide-in-from-top-2 duration-300 space-y-1">
                      {cat.professionals.length > 0 ? cat.professionals.map((prof, pIdx) => (
                        <div key={pIdx} className="flex items-center py-2 hover:bg-slate-50/50 rounded-lg">
                          <div className="w-[300px] pl-12 pr-4">
                            <p className="text-[12px] font-bold text-slate-700 leading-tight">{prof.name}</p>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">{prof.project}</p>
                          </div>
                          <div className="flex-1 relative h-8 flex items-center px-4">
                            {/* Barra do Projeto Gantt */}
                            <div 
                              className={`absolute h-4 ${prof.color} rounded-full flex items-center shadow-sm`}
                              style={{ 
                                left: `${(prof.start / 12) * 100}%`, 
                                width: `${((prof.end - prof.start) / 12) * 100}%` 
                              }}
                            >
                              {/* Marcadores nas pontas (White Dots) */}
                              <div className="absolute -left-0.5 w-1.5 h-1.5 bg-white rounded-full shadow-sm"></div>
                              <div className="absolute -right-0.5 w-1.5 h-1.5 bg-white rounded-full shadow-sm"></div>
                            </div>
                          </div>
                        </div>
                      )) : (
                        <div className="flex items-center py-4 pl-12">
                          <p className="text-[11px] italic text-slate-300 font-medium">Nenhum talento alocado nesta competência.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legenda e Footer Timeline */}
      <div className="p-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
        <div className="flex items-center gap-8">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Legenda:</span>
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
            <div className="w-3.5 h-3.5 bg-slate-200 rounded-md"></div>
            Disponível para alocação
          </div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
            <div className="w-3.5 h-3.5 bg-blue-800 rounded-md"></div>
            Alocado em projeto
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-black text-amber-500/80 uppercase tracking-tight">
          <Lightbulb size={14} className="text-amber-400" />
          Passe o mouse sobre as barras para ver mais detalhes
        </div>
      </div>
    </div>
  );

  const renderGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {paginatedTalents.map((talent) => (
        <div key={talent.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className={`w-14 h-14 rounded-full ${talent.color} flex items-center justify-center text-white text-lg font-bold shadow-sm`}>
              {talent.avatar}
            </div>
            <span className={`px-3 py-1 rounded-lg text-[11px] font-bold ${
              talent.status === 'Alocado' ? 'bg-blue-800 text-white' : 'bg-emerald-500 text-white'
            }`}>
              {talent.status}
            </span>
          </div>

          <div className="mb-2">
            <h3 className="text-lg font-bold text-slate-800 leading-tight">{talent.name}</h3>
            <p className="text-xs font-medium text-slate-400">{talent.role} • {talent.level}</p>
          </div>

          <div className="mb-4">
            {talent.status === 'Alocado' ? (
              <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded uppercase tracking-wider border border-amber-100">
                {talent.dept}
              </span>
            ) : (
              <span className="px-2.5 py-1 bg-rose-50 text-rose-500 text-[10px] font-bold rounded uppercase tracking-wider border border-rose-100">
                Sem alocação
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-6">
            <div className="flex items-center gap-1.5">
              <Stars rating={talent.rating} />
              <span className="text-slate-700 mt-0.5">{talent.rating}</span>
            </div>
            <span>•</span>
            <span className="text-slate-500">{talent.projects} projetos</span>
            <span>•</span>
            <span className="text-slate-500">{talent.exp}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-8 flex-1">
            {talent.skills.slice(0, 3).map(skill => (
              <span key={skill} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-md text-[10px] font-bold border border-slate-200">
                {skill}
              </span>
            ))}
            {talent.skills.length > 3 && (
              <span className="px-2 py-1 text-slate-300 text-[10px] font-bold">+{talent.skills.length - 3}</span>
            )}
          </div>

          <button 
            onClick={() => onSelectProfessional?.(talent)}
            className="flex items-center justify-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors pt-4 border-t border-slate-50"
          >
            <Eye size={16} /> Ver Perfil Completo
          </button>
        </div>
      ))}
    </div>
  );

  const renderList = () => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
          <tr>
            <th className="px-6 py-6">Profissional</th>
            <th className="px-4 py-6">Área</th>
            <th className="px-4 py-6">Status</th>
            <th className="px-4 py-6">Alocação</th>
            <th className="px-4 py-6">Avaliação</th>
            <th className="px-4 py-6">Projetos</th>
            <th className="px-4 py-6">Experiência</th>
            <th className="px-4 py-6">Competências</th>
            <th className="px-6 py-6 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {paginatedTalents.map((talent) => (
            <tr key={talent.id} className="hover:bg-slate-50/50 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${talent.color} flex items-center justify-center text-white text-[10px] font-bold shadow-sm`}>
                    {talent.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 leading-tight">{talent.name}</p>
                    <p className="text-[10px] font-medium text-slate-400">{talent.role}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <span className="text-xs font-medium text-slate-600">{talent.level}</span>
              </td>
              <td className="px-4 py-4">
                <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase ${
                  talent.status === 'Alocado' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {talent.status}
                </span>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  {talent.status === 'Alocado' ? (
                    <><MapPin size={12} className="text-slate-300" /> {talent.dept}</>
                  ) : (
                    <><MapPin size={12} className="text-slate-300" /> Sem alocação</>
                  )}
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <Stars rating={talent.rating} />
                  <span className="text-xs font-bold text-slate-700">{talent.rating}</span>
                </div>
              </td>
              <td className="px-4 py-4">
                <span className="text-xs font-bold text-slate-600">{talent.projects} projetos</span>
              </td>
              <td className="px-4 py-4 text-xs text-slate-500 font-medium">{talent.exp}</td>
              <td className="px-4 py-4">
                <div className="flex gap-1.5">
                  {talent.skills.slice(0, 2).map(skill => (
                    <span key={skill} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold">
                      {skill}
                    </span>
                  ))}
                  {talent.skills.length > 2 && (
                    <span className="text-[9px] text-slate-300 font-bold">+{talent.skills.length - 2}</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <button 
                  onClick={() => onSelectProfessional?.(talent)}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-blue-600 transition-colors"
                >
                  <Eye size={14} /> Ver Perfil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full space-y-8 animate-in fade-in duration-500 pb-16 text-slate-900">
      {/* Header e Título da Página */}
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gestão do Pool de Talentos</h1>
            <p className="text-slate-500 text-sm">Monitoramento de disponibilidade, alocação e performance técnica dos profissionais</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
              <Download size={16} className="text-emerald-600" /> Exportar Pool
            </button>
          </div>
        </div>

        {/* Seção 1: Métricas de Resumo - Padronizadas com a página de Solicitações */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SUMMARY_STATS.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-emerald-200 transition-all">
               <div className={`w-12 h-12 rounded-xl ${stat.bgColor} ${stat.color} flex items-center justify-center shrink-0`}>
                 <stat.icon size={24} />
               </div>
               <div>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{stat.label}</p>
                 <div className="flex items-baseline gap-2">
                   <p className="text-2xl font-black text-slate-800">{stat.value}</p>
                   {stat.trend && <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1 rounded">{stat.trend}</span>}
                 </div>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{stat.sub}</p>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seção 2: Gráficos de Tendência e Alocação */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Tendência de Utilização</h3>
              <p className="text-xs text-slate-400 font-medium tracking-tight">Histórico de ocupação do pool (Saturação vs. Ociosidade)</p>
            </div>
          </div>
          <div className="flex-1 min-h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={UTILIZATION_HISTORY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="period" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  unit="%"
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#1e40af' }}
                  labelStyle={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', marginBottom: '4px' }}
                  formatter={(value: any) => [`${value}%`, 'Ocupação']}
                />
                <ReferenceLine y={85} label={{ position: 'right', value: 'Saturação (85%)', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }} stroke="#fee2e2" strokeDasharray="3 3" />
                <Line 
                  type="monotone" 
                  dataKey="percent" 
                  stroke="#1e40af" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#1e40af', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Meta de Ocupação:</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">75% - 85%</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400">
               Status: <span className="text-emerald-600 font-black">SAUDÁVEL</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Alocação por Competência</h3>
              <p className="text-xs text-slate-400 font-medium tracking-tight">Principais competências em uso</p>
            </div>
            <button onClick={onNavigateToCompetencies} className="text-[10px] font-black uppercase text-blue-600 hover:underline">Ver Mapa Completo</button>
          </div>
          <div className="flex-1 space-y-5">
            {SKILLS_DATA.map((skill, idx) => (
              <AllocationBar key={idx} label={skill.name} current={skill.current} total={skill.total} percent={skill.percent} colorClass={skill.colorClass} />
            ))}
          </div>
        </div>
      </div>

      {/* Seção 3: Timeline de Disponibilidade por Competência */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
        {renderTimeline()}
      </div>

      {/* Seção 4: Listagem de Profissionais */}
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
        <h2 className="text-xl font-black text-slate-800">Profissionais do Pool de Talentos</h2>
        
        {/* Barra de Filtros e Ferramentas */}
        <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nome, cargo ou skill..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 ring-emerald-100 transition-all font-medium"
            />
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'grid' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:bg-white/50'
              }`}
            >
              <LayoutGrid size={14} /> Grade
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'list' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:bg-white/50'
              }`}
            >
              <List size={14} /> Lista
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
              Ordenar Por <ChevronDown size={14} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
              <Download size={14} /> Exportar
            </button>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 outline-none focus:ring-2 ring-emerald-50 cursor-pointer"
            >
              <option>Todos os Status</option>
              <option value="Alocado">Alocado</option>
              <option value="Disponível">Disponível</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
              Especialidade <ChevronDown size={14} />
            </button>
          </div>
        </div>

        <div className="py-2 min-h-[600px]">
          {viewMode === 'grid' ? renderGrid() : renderList()}
        </div>

        {/* Rodapé da Listagem com Paginação */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-400">Itens por página:</span>
              <select 
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-slate-100 border-none rounded-lg px-3 py-1.5 text-xs font-bold text-slate-600 outline-none focus:ring-2 ring-emerald-100 transition-all cursor-pointer"
              >
                <option value={6}>6</option>
                <option value={12}>12</option>
              </select>
            </div>
            <span className="text-xs font-medium text-slate-400">
              Mostrando {startIndex + 1} a {Math.min(startIndex + pageSize, filteredTalents.length)} de {filteredTalents.length} resultados
            </span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
              className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-white transition-all disabled:opacity-30 shadow-sm"
            >
              <ChevronsLeft size={16} />
            </button>
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-white transition-all disabled:opacity-30 shadow-sm"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-xs font-bold transition-all shadow-sm ${
                    currentPage === i + 1 ? 'bg-blue-800 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-white transition-all disabled:opacity-30 shadow-sm"
            >
              <ChevronRight size={16} />
            </button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
              className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-white transition-all disabled:opacity-30 shadow-sm"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
