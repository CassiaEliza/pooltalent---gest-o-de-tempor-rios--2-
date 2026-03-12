
import React, { useMemo } from 'react';
import { ExternalLink, TrendingUp, Star, ChevronRight } from 'lucide-react';
import { RANKING_ITEMS } from '@/constants';

export const RankingCard: React.FC<{ period: string }> = ({ period }) => {
  // Simulate data variation based on period
  const displayItems = useMemo(() => {
    if (period === '1m') {
      return [...RANKING_ITEMS].sort(() => Math.random() - 0.5);
    }
    return RANKING_ITEMS;
  }, [period]);

  const periodLabel = useMemo(() => {
    switch (period) {
      case '1m': return 'Últimos 30 dias';
      case '6m': return 'Junho - Dezembro 2024';
      case '1y': return 'Ano de 2024';
      default: return 'Out-Dez 2024';
    }
  }, [period]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-slate-100 flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Ranking de Desempenho</h3>
          <p className="text-xs text-slate-400 mt-1 font-medium">Avaliação Trimestral • {periodLabel}</p>
        </div>
        <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
          <ExternalLink size={18} />
        </button>
      </div>

      <div className="flex-1 px-6 py-4 space-y-4">
        {displayItems.map((item, idx) => (
          <div key={item.id} className="relative group py-2">
            <div className="flex items-center gap-4">
              {/* Rank Number Circle */}
              <div className="w-8 flex justify-center shrink-0">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  idx === 0 ? 'bg-amber-400 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {idx + 1}
                </div>
              </div>

              {/* Avatar Box */}
              <div className="relative shrink-0">
                <div 
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm"
                  style={{ backgroundColor: item.color }}
                >
                  {item.initials}
                </div>
                {idx === 0 && (
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center text-white shadow-sm">
                    <Star size={10} fill="currentColor" />
                  </div>
                )}
              </div>

              {/* Info & Bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-sm font-bold text-slate-800 truncate">{item.name}</span>
                  <span className="text-[10px] font-bold text-slate-300">•</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{item.dept}</span>
                  {item.trend === 'up' && (
                    <TrendingUp size={14} className="text-emerald-500" />
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${item.score}%`, 
                        backgroundColor: item.color 
                      }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 w-8 text-right">{item.score}%</span>
                </div>
              </div>

              {/* Counter and Rating */}
              <div className="flex items-center gap-4 shrink-0 pl-2">
                <div className="text-center w-14">
                  <p className="text-sm font-bold text-slate-800 leading-none">{item.projects}</p>
                  <p className="text-[10px] text-slate-400 font-medium">projetos</p>
                </div>
                
                <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  <span className="text-xs font-bold text-slate-700">{item.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>

            {/* DARK TOOLTIP */}
            <div className="absolute left-1/2 -top-14 -translate-x-1/2 bg-slate-950 text-white p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-30 shadow-2xl min-w-[200px] border border-slate-800">
              <p className="text-xs font-bold leading-tight">{item.name}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1.5">{item.dept}</p>
              <div className="h-px bg-slate-800 mb-2" />
              <p className="text-[10px] font-medium">
                Score: <span className="font-bold">{item.score}%</span> • <span className="font-bold">{item.projects} projetos concluídos</span>
              </p>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-950" />
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-medium">Visualizando dados de: {periodLabel}</span>
        <button className="text-[11px] font-bold text-blue-900 hover:text-blue-700 flex items-center gap-1 transition-colors">
          Ver ranking completo
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
