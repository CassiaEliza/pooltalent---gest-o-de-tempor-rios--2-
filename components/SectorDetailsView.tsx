
import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, Search, Download, Info, 
  BarChart3, Clock, ArrowUpRight,
  Star, CheckCircle2, ClipboardList, Calendar
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';

interface SectorDetailsViewProps {
  onBack: () => void;
}

const MOCK_SECTORS_EXTENDED = [
  { 
    id: 'sutic',
    label: "SUTIC", 
    fullName: "Superintendência de Tecnologia da Informação e Comunicação",
    manager: "Ricardo Oliveira",
    totalRequestsYear: 42,
    grantedRequests: 25,
    inProgress: 12,
    backlog: 5,
    avgSatisfaction: 4.8,
    topSkill: "DevOps",
    monthlyHistory: [
      { month: 'Jan', count: 4 }, { month: 'Fev', count: 3 }, { month: 'Mar', count: 6 },
      { month: 'Abr', count: 2 }, { month: 'Mai', count: 8 }, { month: 'Jun', count: 5 },
      { month: 'Jul', count: 4 }, { month: 'Ago', count: 3 }, { month: 'Set', count: 7 },
    ]
  },
  { 
    id: 'supgf',
    label: "SUPGF", 
    fullName: "Superintendência de Gestão Fiscal",
    manager: "Ana Beatriz Costa",
    totalRequestsYear: 28,
    grantedRequests: 18,
    inProgress: 6,
    backlog: 4,
    avgSatisfaction: 4.6,
    topSkill: "Data Analytics",
    monthlyHistory: [
      { month: 'Jan', count: 2 }, { month: 'Fev', count: 2 }, { month: 'Mar', count: 4 },
      { month: 'Abr', count: 3 }, { month: 'Mai', count: 5 }, { month: 'Jun', count: 4 },
      { month: 'Jul', count: 3 }, { month: 'Ago', count: 2 }, { month: 'Set', count: 3 },
    ]
  },
  { 
    id: 'sefaz',
    label: "SEFAZ", 
    fullName: "Secretaria da Fazenda",
    manager: "Marcos Vinícius",
    totalRequestsYear: 15,
    grantedRequests: 12,
    inProgress: 2,
    backlog: 1,
    avgSatisfaction: 4.9,
    topSkill: "Backend Java",
    monthlyHistory: [
      { month: 'Jan', count: 1 }, { month: 'Fev', count: 1 }, { month: 'Mar', count: 2 },
      { month: 'Abr', count: 1 }, { month: 'Mai', count: 3 }, { month: 'Jun', count: 2 },
      { month: 'Jul', count: 2 }, { month: 'Ago', count: 1 }, { month: 'Set', count: 2 },
    ]
  }
];

export const SectorDetailsView: React.FC<SectorDetailsViewProps> = ({ onBack }) => {
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedSector = useMemo(() => 
    MOCK_SECTORS_EXTENDED.find(s => s.id === selectedSectorId), 
  [selectedSectorId]);

  const filteredSectors = MOCK_SECTORS_EXTENDED.filter(s => 
    s.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderSectorList = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Detalhamento por Setorial</h1>
            <p className="text-slate-500 text-xs">Análise de atendimento e performance por órgão solicitante</p>
          </div>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Buscar setorial..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 ring-blue-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSectors.map((sector) => (
          <div 
            key={sector.id}
            onClick={() => setSelectedSectorId(sector.id)}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs">
                {sector.label}
              </div>
              <button className="p-2 text-slate-300 group-hover:text-blue-500 transition-colors">
                <ArrowUpRight size={20} />
              </button>
            </div>
            
            <h3 className="font-bold text-slate-800 text-sm mb-1">{sector.fullName}</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mb-4">Gerente: {sector.manager}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Contempladas (Ano)</p>
                <p className="text-xl font-black text-slate-800">{sector.grantedRequests}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Taxa de Sucesso</p>
                <p className="text-xl font-black text-emerald-600">
                  {Math.round((sector.grantedRequests / sector.totalRequestsYear) * 100)}%
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                <span>Status das Demandas</span>
                <span>{sector.totalRequestsYear} Total</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div style={{ width: `${(sector.grantedRequests/sector.totalRequestsYear)*100}%` }} className="bg-emerald-500 h-full"></div>
                <div style={{ width: `${(sector.inProgress/sector.totalRequestsYear)*100}%` }} className="bg-blue-500 h-full"></div>
                <div style={{ width: `${(sector.backlog/sector.totalRequestsYear)*100}%` }} className="bg-amber-500 h-full"></div>
              </div>
              <div className="flex gap-3 pt-1">
                <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Finalizadas</div>
                <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Ativas</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDetailedSector = () => {
    if (!selectedSector) return null;

    return (
      <div className="space-y-8 animate-in slide-in-from-right duration-500 pb-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSelectedSectorId(null)}
              className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-all shadow-sm"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-slate-900">{selectedSector.label}</h1>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-black uppercase tracking-widest border border-blue-100">
                  Órgão Consumidor
                </span>
              </div>
              <p className="text-slate-500 text-sm font-medium">{selectedSector.fullName}</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-100 transition-all">
            <Download size={18} /> Exportar Dossiê do Órgão
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ClipboardList size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total de Pedidos</p>
              <p className="text-2xl font-black text-slate-800">{selectedSector.totalRequestsYear}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contempladas 2024</p>
              <p className="text-2xl font-black text-slate-800">{selectedSector.grantedRequests}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Em Fila/Backlog</p>
              <p className="text-2xl font-black text-slate-800">{selectedSector.backlog}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Star size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Satisfação Média</p>
              <p className="text-2xl font-black text-slate-800">{selectedSector.avgSatisfaction}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Histórico de Solicitações Atendidas</h3>
                <p className="text-xs text-slate-400 font-medium">Frequência mensal de liberação de talentos</p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-slate-300" />
                <span className="text-xs font-bold text-slate-600">Ano de 2024</span>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={selectedSector.monthlyHistory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                  />
                  <RechartsTooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 bg-[#0f172a] p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col text-white">
            <h3 className="text-lg font-bold mb-2">Perfil de Consumo</h3>
            <p className="text-slate-400 text-xs mb-8">Preferências técnicas e áreas críticas do órgão</p>
            
            <div className="space-y-6 flex-1">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Principal Competência</p>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
                    <BarChart3 size={24} />
                  </div>
                  <span className="text-lg font-bold">{selectedSector.topSkill}</span>
                </div>
              </div>

              <div className="h-px bg-slate-800 w-full"></div>

              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Gargalos e Demandas</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Tempo Médio de Atendimento</span>
                    <span className="font-bold">14 dias</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Urgências Solicitadas</span>
                    <span className="font-bold text-rose-400">08</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Cancelamentos</span>
                    <span className="font-bold">02</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800">
              <p className="text-[10px] text-slate-500 font-bold mb-3 italic">"Órgão com alta aderência técnica, porém apresenta picos de urgência no fim de trimestres fiscais."</p>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                <Info size={14} /> Sugestão de Planejamento Ativo
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/30">
            <h3 className="text-sm font-bold text-slate-800">Todas as Solicitações de {selectedSector.label}</h3>
          </div>
          <div className="p-8 text-center text-slate-400">
            <ClipboardList size={40} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm">Lista detalhada de solicitações do órgão em integração com GOMAP...</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      {selectedSectorId ? renderDetailedSector() : renderSectorList()}
    </div>
  );
};
