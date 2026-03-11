
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, ChevronRight, Home, ChevronUp, ChevronDown, 
  Edit3, Check, X, Info, Search, Paperclip, CheckCircle2
} from 'lucide-react';
import { RequestItem } from '../types';
import { NewRequestForm } from './NewRequestForm';
import { Section, Label } from './FormComponents';
import { INITIAL_SUPPORT_TYPES } from '../constants';

interface ViewRequestDetailProps {
  request: RequestItem;
  onBack: () => void;
  onSave?: (updatedRequest: RequestItem) => void;
}

export const ViewRequestDetail: React.FC<ViewRequestDetailProps> = ({ request, onBack, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (isEditing) {
      window.scrollTo(0, 0);
    }
  }, [isEditing]);

  const [sections, setSections] = useState({
    identificacao: true,
    tipoApoio: true,
    detalhes: true,
    solucao: true,
    custos: true,
    talentos: true,
    prazos: true
  });

  const toggleSection = (section: string) => {
    setSections(prev => ({ ...prev, [section]: !prev[section as keyof typeof sections] }));
  };

  const formData = useMemo(() => {
    // Mapping RequestItem to the complex formData structure
    return {
      nomeSolicitante: 'Cassia Eliza Rocha',
      unidadeOrgao: 'SUTIC - Superintendência de Tecnologia da Informação',
      unidadeBasica: '',
      unidadeComplementar: '',
      nomeResponsavelProjeto: 'Cassia Eliza Rocha',
      emailResponsavelProjeto: 'cassiaelizarocha@gmail.com',
      telefoneResponsavelProjeto: '(62) 99999-9999',
      nomeResponsavelTalentos: 'Cassia Eliza Rocha',
      emailResponsavelTalentos: 'cassiaelizarocha@gmail.com',
      
      tipoApoio: request.type || 'Projeto',
      tipoApoioDisponivel: request.supportType || (() => {
        // Try to find a matching support type from constants based on the request data
        // For now, we'll pick the first one that matches the category as a fallback if none found
        const matchingTypes = INITIAL_SUPPORT_TYPES.filter(s => s.category === (request.type || 'Projeto'));
        return matchingTypes.length > 0 ? [matchingTypes[0].title] : [];
      })(),
      nomeOperacao: request.type === 'Operação' ? request.project : '',
      
      codigoGoMAP: request.gomap,
      nomeProjeto: request.project,
      produtosEsperados: request.description,
      vinculoPPA: 'Não',
      iniciativaPPA: '',
      usuariosAfetados: 'Servidores Públicos',
      partesInteressadas: 'Secretarias Estaduais',
      validadoTISetorial: 'Sim',
      tiContribuiraRecursos: 'Sim',
      tiSustentacaoSolucao: 'Sim',
      objetivoEstrategico: 'Sim',
      objetivoEstrategicoDesc: 'Modernização da gestão pública.',
      prioridadeOrgao: 'Sim',
      prioridadeOrgaoExplica: 'Projeto prioritário da SUTIC.',
      prioridadeGoverno: 'Sim',
      justificativa: 'Projeto estratégico para modernização dos fluxos tributários, com impacto direto na arrecadação estadual.',
      motivacao: 'Inovação',
      detalheMotivacao: 'Implementação de novas tecnologias para automação de processos.',
      beneficiosAdmin: 'Redução de tempo de resposta.',
      beneficiosSociedade: 'Melhoria no atendimento ao cidadão.',
      
      portalExpresso: 'Sim',
      servicosPortalExpresso: 'Consulta de débitos, Emissão de certidões',
      escalavel: 'Sim',
      alteracaoProcessos: 'Sim',
      processoImpactado: 'Fluxo de arrecadação',
      demandaraTIC: 'Sim, demandará a criação ou manutenção de produtos de TIC',
      construcoesManutencoesTIC: 'Desenvolvimento de novo módulo fiscal.',
      solucaoTICExistente: 'Não',
      
      novosInvestimentos: 'Sim',
      detalheInvestimentos: 'Aquisição de licenças de software.',
      
      perfisSelecionados: [
        {
          role: 'Desenvolvedor Full Stack',
          talents: [
            {
              id: '1',
              function: 'Desenvolvimento',
              competencies: request.skills,
              startDate: request.startDate,
              endDate: request.endDate
            }
          ]
        }
      ],
      
      dataInicio: request.startDate,
      dataTermino: request.endDate,
      urgenciaPrazo: 'Sim',
      detalheUrgencia: 'Prazo legal para implementação do novo regime fiscal.',
      expectativaDisponibilidade: '1',
      legislacaoRelacionada: 'Imposição no exercício',
      mudancasLegislacao: '1',
      legislacaoAdequacao: 'Lei Complementar 123/2024',

      op_volumeBacklog: 'Médio',
      op_cumprimentoSLA: '80%',
      op_abrangenciaUsuarios: 'Estadual',
      op_criticidadeComplexidade: 'Alta',
      op_riscoInterrupcao: 'Alto',
      op_numeroContratos: '2',
    };
  }, [request]);

  if (isEditing) {
    return (
      <NewRequestForm 
        initialData={formData} 
        onBack={() => setIsEditing(false)} 
        onSave={(updatedData) => {
          if (onSave) {
            // Map formData back to RequestItem
            const updatedRequest: RequestItem = {
              ...request,
              project: updatedData.nomeProjeto || updatedData.nomeOperacao,
              description: updatedData.produtosEsperados,
              type: updatedData.tipoApoio,
              supportType: updatedData.tipoApoioDisponivel,
              startDate: updatedData.dataInicio,
              endDate: updatedData.dataTermino,
            };
            onSave(updatedRequest);
          }
        }}
      />
    );
  }

  const Breadcrumb = () => (
    <div className="flex items-center text-xs text-slate-400 gap-2 mb-8">
      <div className="flex items-center gap-1">
        <Home size={12} />
        <span>Página Inicial</span>
      </div>
      <ChevronRight size={12} className="text-slate-300" />
      <span>Solicitações</span>
      <ChevronRight size={12} className="text-slate-300" />
      <span className="text-slate-600 font-medium">Visualizar Solicitação</span>
    </div>
  );

  const ReadOnlyField = ({ label, value, sub, visible = true }: any) => {
    if (!visible || !value) return null;
    return (
      <div className="space-y-1.5">
        <Label sub={sub}>{label}</Label>
        <div className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 min-h-[42px] flex items-center">
          {value}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <Breadcrumb />

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/50 backdrop-blur-sm p-4 rounded-3xl border border-white/50 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
          >
            <ArrowLeft size={16} /> Voltar
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">Visualizar Solicitação</h1>
            <p className="text-xs text-slate-500 font-medium tracking-tight">Revise os detalhes da solicitação</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="px-4 py-2 bg-amber-400 text-slate-900 rounded-lg text-xs font-black uppercase tracking-wider shadow-sm">
            {request.status}
          </span>
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-2 bg-white border border-blue-600 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-50 transition-all"
          >
            <Edit3 size={16} /> Editar
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-100">
            <Check size={16} /> Aprovar
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 transition-all shadow-md shadow-rose-100">
            <X size={16} /> Reprovar
          </button>
        </div>
      </div>

      {/* 1. Identificação */}
      <Section id="identificacao" title="1. Identificação" isOpen={sections.identificacao} onToggle={toggleSection}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ReadOnlyField label="Nome completo" value={formData.nomeSolicitante} />
          <ReadOnlyField label="Unidade / Órgão" value={formData.unidadeOrgao} />
          <ReadOnlyField label="Responsável pelo Projeto" value={formData.nomeResponsavelProjeto} />
          <ReadOnlyField label="E-mail do Responsável" value={formData.emailResponsavelProjeto} />
          <ReadOnlyField label="Responsável pelos Talentos" value={formData.nomeResponsavelTalentos} />
          <ReadOnlyField label="E-mail do Responsável" value={formData.emailResponsavelTalentos} />
        </div>
      </Section>

      {/* 2. Tipo de Apoio */}
      <Section id="tipoApoio" title="2. Tipo de Apoio" isOpen={sections.tipoApoio} onToggle={toggleSection}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ReadOnlyField label="Apoio em" value={formData.tipoApoio} />
          {formData.tipoApoio === 'Operação' && (
            <ReadOnlyField label="Tipos de Apoio" value={formData.tipoApoioDisponivel.join(', ')} />
          )}
        </div>
      </Section>

      {/* 3. Detalhes */}
      <Section id="detalhes" title={formData.tipoApoio === 'Projeto' ? "3. Detalhes do Projeto" : "3. Detalhamento da Operação"} isOpen={sections.detalhes} onToggle={toggleSection}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formData.tipoApoio === 'Projeto' ? (
            <>
              <ReadOnlyField label="Código GoMAP" value={formData.codigoGoMAP} />
              <ReadOnlyField label="Nome do projeto" value={formData.nomeProjeto} />
              <ReadOnlyField label="Produtos esperados" value={formData.produtosEsperados} />
              <ReadOnlyField label="Vinculado ao PPA?" value={formData.vinculoPPA} />
              <ReadOnlyField label="Objetivo Estratégico?" value={formData.objetivoEstrategico} />
              <ReadOnlyField label="Prioritário para o órgão?" value={formData.prioridadeOrgao} />
              <ReadOnlyField label="Justificativa" value={formData.justificativa} />
              <ReadOnlyField label="Motivação" value={formData.motivacao} />
              <ReadOnlyField label="Detalhe da motivação" value={formData.detalheMotivacao} />
            </>
          ) : (
            <>
              <ReadOnlyField label="Nome da Solicitação" value={formData.nomeOperacao} />
              <ReadOnlyField label="Volume de Backlog" value={formData.op_volumeBacklog} />
              <ReadOnlyField label="Cumprimento de SLA" value={formData.op_cumprimentoSLA} />
              <ReadOnlyField label="Abrangência de Usuários" value={formData.op_abrangenciaUsuarios} />
              <ReadOnlyField label="Criticidade/Complexidade" value={formData.op_criticidadeComplexidade} />
              <ReadOnlyField label="Risco de Interrupção" value={formData.op_riscoInterrupcao} />
              <ReadOnlyField label="Número de Contratos" value={formData.op_numeroContratos} />
            </>
          )}
        </div>
      </Section>

      {/* 4. Solução e processos */}
      <Section id="solucao" title="4. Solução e processos" isOpen={sections.solucao} onToggle={toggleSection} visible={formData.tipoApoio === 'Projeto'}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ReadOnlyField label="Portal Expresso?" value={formData.portalExpresso} />
          <ReadOnlyField label="Escalável?" value={formData.escalavel} />
          <ReadOnlyField label="Alteração de Processos?" value={formData.alteracaoProcessos} />
          <ReadOnlyField label="Demandará TIC?" value={formData.demandaraTIC} />
          <ReadOnlyField label="Construções/Manutenções TIC" value={formData.construcoesManutencoesTIC} />
        </div>
      </Section>

      {/* 5. Custos e investimentos */}
      <Section id="custos" title="5. Custos e investimentos" isOpen={sections.custos} onToggle={toggleSection} visible={formData.tipoApoio === 'Projeto'}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ReadOnlyField label="Novos investimentos?" value={formData.novosInvestimentos} />
          <ReadOnlyField label="Detalhe investimentos" value={formData.detalheInvestimentos} />
        </div>
      </Section>

      {/* 6. Talentos */}
      <Section id="talentos" title={formData.tipoApoio === 'Operação' ? "4. Talentos a serem alocados" : "6. Talentos a serem alocados"} isOpen={sections.talentos} onToggle={toggleSection}>
        <div className="space-y-6">
          {formData.perfisSelecionados.map((profile, idx) => (
            <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <h4 className="text-sm font-bold text-slate-800 mb-4">{profile.role}</h4>
              <div className="space-y-4">
                {profile.talents.map((talent, tIdx) => (
                  <div key={tIdx} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 font-bold uppercase tracking-tighter">Função:</span>
                      <p className="font-bold text-slate-700">{talent.function}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold uppercase tracking-tighter">Competências:</span>
                      <p className="font-bold text-slate-700">{talent.competencies.join(', ')}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold uppercase tracking-tighter">Período:</span>
                      <p className="font-bold text-slate-700">{talent.startDate} - {talent.endDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 7. Prazos e urgência */}
      <Section id="prazos" title="7. Prazos e urgência" isOpen={sections.prazos} onToggle={toggleSection} visible={formData.tipoApoio === 'Projeto'}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ReadOnlyField label="Urgência ou prazo específico?" value={formData.urgenciaPrazo} />
          <ReadOnlyField label="Detalhe urgência" value={formData.detalheUrgencia} />
          <ReadOnlyField label="Expectativa disponibilidade" value={formData.expectativaDisponibilidade} />
          <ReadOnlyField label="Legislação relacionada" value={formData.legislacaoRelacionada} />
          <ReadOnlyField label="Mudanças legislação?" value={formData.mudancasLegislacao} />
          <ReadOnlyField label="Legislação adequação" value={formData.legislacaoAdequacao} />
        </div>
      </Section>
    </div>
  );
};
