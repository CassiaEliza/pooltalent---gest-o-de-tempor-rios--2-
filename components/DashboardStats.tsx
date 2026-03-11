
import React, { useMemo } from 'react';
import { ClipboardCheck, Clock, Star, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: any;
  iconColor: string;
  bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon: Icon, iconColor, bgColor }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-emerald-200 transition-all">
    <div className={`w-12 h-12 rounded-xl ${bgColor} ${iconColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{title}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-black text-slate-800">{value}</p>
        {title === "Média Geral" && <Star className="text-amber-400 fill-amber-400 mb-0.5" size={14} />}
      </div>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{subtitle}</p>
    </div>
  </div>
);

export const DashboardStats: React.FC<{ period: string }> = ({ period }) => {
  const stats = useMemo(() => {
    switch (period) {
      case '1m':
        return { total: 12, concluida: 8, pendente: 4, media: 4.6 };
      case '6m':
        return { total: 84, concluida: 72, pendente: 12, media: 4.3 };
      case '1y':
        return { total: 156, concluida: 140, pendente: 16, media: 4.5 };
      case '3m':
      default:
        return { total: 46, concluida: 38, pendente: 8, media: 4.4 };
    }
  }, [period]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard 
        title="Total de Avaliações" 
        value={stats.total} 
        subtitle="projetos no período" 
        icon={ClipboardCheck}
        iconColor="text-blue-600"
        bgColor="bg-blue-50"
      />
      <StatCard 
        title="Concluídas" 
        value={stats.concluida} 
        subtitle="feedback finalizado" 
        icon={TrendingUp}
        iconColor="text-emerald-600"
        bgColor="bg-emerald-50"
      />
      <StatCard 
        title="Pendentes" 
        value={stats.pendente} 
        subtitle="aguardando resposta" 
        icon={Clock}
        iconColor="text-amber-600"
        bgColor="bg-amber-50"
      />
      <StatCard 
        title="Média Geral" 
        value={stats.media.toFixed(1)} 
        subtitle="de 5.0 pontos" 
        icon={Star}
        iconColor="text-indigo-600"
        bgColor="bg-indigo-50"
      />
    </div>
  );
};
