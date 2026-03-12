
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Send, Star, FilterX, Download, 
  ChevronUp, ChevronDown, User, Building2, 
  Clock, AlertCircle, ChevronLeft, ChevronRight
} from 'lucide-react';
import { EVALUATIONS_MOCK } from '@/constants';
import { Evaluation } from '@/types';

interface EvaluationTableProps {
  onSelectEvaluation: (evaluation: Evaluation) => void;
  onNudge: (target: string) => void;
}

type SortConfig = {
  key: keyof Evaluation | 'status';
  direction: 'asc' | 'desc';
};

export const EvaluationTable: React.FC<EvaluationTableProps> = ({ onSelectEvaluation, onNudge }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'dislocationDate', direction: 'desc' });
  
  // Estados de Paginação
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Extrair órgãos únicos para o filtro
  const departments = useMemo(() => {
    const depts = new Set(EVALUATIONS_MOCK.map(item => item.department));
    return ['Todos', ...Array.from(depts)];
  }, []);

  // Resetar para página 1 sempre que os filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, deptFilter, statusFilter, sortConfig]);

  const handleSort = (key: keyof Evaluation | 'status') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedData = useMemo(() => {
    let data = [...EVALUATIONS_MOCK].filter(item => {
      const matchesSearch = 
        item.professional.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.project.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDept = deptFilter === 'Todos' || item.department === deptFilter;
      
      const matchesStatus = statusFilter === 'Todos' || 
        item.statusProfessional === statusFilter || 
        item.statusDepartment === statusFilter;

      return matchesSearch && matchesDept && matchesStatus;
    });

    if (sortConfig.key) {
      data.sort((a, b) => {
        const valA = a[sortConfig.key as keyof Evaluation] ?? '';
        const valB = b[sortConfig.key as keyof Evaluation] ?? '';

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [searchTerm, deptFilter, statusFilter, sortConfig]);

  // Dados paginados
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedData.slice(start, start + pageSize);
  }, [filteredAndSortedData, currentPage, pageSize]);

  const totalItems = filteredAndSortedData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const currentItemsCount = paginatedData.length;

  const clearFilters = () => {
    setSearchTerm('');
    setDeptFilter('Todos');
    setStatusFilter('Todos');
    setSortConfig({ key: 'dislocationDate', direction: 'desc' });
    setCurrentPage(1);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleExport = () => {
    alert("Relatório sendo gerado e preparado para download...");
  };

  const hasActiveFilters = searchTerm !== '' || deptFilter !== 'Todos' || statusFilter !== 'Todos';

  const SortIcon = ({ column }: { column: keyof Evaluation | 'status' }) => {
    if (sortConfig.key !== column) return <ChevronDown size={14} className="opacity-20 group-hover:opacity-50" />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-emerald-600" /> : <ChevronDown size={14} className="text-emerald-600" />;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col mt-4">
      {/* Header com Filtros e Exportação */}
      <div className="p-6 border-b border-slate-100 space-y-4 bg-slate-50/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Lista de Avaliações</h3>
            <p className="text-xs text-slate-400 font-medium italic">Clique em uma linha para detalhes ou no ícone amarelo para cobrar pendências.</p>
          </div>

          <div className="flex flex-1 max-w-2xl items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar profissional ou projeto..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 ring-emerald-100 focus:border-emerald-200 transition-all"
              />
            </div>
            
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
            >
              <Download size={16} className="text-emerald-600" />
              Exportar
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Filtrar Órgão:</span>
            <select 
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500 transition-colors cursor-pointer"
            >
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status Geral:</span>
            <div className="flex gap-1">
              {['Todos', 'Concluída', 'Pendente'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === status 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {hasActiveFilters && (
            <button 
              onClick={clearFilters}
              className="ml-auto text-xs font-bold text-red-500 flex items-center gap-1 hover:underline"
            >
              <FilterX size={14} />
              Resetar Filtros
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-200">
            <tr>
              <th 
                className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors group"
                onClick={() => handleSort('professional')}
              >
                <div className="flex items-center gap-2">
                  Profissional <SortIcon column="professional" />
                </div>
              </th>
              <th 
                className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors group"
                onClick={() => handleSort('department')}
              >
                <div className="flex items-center gap-2">
                  Órgão <SortIcon column="department" />
                </div>
              </th>
              <th 
                className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors group"
                onClick={() => handleSort('project')}
              >
                <div className="flex items-center gap-2">
                  Projeto <SortIcon column="project" />
                </div>
              </th>
              <th 
                className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors group"
                onClick={() => handleSort('dislocationDate')}
              >
                <div className="flex items-center gap-2">
                  Desalocação <SortIcon column="dislocationDate" />
                </div>
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
                Avaliações (Prof. / Órgão)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.length > 0 ? (
              paginatedData.map((evalItem) => (
                <tr 
                  key={evalItem.id} 
                  onClick={() => onSelectEvaluation(evalItem)}
                  className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-indigo-600 text-white text-xs font-bold border border-slate-200 shadow-sm shrink-0">
                        {getInitials(evalItem.professional)}
                      </div>
                      <span className="text-sm font-bold text-slate-800 whitespace-nowrap">{evalItem.professional}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-tight">
                      {evalItem.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium truncate max-w-[150px]">{evalItem.project}</td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-medium">{evalItem.dislocationDate}</td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-4">
                      {/* Profissional Indicator & Nudge Button */}
                      <div className="flex flex-col items-center gap-1 group/nudge">
                        <div 
                          onClick={(e) => {
                            if (evalItem.statusProfessional === 'Pendente') {
                                e.stopPropagation();
                                onNudge(evalItem.professional);
                            }
                          }}
                          className={`p-2 rounded-xl border flex items-center gap-1.5 transition-all ${
                            evalItem.statusProfessional === 'Concluída' 
                              ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                              : 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100 hover:border-amber-300 hover:scale-110 active:scale-95 shadow-sm cursor-pointer'
                          }`}
                          title={evalItem.statusProfessional === 'Pendente' ? "Clique para cobrar profissional" : "Avaliação concluída"}
                        >
                          <User size={16} />
                          {evalItem.ratingProfessional ? (
                            <span className="text-xs font-bold">{evalItem.ratingProfessional}</span>
                          ) : (
                            <Send size={14} className="text-amber-500" />
                          )}
                        </div>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Auto</span>
                      </div>

                      <div className="w-px h-6 bg-slate-100"></div>

                      {/* Órgão Indicator & Nudge Button */}
                      <div className="flex flex-col items-center gap-1 group/nudge">
                        <div 
                          onClick={(e) => {
                            if (evalItem.statusDepartment === 'Pendente') {
                                e.stopPropagation();
                                onNudge(evalItem.department);
                            }
                          }}
                          className={`p-2 rounded-xl border flex items-center gap-1.5 transition-all ${
                            evalItem.statusDepartment === 'Concluída' 
                              ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                              : 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100 hover:border-amber-300 hover:scale-110 active:scale-95 shadow-sm cursor-pointer'
                          }`}
                          title={evalItem.statusDepartment === 'Pendente' ? "Clique para cobrar órgão" : "Avaliação concluída"}
                        >
                          <Building2 size={16} />
                          {evalItem.ratingDepartment ? (
                            <span className="text-xs font-bold">{evalItem.ratingDepartment}</span>
                          ) : (
                            <Send size={14} className="text-amber-500" />
                          )}
                        </div>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Órgão</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-3">
                    <FilterX size={40} strokeWidth={1} className="opacity-20" />
                    <p className="text-sm font-medium">Nenhum registro encontrado com estes critérios.</p>
                    <button onClick={clearFilters} className="text-xs font-bold text-emerald-600 hover:underline">Limpar Filtros</button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer com Paginação */}
      <div className="px-6 py-5 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Itens por página:</span>
            <select 
              value={pageSize}
              onChange={handlePageSizeChange}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-600 outline-none focus:ring-2 ring-emerald-100 transition-all cursor-pointer shadow-sm"
            >
              <option value={5}>5</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
            </select>
          </div>
          
          <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
            Exibindo <span className="text-emerald-600">{currentItemsCount}</span> itens de <span className="text-slate-800">{totalItems}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className={`flex items-center justify-center p-2 border border-slate-200 rounded-lg transition-all shadow-sm ${
              currentPage === 1 ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : 'bg-white text-slate-600 hover:bg-slate-50 active:scale-95'
            }`}
          >
            <ChevronLeft size={16} />
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                  currentPage === page 
                    ? 'bg-emerald-600 text-white shadow-md' 
                    : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className={`flex items-center justify-center p-2 border border-slate-200 rounded-lg transition-all shadow-sm ${
              currentPage === totalPages || totalPages === 0 ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : 'bg-white text-slate-600 hover:bg-slate-50 active:scale-95'
            }`}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
