
import React, { useEffect } from 'react';
import { 
  ArrowLeft, Mail, Phone, User, 
  Briefcase, TrendingUp, BarChart3, Clock,
  ChevronRight, ExternalLink
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';

interface ProfessionalProfileProps {
  professional: any;
  onBack: () => void;
}

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const RADAR_DATA = [
  { subject: 'Comunicação', A: 85, fullMark: 100 },
  { subject: 'Liderança', A: 75, fullMark: 100 },
  { subject: 'Técnica', A: 95, fullMark: 100 },
  { subject: 'Proatividade', A: 90, fullMark: 100 },
  { subject: 'Trabalho em Equipe', A: 80, fullMark: 100 },
  { subject: 'Resolução de Problemas', A: 90, fullMark: 100 },
];

const PROJECT_HISTORY = [
  {
    title: 'Dashboard de Acompanhamento de Metas',
    client: 'Superintendência de Planejamento (SUPLAN)',
    period: 'JAN 2024 - PRESENTE',
    role: 'Líder Técnica',
    description: 'Desenvolvimento de uma plataforma centralizada para visualização de KPIs estratégicos.',
    challenges: 'Integrar múltiplas fontes de dados em tempo real.',
    achievements: 'Redução de 30% no tempo de geração de relatórios gerenciais.',
    icon: TrendingUp,
    iconColor: 'text-emerald-500'
  },
  {
    title: 'Análise Preditiva de Alocação de Recursos',
    client: 'Superintendência de Gestão de Pessoas (SGP)',
    period: 'MAR 2023 - DEZ 2023',
    role: 'Analista de Dados Sênior',
    description: 'Implementação de modelos estatísticos para previsão de demanda de talentos.',
    challenges: 'Alta complexidade dos dados históricos de alocação.',
    achievements: 'Aumento de 15% na precisão das previsões de demanda por competências.',
    icon: BarChart3,
    iconColor: 'text-indigo-500'
  }
];

const PERFORMANCE_EVALUATIONS = [
  { title: 'Avaliação do Projeto "Dashboard de Metas"', evaluator: 'João Pereira', date: '02/05/2024', rating: 4.8 },
  { title: 'Avaliação Anual de Desempenho 2023', evaluator: 'Maria Silva', date: '15/12/2023', rating: 4.6 },
  { title: 'Avaliação do Projeto "Análise Preditiva"', evaluator: 'João Pereira', date: '05/10/2023', rating: 4.9 },
];

const CERTIFICATIONS = [
  'AWS Certified Solutions Architect',
  'ServiceNow Certified Administrator',
  'Scrum Master Certified (SMC)',
  'Google Cloud Professional Developer'
];

export const ProfessionalProfile: React.FC<ProfessionalProfileProps> = ({ professional, onBack }) => {
  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) mainContent.scrollTop = 0;
  }, []);

  const summary = `Um resumo profissional conciso sobre as principais qualificações, experiências e objetivos de carreira de ${professional.name.split(' ')[0]}. Especialista em arquitetura de soluções modernas com foco em escalabilidade e performance.`;

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors bg-white px-4 py-2 border border-slate-200 rounded-xl shadow-sm w-fit"
      >
        <ArrowLeft size={16} /> Voltar para Pool de Talentos
      </button>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className={`w-32 h-32 rounded-full border-4 border-slate-50 shadow-md flex items-center justify-center text-white text-4xl font-bold shrink-0 ${professional.color || 'bg-blue-900'}`}>
          {professional.avatar}
        </div>
        <div className="space-y-3 flex-1">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{professional.name}</h1>
            <p className="text-lg font-medium text-slate-500">{professional.role} {professional.level}</p>
            {professional.superintendency && (
              <p className="text-sm font-bold text-indigo-600 mt-1 flex items-center gap-1.5">
                <Briefcase size={14} />
                {professional.superintendency}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
              professional.status === 'Alocado' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
            }`}>
              {professional.status === 'Alocado' ? `Alocado em: ${professional.dept}` : 'Disponível'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Resumo Profissional</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">{summary}</p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-2">
              <div className="flex items-center gap-2 text-sm text-slate-600 font-bold">
                <Mail size={16} className="text-blue-600" />
                <span className="text-slate-400 font-medium">Email:</span> {professional.name.toLowerCase().replace(' ', '.')}@gov.br
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 font-bold">
                <Phone size={16} className="text-blue-600" />
                <span className="text-slate-400 font-medium">Telefone:</span> (62) 99999-8888
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Mapa de Competências</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="h-[250px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={RADAR_DATA}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }} />
                    <Radar
                      name="Profissional"
                      dataKey="A"
                      stroke="#10b981"
                      strokeWidth={2}
                      fill="#10b981"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 content-start">
                {['Python', 'SQL', 'Tableau', 'Power BI', 'Análise Preditiva', 'React', 'Node.js', 'AWS', 'Docker'].map(skill => (
                  <span key={skill} className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-bold border border-emerald-100/50">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-800">Histórico de Projetos</h3>
            <div className="space-y-4">
              {PROJECT_HISTORY.map((proj, idx) => (
                <div key={idx} className="p-6 rounded-2xl border border-slate-100 bg-slate-50/30 hover:bg-slate-50 transition-colors relative group">
                  <proj.icon size={20} className={`absolute top-6 right-6 ${proj.iconColor} opacity-50 group-hover:opacity-100 transition-opacity`} />
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-base font-bold text-slate-800">{proj.title}</h4>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">Cliente: {proj.client}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{proj.period} | Papel: {proj.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 sticky top-24">
            <h3 className="text-lg font-bold text-slate-800">Alocação Atual</h3>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-800 tracking-tight">Modernização de Legado</h4>
              <p className="text-xs text-slate-400 font-medium">Papel: Arquiteta de Soluções</p>
            </div>
            <div className="space-y-3 pt-4 border-t border-slate-50">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-400">Início:</span>
                <span className="text-slate-700">01/03/2023</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-400">Término Previsto:</span>
                <span className="text-slate-700">31/12/2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
