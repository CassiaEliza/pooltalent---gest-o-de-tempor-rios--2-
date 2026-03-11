
import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend
} from 'recharts';
import { TIMELINE_DATA } from '../constants';
import { RankingCard } from './RankingCard';

export const PerformanceCharts: React.FC<{ period: string }> = ({ period }) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-8 items-start">
      {/* Timeline Chart (Histórico de Notas) */}
      <div className="xl:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col min-h-[500px]">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Evolução de Desempenho</h3>
            <p className="text-sm text-slate-400 mt-1">Comparativo de notas médias mensais</p>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
             <div className="flex items-center gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
               Profissional
             </div>
             <div className="flex items-center gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
               Órgão
             </div>
          </div>
        </div>
        
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={340}>
            <LineChart data={TIMELINE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="period" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                dy={10}
              />
              <YAxis 
                domain={[0, 5]} 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                ticks={[0, 1, 2, 3, 4, 5]}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  padding: '12px'
                }}
                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                labelStyle={{ fontSize: '11px', color: '#64748b', marginBottom: '4px', fontWeight: 'bold' }}
              />
              <Line 
                type="monotone" 
                dataKey="profissional" 
                name="Profissional"
                stroke="#6366f1" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
              <Line 
                type="monotone" 
                dataKey="orgao" 
                name="Órgão"
                stroke="#10b981" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
            <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Volatilidade Profissional</p>
            <p className="text-lg font-bold text-indigo-900">±0.4pts</p>
          </div>
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
            <p className="text-[10px] font-bold text-emerald-400 uppercase mb-1">Aderência Órgão</p>
            <p className="text-lg font-bold text-emerald-900">92%</p>
          </div>
        </div>
      </div>

      {/* Ranking Card */}
      <div className="xl:col-span-5 h-full">
        <RankingCard period={period} />
      </div>
    </div>
  );
};
