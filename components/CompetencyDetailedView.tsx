
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Code, Database, Cloud, Layout, ShieldCheck, 
  ChevronDown, ChevronUp, Users, AlertCircle,
  BarChart3, Info, Search, Filter, Briefcase, FileText,
  User as UserIcon, CheckCircle2
} from 'lucide-react';
import { MacroCompetency } from '@/types';
import { INITIAL_TALENTS } from '@/constants';

const MACRO_COMPETENCIES: MacroCompetency[] = [
  {
    id: 'dev',
    name: 'Desenvolvimento de Sistemas',
    icon: Code,
    color: 'bg-blue-600',
    description: 'Construção, manutenção e evolução de aplicações web, mobile e backend.',
    microSkills: [
      { name: 'Desenvolvimento backend (Java, .NET, Node, etc.)', allocated: 18, total: 20, percent: 90 },
      { name: 'Desenvolvimento frontend (React, Angular, Vue, etc.)', allocated: 15, total: 18, percent: 83 },
      { name: 'Desenvolvimento mobile (Android, iOS, híbrido)', allocated: 6, total: 10, percent: 60 },
      { name: 'Análise de sistemas e modelagem de requisitos', allocated: 12, total: 12, percent: 100 },
      { name: 'Projetos de transformação digital e automação de processos', allocated: 8, total: 10, percent: 80 },
      { name: 'Sistemas de Informação Geográfica (SIG)', allocated: 4, total: 6, percent: 66 },
      { name: 'UX/UI (pesquisa com usuário, prototipação, design system)', allocated: 9, total: 10, percent: 90 },
    ]
  },
  {
    id: 'data',
    name: 'Administração de Dados',
    icon: Database,
    color: 'bg-emerald-600',
    description: 'Gestão estratégica de ativos de dados, BI e Inteligência Artificial.',
    microSkills: [
      { name: 'Administração de banco de dados relacional (PostgreSQL, Oracle, SQL Server)', allocated: 10, total: 10, percent: 100 },
      { name: 'Big Data (Hadoop, Spark, data lake)', allocated: 4, total: 8, percent: 50 },
      { name: 'BI e visualização de dados (Power BI, Tableau, etc.)', allocated: 12, total: 15, percent: 80 },
      { name: 'Ciência de dados (estatística, modelagem preditiva)', allocated: 3, total: 5, percent: 60 },
      { name: 'Inteligência artificial e machine learning', allocated: 2, total: 6, percent: 33 },
      { name: 'Engenharia de dados (pipelines, ETL/ELT, integração de dados)', allocated: 8, total: 10, percent: 80 },
    ]
  },
  {
    id: 'infra',
    name: 'Serviços & Infraestrutura',
    icon: Cloud,
    color: 'bg-indigo-500',
    description: 'Cibersegurança, DevOps e gestão de infraestrutura física e em nuvem.',
    microSkills: [
      { name: 'Cibersegurança (monitoramento, resposta a incidentes, hardening)', allocated: 7, total: 8, percent: 87 },
      { name: 'DevOps (CI/CD, automação, containers, observabilidade)', allocated: 12, total: 14, percent: 85 },
      { name: 'Administração de servidores e redes', allocated: 10, total: 12, percent: 83 },
      { name: 'Suporte técnico e manutenção de equipamentos de informática', allocated: 20, total: 25, percent: 80 },
      { name: 'Gestão de ambientes em nuvem (AWS, Azure, GCP ou nuvem governamental)', allocated: 9, total: 10, percent: 90 },
    ]
  },
  {
    id: 'proj',
    name: 'Gestão de Projetos de TIC',
    icon: BarChart3,
    color: 'bg-amber-500',
    description: 'Metodologias de gestão, controle de riscos e stakeholders.',
    microSkills: [
      { name: 'Planejamento e acompanhamento de cronogramas e escopo', allocated: 10, total: 12, percent: 83 },
      { name: 'Gestão de riscos e issues de projetos de TI', allocated: 8, total: 10, percent: 80 },
      { name: 'Gestão de stakeholders e comunicação', allocated: 12, total: 12, percent: 100 },
      { name: 'Conhecimento em métodos ágeis (Scrum, Kanban) e híbridos', allocated: 15, total: 15, percent: 100 },
    ]
  },
  {
    id: 'contratos',
    name: 'Gestão de Contratos de TIC',
    icon: FileText,
    color: 'bg-purple-600',
    description: 'Fiscalização, editais e conformidade legal em aquisições de TIC.',
    microSkills: [
      { name: 'Elaboração de especificações técnicas de TIC', allocated: 6, total: 8, percent: 75 },
      { name: 'Acompanhamento de SLAs e níveis de serviço', allocated: 5, total: 6, percent: 83 },
      { name: 'Fiscalização técnica de contratos (entregas, medições, aceite)', allocated: 10, total: 10, percent: 100 },
      { name: 'Conhecimento de compras públicas de TI (termos de referência, editais)', allocated: 4, total: 6, percent: 66 },
    ]
  }
];

export const CompetencyDetailedView: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>('dev');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCompetencies = MACRO_COMPETENCIES.filter(comp => 
    comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comp.microSkills.some(skill => skill.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Helper para mapear talentos para microcompetências
  const getTalentsForMicroSkill = (microSkillName: string) => {
    // Lógica simples de busca por palavra-chave para demonstração
    const keywords = microSkillName.toLowerCase().replace(/[(),. ]/g, ' ').split(' ').filter(k => k.length > 2);
    
    return INITIAL_TALENTS.filter(talent => {
      return talent.skills.some(skill => {
        const skillLower = skill.toLowerCase();
        return keywords.some(k => skillLower.includes(k) || k.includes(skillLower));
      }) || talent.role.toLowerCase().includes(keywords[0]);
    }).slice(0, 4); // Limitar a 4 para não quebrar o layout
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mapa de Competências</h1>
          <p className="text-slate-500 text-sm">Detalhamento técnico e análise de capacidade por tecnologia.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar competência..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 ring-emerald-100 transition-all font-medium"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredCompetencies.map((comp) => {
          const isExpanded = expandedId === comp.id;
          const totalAllocated = comp.microSkills.reduce((acc, s) => acc + s.allocated, 0);
          const totalCapacity = comp.microSkills.reduce((acc, s) => acc + s.total, 0);
          const avgPercent = Math.round((totalAllocated / totalCapacity) * 100);

          return (
            <div 
              key={comp.id} 
              className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden ${
                isExpanded ? 'border-emerald-200 shadow-lg' : 'border-slate-200 shadow-sm hover:border-slate-300'
              }`}
            >
              <div 
                onClick={() => setExpandedId(isExpanded ? null : comp.id)}
                className="p-6 md:p-8 flex items-center gap-6 cursor-pointer select-none"
              >
                <div className={`w-16 h-16 rounded-2xl ${comp.color} text-white flex items-center justify-center shrink-0 shadow-lg transition-transform group-hover:scale-105`}>
                  <comp.icon size={32} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-slate-800">{comp.name}</h3>
                    {avgPercent >= 95 && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-tighter border border-rose-100">
                        <AlertCircle size={10} /> Escassez Crítica
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 font-medium line-clamp-1">{comp.description}</p>
                </div>

                <div className="hidden md:flex flex-col items-end mr-8">
                  <div className="flex items-center gap-2 text-slate-800 font-black">
                    <Users size={16} className="text-slate-400" />
                    {totalAllocated} / {totalCapacity}
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Ocupação Média: {avgPercent}%</p>
                </div>

                <div className={`p-2 rounded-full transition-all ${isExpanded ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                  {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
              </div>

              {isExpanded && (
                <div className="px-8 pb-8 pt-2 animate-in slide-in-from-top-4 duration-300">
                  <div className="h-px bg-slate-100 w-full mb-8"></div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    {comp.microSkills.map((micro, idx) => {
                      const associatedTalents = getTalentsForMicroSkill(micro.name);
                      
                      return (
                        <div key={idx} className="space-y-4 group">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">
                              {micro.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-slate-400">{micro.allocated} / {micro.total}</span>
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                                micro.percent >= 90 ? 'bg-rose-100 text-rose-700' : 
                                micro.percent >= 70 ? 'bg-amber-100 text-amber-700' : 
                                'bg-emerald-100 text-emerald-700'
                              }`}>
                                {micro.percent}%
                              </span>
                            </div>
                          </div>
                          
                          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                            <div 
                              className={`h-full transition-all duration-1000 ease-out rounded-full ${
                                micro.percent >= 90 ? 'bg-rose-500' : 
                                micro.percent >= 70 ? 'bg-amber-500' : 
                                'bg-emerald-500'
                              }`}
                              style={{ width: `${micro.percent}%` }}
                            />
                          </div>

                          {/* Seção de Profissionais Associados */}
                          <div className="pt-2">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <UserIcon size={12} /> Talentos Referência
                              </h5>
                              <span className="text-[10px] font-bold text-slate-300">{associatedTalents.length} especialistas</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {associatedTalents.length > 0 ? (
                                associatedTalents.map((talent) => (
                                  <div 
                                    key={talent.id} 
                                    className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-lg p-1.5 pr-3 hover:border-emerald-200 hover:bg-emerald-50 transition-all cursor-default group/talent"
                                    title={`${talent.name} - ${talent.role}`}
                                  >
                                    <div className={`w-6 h-6 rounded-md ${talent.color} text-white flex items-center justify-center text-[8px] font-black shadow-sm`}>
                                      {talent.avatar}
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[10px] font-bold text-slate-700 group-hover/talent:text-emerald-700 truncate max-w-[80px] leading-tight">
                                        {talent.name.split(' ')[0]} {talent.name.split(' ').pop()?.[0]}.
                                      </span>
                                      <div className="flex items-center gap-1">
                                        <div className={`w-1 h-1 rounded-full ${talent.status === 'Alocado' ? 'bg-blue-400' : 'bg-emerald-400'}`}></div>
                                        <span className="text-[8px] font-medium text-slate-400 uppercase tracking-tighter">{talent.status}</span>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-[10px] text-slate-300 font-medium italic">Nenhum talento associado diretamente.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
                    <div className="p-2 bg-white rounded-xl shadow-sm text-indigo-600 shrink-0">
                      <Info size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Diretriz de Gestão</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Mantenha o monitoramento constante das microcompetências com ocupação acima de 85%. Em casos de escassez crítica (95%+), priorize a abertura imediata de novos credenciamentos para evitar gargalos nos projetos governamentais.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
