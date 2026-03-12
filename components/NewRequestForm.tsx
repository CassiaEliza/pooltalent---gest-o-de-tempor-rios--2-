import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, ChevronUp, ChevronDown, Plus, Minus, 
  Calendar, CheckCircle2, Info, HelpCircle, Tag, Briefcase,
  User, Building2, Target, Zap, DollarSign, Users, Clock, Paperclip,
  Search, FileText, Globe, Share2, Settings, Shield, AlertCircle, Trash2, X
} from 'lucide-react';

// availability options for a cargo selected within a support type
// (matches the values stored in constants for role objects)
type RoleAvailability = 'Projeto' | 'Operação' | 'Operação e Projeto';
import { INITIAL_SUPPORT_TYPES, MASTER_ROLES, FUNCTIONS, COMPETENCIES } from '../constants';
import { Label, Input, Select, TextArea, Section } from './FormComponents';

interface NewRequestFormProps {
  onBack: () => void;
  initialData?: any;
  onSave?: (data: any) => void;
}

const currentUser = {
  name: 'Cassia Eliza Rocha',
  email: 'cassiaelizarocha@gmail.com',
  unit: 'SUTIC - Superintendência de Tecnologia da Informação'
};

export const NewRequestForm: React.FC<NewRequestFormProps> = ({ onBack, initialData, onSave }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [termoAberturaAttached, setTermoAberturaAttached] = useState(false);
  const [formData, setFormData] = useState(initialData || {
    // Section 1
    nomeSolicitante: currentUser.name,
    unidadeOrgao: currentUser.unit,
    unidadeBasica: '',
    unidadeComplementar: '',
    nomeResponsavelProjeto: currentUser.name,
    emailResponsavelProjeto: currentUser.email,
    telefoneResponsavelProjeto: '',
    nomeResponsavelTalentos: currentUser.name,
    emailResponsavelTalentos: currentUser.email,
    
    // Section 2
    tipoApoio: '' as 'Projeto' | 'Operação' | '',
    tipoApoioDisponivel: [] as string[],
    nomeOperacao: '',
    
    // Section 3
    codigoGoMAP: '',
    nomeProjeto: '',
    produtosEsperados: '',
    vinculoPPA: '' as 'Sim' | 'Não' | '',
    iniciativaPPA: '',
    usuariosAfetados: '',
    partesInteressadas: '',
    validadoTISetorial: '',
    tiContribuiraRecursos: '',
    tiSustentacaoSolucao: '',
    objetivoEstrategico: '' as 'Sim' | 'Não' | '',
    objetivoEstrategicoDesc: '',
    prioridadeOrgao: '' as 'Sim' | 'Não' | '',
    prioridadeOrgaoExplica: '',
    prioridadeGoverno: '',
    justificativa: '',
    motivacao: '',
    detalheMotivacao: '',
    beneficiosAdmin: '',
    beneficiosSociedade: '',
    
    // Section 4
    portalExpresso: '' as 'Sim' | 'Não' | 'Parcialmente' | '',
    servicosPortalExpresso: '',
    escalavel: '',
    alteracaoProcessos: '',
    processoImpactado: '',
    demandaraTIC: '',
    construcoesManutencoesTIC: '',
    solucaoTICExistente: '',
    
    // Section 5
    novosInvestimentos: '',
    detalheInvestimentos: '',
    
    // Section 6
    perfisSelecionados: [] as { 
      role: string, 
      talents: { 
        id: string,
        function: string, 
        competencies: string[], 
        startDate: string, 
        endDate: string 
      }[] 
    }[],
    
    // Section 7
    dataInicio: '',
    dataTermino: '',
    urgenciaPrazo: '' as 'Sim' | 'Não' | '',
    detalheUrgencia: '',
    expectativaDisponibilidade: '',
    legislacaoRelacionada: '',
    mudancasLegislacao: '',
    legislacaoAdequacao: '',

    // Operação Fields
    op_volumeBacklog: '',
    op_cumprimentoSLA: '',
    op_abrangenciaUsuarios: '',
    op_criticidadeComplexidade: '',
    op_riscoInterrupcao: '',
    op_numeroContratos: '',
    op_naoConformidades: '',
    op_prazosCriticos: '',
    op_volumeEntregas: '',
    op_riscoContratual: '',
    op_dependenciaContrato: '',
    op_evidenciasAuditoria: '',
    op_complexidadeTecnicaContrato: '',
  });

  const [sections, setSections] = useState({
    identificacao: true,
    tipoApoio: true,
    detalhesProjeto: true,
    detalhesOperacao: true,
    como: true,
    quanto: true,
    perfis: true,
    quando: true,
    anexo: true
  });

  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleInputChange = (field: string, value: any) => {
    if (field === 'tipoApoio') {
      if (formData.tipoApoio !== value) {
        setFormData(prev => ({ ...prev, [field]: value, tipoApoioDisponivel: [] }));
      }
    } else if (field === 'tipoApoioDisponivel') {
      const current = formData.tipoApoioDisponivel;
      if (current.includes(value)) {
        setFormData(prev => ({ ...prev, [field]: current.filter(v => v !== value) }));
      } else {
        setFormData(prev => ({ ...prev, [field]: [...current, value] }));
      }
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleGoMAPChange = (id: string) => {
    handleInputChange('codigoGoMAP', id);
    // Mock integration
    if (id === '123') {
      handleInputChange('nomeProjeto', 'Projeto de Modernização STI');
      handleInputChange('justificativa', 'Necessidade de atualizar o parque tecnológico para suportar novas demandas de IA.');
    } else if (id === '456') {
      handleInputChange('nomeProjeto', 'Expansão de Infraestrutura Cloud');
      handleInputChange('justificativa', 'Migração de serviços críticos para nuvem visando alta disponibilidade.');
    } else {
      handleInputChange('nomeProjeto', '');
    }
  };

  const addTalent = (roleName: string) => {
    const newPerfis = formData.perfisSelecionados.map(p => {
      if (p.role === roleName) {
        return {
          ...p,
          talents: [
            ...p.talents,
            { id: Math.random().toString(36).substr(2, 9), function: '', competencies: [], startDate: '', endDate: '' }
          ]
        };
      }
      return p;
    });
    handleInputChange('perfisSelecionados', newPerfis);
  };

  const removeTalent = (roleName: string, talentId: string) => {
    const newPerfis = formData.perfisSelecionados.map(p => {
      if (p.role === roleName) {
        const filteredTalents = p.talents.filter(t => t.id !== talentId);
        if (filteredTalents.length === 0) {
          // If no talents left, we might want to keep the role but it will be invalid
          // Or we could remove the role entirely, but let's keep it for now
          return { ...p, talents: [] };
        }
        return {
          ...p,
          talents: filteredTalents
        };
      }
      return p;
    });
    handleInputChange('perfisSelecionados', newPerfis);
  };

  const updateTalent = (roleName: string, talentId: string, field: string, value: any) => {
    const newPerfis = formData.perfisSelecionados.map(p => {
      if (p.role === roleName) {
        return {
          ...p,
          talents: p.talents.map(t => t.id === talentId ? { ...t, [field]: value } : t)
        };
      }
      return p;
    });
    handleInputChange('perfisSelecionados', newPerfis);
  };

  const filteredSupportTypes = useMemo(() => {
    if (!formData.tipoApoio) return [];
    return INITIAL_SUPPORT_TYPES.filter(s => s.category === formData.tipoApoio);
  }, [formData.tipoApoio]);

  const isSection1Valid = useMemo(() => {
    return !!(
      formData.unidadeBasica && 
      formData.unidadeComplementar && 
      formData.nomeResponsavelProjeto && 
      formData.emailResponsavelProjeto &&
      formData.telefoneResponsavelProjeto &&
      formData.nomeResponsavelTalentos &&
      formData.emailResponsavelTalentos
    );
  }, [
    formData.unidadeBasica, 
    formData.unidadeComplementar, 
    formData.nomeResponsavelProjeto, 
    formData.emailResponsavelProjeto,
    formData.telefoneResponsavelProjeto,
    formData.nomeResponsavelTalentos,
    formData.emailResponsavelTalentos
  ]);

  const isSection2Valid = useMemo(() => {
    return !!(formData.tipoApoio && formData.tipoApoioDisponivel.length > 0);
  }, [formData.tipoApoio, formData.tipoApoioDisponivel]);

  const isFormValid = useMemo(() => {
    // Both Section 1 and Section 2 must be valid for the whole form to be valid
    if (!isSection1Valid || !isSection2Valid) return false;
    
    if (formData.tipoApoio === 'Projeto') {
      // Section 3
      if (!formData.codigoGoMAP || !formData.produtosEsperados || !formData.vinculoPPA || !formData.usuariosAfetados || !formData.partesInteressadas || !formData.validadoTISetorial || !formData.tiContribuiraRecursos || !formData.tiSustentacaoSolucao || !formData.objetivoEstrategico || !formData.prioridadeOrgao || !formData.prioridadeGoverno || !formData.motivacao || !formData.detalheMotivacao || !formData.beneficiosAdmin || !formData.beneficiosSociedade || !termoAberturaAttached) return false;
      
      // Conditional Section 3
      if (formData.vinculoPPA === 'Sim' && !formData.iniciativaPPA) return false;
      if (formData.objetivoEstrategico === 'Sim' && !formData.objetivoEstrategicoDesc) return false;
      if (formData.prioridadeOrgao === 'Sim' && !formData.prioridadeOrgaoExplica) return false;
      
      // Section 4
      if (!formData.portalExpresso || !formData.escalavel || !formData.alteracaoProcessos || !formData.demandaraTIC) return false;
      if ((formData.portalExpresso === 'Sim' || formData.portalExpresso === 'Parcialmente') && !formData.servicosPortalExpresso) return false;
      if (formData.alteracaoProcessos === '1' && !formData.processoImpactado) return false;
      if (formData.demandaraTIC?.startsWith('Sim') && !formData.construcoesManutencoesTIC) return false;
      if (formData.demandaraTIC?.startsWith('Sim') && !formData.solucaoTICExistente) return false;

      // Section 5
      if (!formData.novosInvestimentos) return false;
      if (formData.novosInvestimentos === '2' && !formData.detalheInvestimentos) return false;

      // Section 6
      if (formData.perfisSelecionados.length === 0) return false;
      const allTalentsValid = formData.perfisSelecionados.every(p => 
        p.talents.length > 0 && p.talents.every(t => t.function && t.startDate && t.endDate)
      );
      if (!allTalentsValid) return false;

      // Section 7
      if (!formData.urgenciaPrazo || !formData.expectativaDisponibilidade || !formData.legislacaoRelacionada || !formData.mudancasLegislacao) return false;
      if (formData.urgenciaPrazo === 'Sim' && !formData.detalheUrgencia) return false;
      if (formData.mudancasLegislacao === '1' && !formData.legislacaoAdequacao) return false;
    }
    
    if (formData.tipoApoio === 'Operação') {
      if (!formData.nomeOperacao) return false;
      
      const hasAtendimento = formData.tipoApoioDisponivel.includes('Apoio para Atendimento ao Usuário');
      const hasContratos = formData.tipoApoioDisponivel.includes('Apoio para Gestão de Contratos');
      
      if (hasAtendimento) {
        if (!formData.op_volumeBacklog || !formData.op_cumprimentoSLA || !formData.op_abrangenciaUsuarios || !formData.op_criticidadeComplexidade || !formData.op_riscoInterrupcao) return false;
      }
      
      if (hasContratos) {
        if (!formData.op_numeroContratos || !formData.op_naoConformidades || !formData.op_prazosCriticos || !formData.op_volumeEntregas || !formData.op_riscoContratual || !formData.op_dependenciaContrato || !formData.op_evidenciasAuditoria || !formData.op_complexidadeTecnicaContrato) return false;
      }

      if (formData.tipoApoioDisponivel.length === 0) return false;

      // Even for operation, we need profiles
      if (formData.perfisSelecionados.length === 0) return false;
      const allTalentsValid = formData.perfisSelecionados.every(p => 
        p.talents.length > 0 && p.talents.every(t => t.function && t.startDate && t.endDate)
      );
      if (!allTalentsValid) return false;
      if (!formData.urgenciaPrazo) return false;
      if (formData.urgenciaPrazo === 'Sim' && !formData.detalheUrgencia) return false;
    }

    return true;
  }, [formData, termoAberturaAttached]);

  const handleSubmit = () => {
    // Basic validation could go here
    if (onSave) {
      onSave(formData);
    }
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-50">
          <CheckCircle2 size={48} />
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Solicitação Enviada!</h1>
          <p className="text-slate-500 font-medium max-w-md mx-auto">
            Sua demanda foi registrada com sucesso sob o protocolo <span className="font-mono font-bold text-blue-600">#SOL-2024-082</span>.
            Você receberá notificações via E-mail, Teams e no Sistema sobre o progresso da análise.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <button 
            onClick={onBack}
            className="w-full sm:w-auto px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
          >
            Voltar para Solicitações
          </button>
          <button 
            onClick={() => setIsSubmitted(false)}
            className="w-full sm:w-auto px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all"
          >
            Nova Solicitação
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
      <button 
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-widest group"
      >
        <div className="p-1.5 bg-white border border-slate-200 rounded-lg group-hover:border-slate-300 shadow-sm transition-all">
          <ArrowLeft size={14} />
        </div>
        Voltar para Solicitações
      </button>

      <div className="space-y-2 mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Nova Solicitação de Apoio</h1>
        <p className="text-sm text-slate-500 font-medium">Preencha os campos abaixo para submeter sua demanda à STI.</p>
      </div>

      {/* 1. Campos de identificação */}
      <Section id="identificacao" title="1. Identificação" isOpen={sections.identificacao} onToggle={toggleSection}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Nome completo</Label>
            <Input value={formData.nomeSolicitante} disabled />
          </div>
          <div>
            <Label>Unidade/Órgão</Label>
            <Input value={formData.unidadeOrgao} disabled />
          </div>
          <div>
            <Label required sub="Informe a unidade básica dentro do órgão responsável pelo projeto.">Unidade Básica</Label>
            <Input 
              placeholder="Ex: Superintendência de Tecnologia" 
              value={formData.unidadeBasica}
              onChange={(e) => handleInputChange('unidadeBasica', e.target.value)}
            />
          </div>
          <div>
            <Label required sub="Informe a unidade complementar dentro do órgão responsável pelo projeto.">Unidade Complementar</Label>
            <Input 
              placeholder="Ex: Gerência de Sistemas" 
              value={formData.unidadeComplementar}
              onChange={(e) => handleInputChange('unidadeComplementar', e.target.value)}
            />
          </div>
          <div>
            <Label required sub="Preencha com o nome completo do responsável pelo projeto.">Nome do responsável pelo projeto</Label>
            <Input 
              value={formData.nomeResponsavelProjeto}
              onChange={(e) => handleInputChange('nomeResponsavelProjeto', e.target.value)}
            />
          </div>
          <div>
            <Label required sub="Preencha com o e-mail do responsável pelo projeto. Por padrão, o campo é preenchido com os dados de quem está solicitando.">E-mail do responsável pelo projeto</Label>
            <Input 
              value={formData.emailResponsavelProjeto}
              onChange={(e) => handleInputChange('emailResponsavelProjeto', e.target.value)}
            />
          </div>
          <div>
            <Label required sub="Telefone de contato do responsável pelo projeto.">Telefone do Responsável pelo projeto</Label>
            <Input 
              placeholder="(62) 99999-9999"
              value={formData.telefoneResponsavelProjeto}
              onChange={(e) => handleInputChange('telefoneResponsavelProjeto', e.target.value)}
            />
          </div>
          <div>
            <Label required sub="Preencha com o nome completo de quem será o responsável direto pelos talentos alocados dentro do órgão.">Nome do responsável pelos talentos</Label>
            <Input 
              value={formData.nomeResponsavelTalentos}
              onChange={(e) => handleInputChange('nomeResponsavelTalentos', e.target.value)}
            />
          </div>
          <div>
            <Label required sub="Preencha com o e-mail de quem será o responsável direto pelos talentos alocados dentro do órgão.">E-mail do responsável pelos talentos</Label>
            <Input 
              value={formData.emailResponsavelTalentos}
              onChange={(e) => handleInputChange('emailResponsavelTalentos', e.target.value)}
            />
          </div>
        </div>
      </Section>

      {/* 2. Tipo de apoio */}
      <Section id="tipoApoio" title="2. Tipo de Apoio" isOpen={sections.tipoApoio} onToggle={toggleSection}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <Label required sub="Selecione se é para apoio em Projeto ou Operação.">Apoio em</Label>
            <div className="flex gap-4 mt-2">
              {['Projeto', 'Operação'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleInputChange('tipoApoio', type)}
                  className={`flex-1 py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                    formData.tipoApoio === type 
                      ? 'border-blue-600 bg-blue-50 text-blue-700 ring-4 ring-blue-50' 
                      : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <Label required sub="Selecione um ou mais tipos de apoio específicos desejados.">Tipo de Apoio Disponível</Label>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {filteredSupportTypes.length > 0 ? (
                filteredSupportTypes.map((support) => (
                  <label 
                    key={support.id} 
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                      formData.tipoApoioDisponivel.includes(support.title)
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    <input 
                      type="checkbox"
                      className="hidden"
                      checked={formData.tipoApoioDisponivel.includes(support.title)}
                      onChange={() => handleInputChange('tipoApoioDisponivel', support.title)}
                    />
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      formData.tipoApoioDisponivel.includes(support.title)
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}>
                      {formData.tipoApoioDisponivel.includes(support.title) && <CheckCircle2 size={12} />}
                    </div>
                    <span className="text-sm font-bold">{support.title}</span>
                  </label>
                ))
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center">
                  <p className="text-xs text-slate-400 font-medium italic">Selecione o tipo de apoio acima primeiro</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {formData.tipoApoio === 'Operação' && formData.tipoApoioDisponivel.length === 0 && (
          <div className="mt-8 p-6 bg-amber-50 border border-amber-100 rounded-2xl flex gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="p-2 bg-white rounded-xl text-amber-500 h-fit shadow-sm">
              <Info size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900">Selecione o Apoio Disponível</p>
              <p className="text-xs text-amber-700 leading-relaxed mt-1">
                Para solicitações do tipo <strong>Operação</strong>, selecione o apoio específico acima para visualizar as perguntas detalhadas.
              </p>
            </div>
          </div>
        )}

        {formData.tipoApoio === 'Projeto' && formData.tipoApoioDisponivel.length === 0 && (
          <div className="mt-8 p-6 bg-amber-50 border border-amber-100 rounded-2xl flex gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="p-2 bg-white rounded-xl text-amber-500 h-fit shadow-sm">
              <Info size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900">Selecione o Apoio Disponível</p>
              <p className="text-xs text-amber-700 leading-relaxed mt-1">
                Para solicitações do tipo <strong>Projeto</strong>, selecione o apoio específico acima para prosseguir com o detalhamento.
              </p>
            </div>
          </div>
        )}
      </Section>

      <Section 
        id="detalhesOperacao" 
        title={formData.tipoApoio === 'Operação' ? "3. Detalhamento da Operação" : "3. Detalhes da Operação"} 
        isOpen={sections.detalhesOperacao}
        onToggle={toggleSection}
        visible={formData.tipoApoio === 'Operação' && isSection2Valid}
      >
        <div className="mb-6">
          <Label required sub="Informe o nome da solicitação de operação.">Nome da Solicitação</Label>
          <Input 
            placeholder="Ex: Suporte Operacional SUTIC" 
            value={formData.nomeOperacao}
            onChange={(e) => handleInputChange('nomeOperacao', e.target.value)}
          />
        </div>

        {formData.tipoApoioDisponivel.includes('Apoio para Atendimento ao Usuário') && (
          <div className="grid grid-cols-1 gap-6">
            <div>
              <Label required sub="Considere tanto a quantidade de atendimentos atuais quanto as pendências acumuladas.">Como está o volume de chamados/demandas e o backlog dessa área hoje?</Label>
              <Select value={formData.op_volumeBacklog} onChange={(e) => handleInputChange('op_volumeBacklog', e.target.value)}>
                <option value="">Selecione uma opção</option>
                <option value="Volume muito acima da capacidade, com backlog crítico que afeta a operação">Volume muito acima da capacidade, com backlog crítico que afeta a operação</option>
                <option value="Volume crescente, com tendência de estrangulamento e backlog moderado">Volume crescente, com tendência de estrangulamento e backlog moderado</option>
                <option value="Volume estável, absorvível, com backlog pequeno ou inexistente">Volume estável, absorvível, com backlog pequeno ou inexistente</option>
              </Select>
            </div>
            <div>
              <Label required sub="Avalie se os prazos e metas de atendimento estão sendo cumpridos.">Como está o cumprimento dos SLAs de atendimento nessa área?</Label>
              <Select value={formData.op_cumprimentoSLA} onChange={(e) => handleInputChange('op_cumprimentoSLA', e.target.value)}>
                <option value="">Selecione uma opção</option>
                <option value="SLA sistematicamente descumprido">SLA sistematicamente descumprido</option>
                <option value="Há risco de descumprimento em curto/médio prazo">Há risco de descumprimento em curto/médio prazo</option>
                <option value="SLA está sendo atendido">SLA está sendo atendido</option>
              </Select>
            </div>
            <div>
              <Label required sub="Pense em quantas pessoas/unidades dependem diretamente desse suporte.">Qual a abrangência dos usuários impactados por esse atendimento?</Label>
              <Select value={formData.op_abrangenciaUsuarios} onChange={(e) => handleInputChange('op_abrangenciaUsuarios', e.target.value)}>
                <option value="">Selecione uma opção</option>
                <option value="Atende todo o órgão ou vários órgãos">Atende todo o órgão ou vários órgãos</option>
                <option value="Atende uma unidade grande">Atende uma unidade grande</option>
                <option value="Atende um setor restrito">Atende um setor restrito</option>
              </Select>
            </div>
            <div>
              <Label required sub="Avalie se a falta de reforço pode parar o serviço e o nível de especialização necessário.">Qual o impacto na continuidade do serviço e a complexidade técnica das atividades?</Label>
              <Select value={formData.op_criticidadeComplexidade} onChange={(e) => handleInputChange('op_criticidadeComplexidade', e.target.value)}>
                <option value="">Selecione uma opção</option>
                <option value="Sem reforço, há risco de parada do serviço; atividades críticas/contínuas">Sem reforço, há risco de parada do serviço; atividades críticas/contínuas</option>
                <option value="Degradação relevante do serviço; atividades de complexidade moderada">Degradação relevante do serviço; atividades de complexidade moderada</option>
                <option value="Impacto limitado; atividades simples e repetitivas">Impacto limitado; atividades simples e repetitivas</option>
              </Select>
            </div>
            <div>
              <Label required sub="Considere riscos documentados, incidentes recentes ou alertas formais.">Qual o nível de risco de interrupção do serviço, considerando riscos já identificados?</Label>
              <Select value={formData.op_riscoInterrupcao} onChange={(e) => handleInputChange('op_riscoInterrupcao', e.target.value)}>
                <option value="">Selecione uma opção</option>
                <option value="Interrupção iminente ou muito provável">Interrupção iminente ou muito provável</option>
                <option value="Risco moderado de interrupção">Risco moderado de interrupção</option>
                <option value="Risco baixo de interrupção">Risco baixo de interrupção</option>
              </Select>
            </div>
          </div>
        )}

        {formData.tipoApoioDisponivel.includes('Apoio para Gestão de Contratos') && (
          <div className="grid grid-cols-1 gap-6">
            <div>
              <Label required sub="Leve em conta o número de contratos e se eles possuem escopo mais simples ou complexo.">Quantos contratos, e com qual complexidade, serão geridos nessa demanda?</Label>
              <Select value={formData.op_numeroContratos} onChange={(e) => handleInputChange('op_numeroContratos', e.target.value)}>
                <option value="">Selecione uma opção</option>
                <option value="Mais de 3 contratos complexos">Mais de 3 contratos complexos</option>
                <option value="Entre 1 e 3 contratos">Entre 1 e 3 contratos</option>
                <option value="Apenas um contrato simples">Apenas um contrato simples</option>
              </Select>
            </div>
            <div>
              <Label required sub="Considere apenas não conformidades registradas oficialmente (relatórios, autos, ofícios etc.).">Qual o cenário atual de não conformidades registradas nesses contratos?</Label>
              <Select value={formData.op_naoConformidades} onChange={(e) => handleInputChange('op_naoConformidades', e.target.value)}>
                <option value="">Selecione uma opção</option>
                <option value="Não conformidades graves ou recorrentes">Não conformidades graves ou recorrentes</option>
                <option value="Não conformidades moderadas">Não conformidades moderadas</option>
                <option value="Sem registros relevantes de não conformidades">Sem registros relevantes de não conformidades</option>
              </Select>
            </div>
            <div>
              <Label required sub="Avalie proximidade de término de vigência, entregas obrigatórias e marcos formais.">Como estão os prazos críticos de vigência, entregas e marcos contratuais?</Label>
              <Select value={formData.op_prazosCriticos} onChange={(e) => handleInputChange('op_prazosCriticos', e.target.value)}>
                <option value="">Selecione uma opção</option>
                <option value="Vigência próxima ao fim, entregas obrigatórias ou prazos formais críticos">Vigência próxima ao fim, entregas obrigatórias ou prazos formais críticos</option>
                <option value="Entregas relevantes, mas não críticas">Entregas relevantes, mas não críticas</option>
                <option value="Prazos distantes, sem pressões imediatas">Prazos distantes, sem pressões imediatas</option>
              </Select>
            </div>
            <div>
              <Label required sub="Inclua relatórios, produtos, serviços entregues e demais itens que exigem conferência formal.">Qual é o volume de entregas que precisam ser conferidas pelo fiscal?</Label>
              <Select value={formData.op_volumeEntregas} onChange={(e) => handleInputChange('op_volumeEntregas', e.target.value)}>
                <option value="">Selecione uma opção</option>
                <option value="Múltiplas entregas mensais complexas">Múltiplas entregas mensais complexas</option>
                <option value="Volume moderado de entregas">Volume moderado de entregas</option>
                <option value="Poucas entregas a conferir">Poucas entregas a conferir</option>
              </Select>
            </div>
            <div>
              <Label required sub="Considere possibilidade de glosas, multas, sanções ou prejuízo ao erário.">Qual o nível de risco contratual, legal ou financeiro envolvido?</Label>
              <Select value={formData.op_riscoContratual} onChange={(e) => handleInputChange('op_riscoContratual', e.target.value)}>
                <option value="">Selecione uma opção</option>
                <option value="Risco de glosa, multas, penalidades ou prejuízo ao erário">Risco de glosa, multas, penalidades ou prejuízo ao erário</option>
                <option value="Riscos moderados, porém controláveis">Riscos moderados, porém controláveis</option>
                <option value="Contrato estável, com riscos baixos">Contrato estável, com riscos baixos</option>
              </Select>
            </div>
            <div>
              <Label required sub="Avalie se a interrupção desse contrato paralisa serviços essenciais do órgão.">Quão crítico é este contrato para a continuidade do serviço?</Label>
              <Select value={formData.op_dependenciaContrato} onChange={(e) => handleInputChange('op_dependenciaContrato', e.target.value)}>
                <option value="">Selecione uma opção</option>
                <option value="Sustenta operação crítica ou essencial">Sustenta operação crítica ou essencial</option>
                <option value="Contrato relevante, mas não crítico">Contrato relevante, mas não crítico</option>
                <option value="Impacto limitado em caso de problemas">Impacto limitado em caso de problemas</option>
              </Select>
            </div>
            <div>
              <Label required sub="Considere auditorias em andamento, recomendações formais e exigências de prestação de contas.">Qual a necessidade atual de evidências e organização para auditorias/órgãos de controle?</Label>
              <Select value={formData.op_evidenciasAuditoria} onChange={(e) => handleInputChange('op_evidenciasAuditoria', e.target.value)}>
                <option value="">Selecione uma opção</option>
                <option value="Auditorias vigentes, recomendações de TCE ou exigências formais fortes">Auditorias vigentes, recomendações de TCE ou exigências formais fortes</option>
                <option value="Necessidade de organização periódica de evidências">Necessidade de organização periódica de evidências</option>
                <option value="Sem exigências externas relevantes">Sem exigências externas relevantes</option>
              </Select>
            </div>
            <div>
              <Label required sub="Avalie se o contrato envolve tecnologias, integrações ou múltiplos serviços especializados.">Qual é a complexidade técnica do escopo contratado?</Label>
              <Select value={formData.op_complexidadeTecnicaContrato} onChange={(e) => handleInputChange('op_complexidadeTecnicaContrato', e.target.value)}>
                <option value="">Selecione uma opção</option>
                <option value="Serviços altamente técnicos ou envolvendo múltiplos serviços">Serviços altamente técnicos ou envolvendo múltiplos serviços</option>
                <option value="Serviços de complexidade moderada">Serviços de complexidade moderada</option>
                <option value="Contratos administrativos simples">Contratos administrativos simples</option>
              </Select>
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label required sub="Indique se há uma data limite ou evento que justifique urgência.">Há alguma urgência ou prazo específico?</Label>
            <div className="flex gap-4">
              {['Sim', 'Não'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleInputChange('urgenciaPrazo', opt)}
                  className={`flex-1 py-2.5 rounded-xl border-2 font-bold text-sm transition-all ${
                    formData.urgenciaPrazo === opt 
                      ? 'border-blue-600 bg-blue-50 text-blue-700' 
                      : 'border-slate-100 bg-slate-50 text-slate-400'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label sub="Descreva detalhadamente o motivo da urgência ou o prazo fatal.">Qual a urgência ou prazo específico?</Label>
            <Input 
              disabled={formData.urgenciaPrazo !== 'Sim'}
              placeholder="Descreva o motivo da urgência..."
              value={formData.detalheUrgencia}
              onChange={(e) => handleInputChange('detalheUrgencia', e.target.value)}
            />
          </div>
        </div>
      </Section>

      {/* 3. Detalhes do projeto */}
      <Section 
        id="detalhesProjeto" 
        title="3. Detalhes do Projeto" 
        isOpen={sections.detalhesProjeto}
        onToggle={toggleSection}
        visible={formData.tipoApoio === 'Projeto' && isSection2Valid}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label required sub="Informe o código/ID da iniciativa no GoMAP.">Informe o código/ID GoMAP</Label>
            <div className="relative">
              <Input 
                placeholder="Ex: 2024-001" 
                value={formData.codigoGoMAP}
                onChange={(e) => handleGoMAPChange(e.target.value)}
              />
              <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
          <div>
            <Label required sub="Nome da iniciativa conforme cadastro no GoMAP.">Nome do projeto</Label>
            <Input value={formData.nomeProjeto} disabled />
          </div>
          <div className="md:col-span-2">
            <Label sub="Anexe o Termo de Abertura do Projeto (TAP) ou documento equivalente.">Anexar Termo de Abertura do Projeto</Label>
            <div 
              onClick={() => setTermoAberturaAttached(!termoAberturaAttached)}
              className={`mt-2 p-8 border-2 border-dashed rounded-2xl transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
                termoAberturaAttached 
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-600' 
                  : 'border-slate-200 bg-slate-50 text-slate-400 hover:border-slate-300 hover:bg-slate-100/50'
              }`}
            >
              <div className={`p-3 rounded-xl ${termoAberturaAttached ? 'bg-emerald-100' : 'bg-white shadow-sm'}`}>
                {termoAberturaAttached ? <CheckCircle2 size={24} /> : <Paperclip size={24} />}
              </div>
              <div className="text-center">
                <p className="text-sm font-bold">{termoAberturaAttached ? 'Termo de Abertura Anexado' : 'Clique para anexar o Termo de Abertura'}</p>
                <p className="text-[10px] font-medium opacity-60 mt-1">Formatos aceitos: PDF, DOCX ou PNG (Máx. 10MB)</p>
              </div>
            </div>
          </div>
          <div className="md:col-span-2">
            <Label required sub="Descreva a principal entrega, serviço ou resultado do projeto.">Qual(is) o(s) produto(s) esperado(s)?</Label>
            <TextArea 
              placeholder="Descreva o que será construído ou elaborado..."
              value={formData.produtosEsperados}
              onChange={(e) => handleInputChange('produtosEsperados', e.target.value)}
            />
          </div>
          
          <div>
            <Label required sub="Indique se o projeto esta vinculado a uma iniciativa do PPA">Está ligado a alguma iniciativa do Plano Plurianual (PPA)?</Label>
            <div className="flex gap-4">
              {['Sim', 'Não'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleInputChange('vinculoPPA', opt)}
                  className={`flex-1 py-2.5 rounded-xl border-2 font-bold text-sm transition-all ${
                    formData.vinculoPPA === opt 
                      ? 'border-blue-600 bg-blue-50 text-blue-700' 
                      : 'border-slate-100 bg-slate-50 text-slate-400'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label sub="Informe a iniciativa e a entrega associada no PPA.">Qual a iniciativa do PPA?</Label>
            <Input 
              disabled={formData.vinculoPPA !== 'Sim'}
              placeholder="Descreva a iniciativa PPA..."
              value={formData.iniciativaPPA}
              onChange={(e) => handleInputChange('iniciativaPPA', e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <Label required>Quem são os principais usuários afetados?</Label>
            <TextArea 
              placeholder="Descreva os usuários que serão impactados pelo projeto..."
              value={formData.usuariosAfetados}
              onChange={(e) => handleInputChange('usuariosAfetados', e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <Label required sub="Áreas envolvidas no projeto ou com interesses em seus resultados.">Quais são as Partes interessadas/parcerias?</Label>
            <TextArea 
              placeholder="Liste as partes interessadas e parcerias..."
              value={formData.partesInteressadas}
              onChange={(e) => handleInputChange('partesInteressadas', e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <Label required>Esse projeto já foi validado com a TI setorial?</Label>
            <Select 
              value={formData.validadoTISetorial}
              onChange={(e) => handleInputChange('validadoTISetorial', e.target.value)}
            >
              <option value="">Selecione uma opção</option>
              <option value="Sim, foi validada com a TI setorial">Sim, foi validada com a TI setorial</option>
              <option value="Não foi validada com a TI setorial">Não foi validada com a TI setorial</option>
              <option value="Não sei informar se foi validada com a TI setorial">Não sei informar se foi validada com a TI setorial</option>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label required>A TI setorial irá contribuir com recursos (tecnológicos e humanos) para a execução do Projeto?</Label>
            <div className="flex gap-4">
              {['Sim', 'Não'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleInputChange('tiContribuiraRecursos', opt)}
                  className={`flex-1 py-2.5 rounded-xl border-2 font-bold text-sm transition-all ${
                    formData.tiContribuiraRecursos === opt 
                      ? 'border-blue-600 bg-blue-50 text-blue-700' 
                      : 'border-slate-100 bg-slate-50 text-slate-400'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <Label required>A TI setorial tem condições de assumir a sustentação dessa solução após a implantação?</Label>
            <Select 
              value={formData.tiSustentacaoSolucao}
              onChange={(e) => handleInputChange('tiSustentacaoSolucao', e.target.value)}
            >
              <option value="">Selecione uma opção</option>
              <option value="Sim, irá assumir a sustentação">Sim, irá assumir a sustentação</option>
              <option value="Não, deverá ser sustentado pela STI">Não, deverá ser sustentado pela STI</option>
              <option value="Será sustentado pela STI em conjunto com a TI setorial">Será sustentado pela STI em conjunto com a TI setorial</option>
              <option value="Não se aplica a natureza do projeto">Não se aplica a natureza do projeto</option>
            </Select>
          </div>

          <div>
            <Label required sub="Indique se o projeto está associado a algum objetivo estratégico.">Ligado ao Planejamento Estratégico do órgão?</Label>
            <div className="flex gap-4">
              {['Sim', 'Não'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleInputChange('objetivoEstrategico', opt)}
                  className={`flex-1 py-2.5 rounded-xl border-2 font-bold text-sm transition-all ${
                    formData.objetivoEstrategico === opt 
                      ? 'border-blue-600 bg-blue-50 text-blue-700' 
                      : 'border-slate-100 bg-slate-50 text-slate-400'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label sub="Informe o objetivo estratégico do órgão associado.">Qual objetivo do Planejamento Estratégico?</Label>
            <Input 
              disabled={formData.objetivoEstrategico !== 'Sim'}
              placeholder="Descreva o objetivo estratégico..."
              value={formData.objetivoEstrategicoDesc}
              onChange={(e) => handleInputChange('objetivoEstrategicoDesc', e.target.value)}
            />
          </div>

          <div>
            <Label required sub="Indique se a demanda é prioritária dentro da agenda do órgão.">Essa solicitação é prioritária para o órgão?</Label>
            <div className="flex gap-4">
              {['Sim', 'Não'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleInputChange('prioridadeOrgao', opt)}
                  className={`flex-1 py-2.5 rounded-xl border-2 font-bold text-sm transition-all ${
                    formData.prioridadeOrgao === opt 
                      ? 'border-blue-600 bg-blue-50 text-blue-700' 
                      : 'border-slate-100 bg-slate-50 text-slate-400'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <Label required sub="Descreva por que o projeto é prioritário e como se relaciona com os compromissos.">Explique como a iniciativa se enquadra na agenda prioritária do órgão</Label>
            <TextArea 
              disabled={formData.prioridadeOrgao !== 'Sim'}
              placeholder="Justifique a prioridade para o órgão..."
              value={formData.prioridadeOrgaoExplica}
              onChange={(e) => handleInputChange('prioridadeOrgaoExplica', e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <Label required sub="Selecione o nível de prioridade do projeto na agenda do Governo.">A solicitação é considerada prioritária para o Governo do Estado?</Label>
            <Select 
              value={formData.prioridadeGoverno}
              onChange={(e) => handleInputChange('prioridadeGoverno', e.target.value)}
            >
              <option value="">Selecione o nível de prioridade</option>
              <option value="1">Não tem vinculação clara no plano de governo ou está fora da agenda estratégica.</option>
              <option value="2">Reconhecimento parcial, mas não explicitado em programas oficiais.</option>
              <option value="3">Projeto reconhecido em programas e documentos, mas sem prioridade explícita para execução.</option>
              <option value="4">Projeto classificado como prioridade explícita pelo governo, sendo acompanhado diretamente pela Superintendência de Prioridades Governamentais e com apoio da alta liderança</option>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label sub="Pense nas dores, problemas atuais e necessidades não atendidas.">Qual a justificativa do seu projeto?</Label>
            <TextArea 
              placeholder="Descreva o problema que o projeto pretende resolver..."
              value={formData.justificativa}
              onChange={(e) => handleInputChange('justificativa', e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <Label required sub="Selecione a principal motivação do seu projeto.">Qual a motivação do seu projeto?</Label>
            <Select 
              value={formData.motivacao}
              onChange={(e) => handleInputChange('motivacao', e.target.value)}
            >
              <option value="">Selecione a motivação</option>
              <option value="Inovação">Inovação</option>
              <option value="Aumento de produtividade">Aumento de produtividade</option>
              <option value="Redução de custos">Redução de custos</option>
              <option value="Crescimento da receita">Crescimento da receita</option>
              <option value="Manutenção/Operação">Manutenção/Operação</option>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label required sub="Aprofunde os objetivos, mudanças desejadas e resultados esperados conforme a motivação selecionada.">Detalhe a motivação no campo abaixo</Label>
            <TextArea 
              disabled={!formData.motivacao}
              placeholder="Aprofunde os detalhes da motivação..."
              value={formData.detalheMotivacao}
              onChange={(e) => handleInputChange('detalheMotivacao', e.target.value)}
            />
          </div>

          <div>
            <Label required sub="Indique os ganhos de eficiência, produtividade e inovação.">Benefícios para a Administração?</Label>
            <TextArea 
              placeholder="Ganhos internos para o governo..."
              value={formData.beneficiosAdmin}
              onChange={(e) => handleInputChange('beneficiosAdmin', e.target.value)}
            />
          </div>
          <div>
            <Label required sub="Indique melhoria na experiência do cidadão, transparência e benefícios sociais.">Benefícios para a sociedade?</Label>
            <TextArea 
              placeholder="Impacto positivo para o cidadão..."
              value={formData.beneficiosSociedade}
              onChange={(e) => handleInputChange('beneficiosSociedade', e.target.value)}
            />
          </div>
        </div>
      </Section>

      {/* 4. Seção “Solução e processos” */}
      <Section 
        id="como" 
        title="4. Solução e processos" 
        isOpen={sections.como}
        onToggle={toggleSection}
        visible={formData.tipoApoio === 'Projeto' && isSection2Valid}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label required sub="Informe se a solução será ofertada por meio do Portal Expresso.">Disponibilizado no Portal Expresso?</Label>
            <Select 
              value={formData.portalExpresso}
              onChange={(e) => handleInputChange('portalExpresso', e.target.value)}
            >
              <option value="">Selecione</option>
              <option value="Sim">Sim</option>
              <option value="Não">Não</option>
              <option value="Parcialmente">Parcialmente</option>
            </Select>
          </div>
          <div>
            <Label sub="Liste os serviços que serão integrados ao Portal Expresso.">Serviços associados via Portal Expresso</Label>
            <Input 
              disabled={formData.portalExpresso === 'Não'}
              placeholder="Descreva os serviços..."
              value={formData.servicosPortalExpresso}
              onChange={(e) => handleInputChange('servicosPortalExpresso', e.target.value)}
            />
          </div>

          <div>
            <Label required sub="Indique se a solução poderá ser reutilizada por outros órgãos.">O produto esperado é escalável?</Label>
            <Select 
              value={formData.escalavel}
              onChange={(e) => handleInputChange('escalavel', e.target.value)}
            >
              <option value="">Selecione</option>
              <option value="1">Sim, será uma solução corporativa (maioria dos órgãos).</option>
              <option value="2">Não, é uma solução para a realidade específica do solicitante.</option>
              <option value="3">Parcialmente, poderá ser utilizada por um grupo de pastas.</option>
            </Select>
          </div>

          <div>
            <Label required sub="Informe se o projeto cria, altera ou mantém processos de trabalho.">Alteração em processos de trabalho?</Label>
            <Select 
              value={formData.alteracaoProcessos}
              onChange={(e) => handleInputChange('alteracaoProcessos', e.target.value)}
            >
              <option value="">Selecione</option>
              <option value="1">Sim, altera processos de trabalho.</option>
              <option value="2">Não altera processos de trabalho.</option>
              <option value="3">Cria novo processo.</option>
              <option value="4">Não sei informar.</option>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label sub="Descreva o(s) processo(s) de trabalho que serão criados ou alterados.">Qual processo está sendo impactado?</Label>
            <Input 
              placeholder="Nome do processo ou descrição..."
              value={formData.processoImpactado}
              onChange={(e) => handleInputChange('processoImpactado', e.target.value)}
            />
          </div>

          <div>
            <Label required sub="Indique se haverá necessidade de criar ou manter produtos de TIC.">Demandará criação/manutenção de sistemas?</Label>
            <Select 
              value={formData.demandaraTIC}
              onChange={(e) => handleInputChange('demandaraTIC', e.target.value)}
            >
              <option value="">Selecione</option>
              <option value="Sim, demandará a criação ou manutenção de produtos de TIC">Sim, demandará a criação ou manutenção de produtos de TIC</option>
              <option value="Não demandará a criação ou manutenção de produtos de TIC">Não demandará a criação ou manutenção de produtos de TIC</option>
              <option value="Não sei informar se demandará a criação ou manutenção de produtos de TIC">Não sei informar se demandará a criação ou manutenção de produtos de TIC</option>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label required={formData.demandaraTIC?.startsWith('Sim')} sub="Descreva quais sistemas, bases ou soluções precisarão ser evoluídos.">Quais construções ou manutenções? Explique.</Label>
            <TextArea 
              disabled={!formData.demandaraTIC?.startsWith('Sim')}
              placeholder="Detalhe as necessidades de TIC..."
              value={formData.construcoesManutencoesTIC}
              onChange={(e) => handleInputChange('construcoesManutencoesTIC', e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <Label required={formData.demandaraTIC?.startsWith('Sim')} sub="Informe se já existe solução em uso para o mesmo propósito.">Existe atualmente algum produto de TIC para essa finalidade?</Label>
            <Input 
              disabled={!formData.demandaraTIC?.startsWith('Sim')}
              placeholder="Nome da solução atual..."
              value={formData.solucaoTICExistente}
              onChange={(e) => handleInputChange('solucaoTICExistente', e.target.value)}
            />
          </div>
        </div>
      </Section>

      {/* 5. Seção “Custos e investimentos” */}
      <Section 
        id="quanto" 
        title="5. Custos e investimentos" 
        isOpen={sections.quanto}
        onToggle={toggleSection}
        visible={formData.tipoApoio === 'Projeto' && isSection2Valid}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label required sub="Indique a necessidade de novas contratações ou licitações.">Novos investimentos para o produto?</Label>
            <Select 
              value={formData.novosInvestimentos}
              onChange={(e) => handleInputChange('novosInvestimentos', e.target.value)}
            >
              <option value="">Selecione</option>
              <option value="1">Realizado sem necessidade de novas contratações.</option>
              <option value="2">Realizado com a necessidade de novas contratações.</option>
              <option value="3">Não sei informar.</option>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label sub="Descreva os tipos de investimento previstos (licenças, infra, etc).">Quais investimentos ou custos? Detalhe.</Label>
            <TextArea 
              placeholder="Detalhe os custos previstos..."
              value={formData.detalheInvestimentos}
              onChange={(e) => handleInputChange('detalheInvestimentos', e.target.value)}
            />
          </div>
        </div>
      </Section>

      {/* 6. Seção “Talentos a serem alocados” */}
      <Section 
        id="perfis" 
        title={formData.tipoApoio === 'Operação' ? "4. Talentos a serem alocados" : "6. Talentos a serem alocados"} 
        isOpen={sections.perfis}
        onToggle={toggleSection}
        visible={isSection2Valid}
      >
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex-1">
              <Label required sub="Selecione o cargo desejado para adicionar à sua solicitação.">Adicionar Cargo</Label>
              <Select 
                value=""
                onChange={(e) => {
                  const roleName = e.target.value;
                  if (roleName && !formData.perfisSelecionados.find(p => p.role === roleName)) {
                    handleInputChange('perfisSelecionados', [...formData.perfisSelecionados, { 
                      role: roleName, 
                      talents: [{ id: Math.random().toString(36).substr(2, 9), function: '', competencies: [], startDate: '', endDate: '' }] 
                    }]);
                  }
                }}
              >
                <option value="">Selecione um cargo para adicionar...</option>
                {(() => {
                  const selectedSupports = INITIAL_SUPPORT_TYPES.filter(s => 
                    formData.tipoApoioDisponivel.includes(s.title) && s.category === formData.tipoApoio
                  );
                  const allowedRoles = Array.from(new Set(
                    selectedSupports.flatMap(s => 
                      (s.roles || [])
                        .filter((rr: any) => {
                          const availability: RoleAvailability = rr.availability || 'Operação e Projeto';
                          return (
                            availability === formData.tipoApoio ||
                            availability === 'Operação e Projeto'
                          );
                        })
                        .map((rr: any) => (typeof rr === 'string' ? rr : rr.name))
                    )
                  ));
                  return MASTER_ROLES
                    .filter(r => allowedRoles.includes(r.name))
                    .filter(r => !formData.perfisSelecionados.find(p => p.role === r.name))
                    .map(r => <option key={r.name} value={r.name}>{r.name}</option>);
                })()}
              </Select>
            </div>
          </div>
          </div>

          <div className="space-y-8">
            {formData.perfisSelecionados.length === 0 ? (
              <div className="p-12 border-2 border-dashed border-slate-100 rounded-3xl text-center bg-slate-50/30">
                <Users size={32} className="mx-auto text-slate-200 mb-4" />
                <p className="text-sm font-bold text-slate-400">Nenhum cargo adicionado ainda.</p>
                <p className="text-xs text-slate-300 mt-1">Selecione um cargo acima para começar o detalhamento.</p>
              </div>
            ) : (
              formData.perfisSelecionados.map((profile) => (
                <div key={profile.role} className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center">
                        <Briefcase size={16} />
                      </div>
                      <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{profile.role}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        type="button"
                        onClick={() => addTalent(profile.role)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
                      >
                        <Plus size={14} />
                        Adicionar Profissional
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleInputChange('perfisSelecionados', formData.perfisSelecionados.filter(p => p.role !== profile.role))}
                        className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                        title="Remover Cargo"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-0">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/30 border-b border-slate-100">
                          <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">#</th>
                          <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Função</th>
                          <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Competências</th>
                          <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Início</th>
                          <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fim</th>
                          <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest w-10"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {profile.talents.map((talent, index) => (
                          <tr key={talent.id} className="group hover:bg-slate-50/30 transition-colors">
                            <td className="px-6 py-4 text-xs font-bold text-slate-400">{index + 1}</td>
                            <td className="px-6 py-4">
                              <select 
                                value={talent.function}
                                onChange={(e) => updateTalent(profile.role, talent.id, 'function', e.target.value)}
                                className="w-full bg-transparent border-none text-sm font-bold text-slate-700 outline-none focus:ring-0 p-0"
                              >
                                <option value="">Selecionar...</option>
                                {FUNCTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                              </select>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1 max-w-[200px]">
                                {talent.competencies.map(skill => (
                                  <span key={skill} className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-bold">
                                    {skill}
                                    <button 
                                      type="button"
                                      onClick={() => updateTalent(profile.role, talent.id, 'competencies', talent.competencies.filter(s => s !== skill))}>
                                      <X size={8} />
                                    </button>
                                  </span>
                                ))}
                                <select 
                                  className="text-[9px] font-bold text-blue-400 bg-transparent outline-none cursor-pointer"
                                  onChange={(e) => {
                                    if (e.target.value && !talent.competencies.includes(e.target.value)) {
                                      updateTalent(profile.role, talent.id, 'competencies', [...talent.competencies, e.target.value]);
                                    }
                                    e.target.value = '';
                                  }}
                                >
                                  <option value="">+ Skill</option>
                                  {COMPETENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <input 
                                type="text" 
                                placeholder="dd/mm/aaaa"
                                value={talent.startDate}
                                onChange={(e) => updateTalent(profile.role, talent.id, 'startDate', e.target.value)}
                                className="w-24 bg-transparent border-none text-sm font-bold text-slate-700 outline-none focus:ring-0 p-0"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input 
                                type="text" 
                                placeholder="dd/mm/aaaa"
                                value={talent.endDate}
                                onChange={(e) => updateTalent(profile.role, talent.id, 'endDate', e.target.value)}
                                className="w-24 bg-transparent border-none text-sm font-bold text-slate-700 outline-none focus:ring-0 p-0"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <button 
                                type="button"
                                onClick={() => removeTalent(profile.role, talent.id)}
                                className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Section>

      {/* 7. Seção “Prazos e urgência” */}
      <Section 
        id="quando" 
        title="7. Prazos e urgência" 
        isOpen={sections.quando}
        onToggle={toggleSection}
        visible={formData.tipoApoio === 'Projeto' && isSection2Valid}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label required sub="Indique se existe alguma urgência formal ou prazo definido.">Há alguma urgência ou prazo específico?</Label>
            <div className="flex gap-4">
              {['Sim', 'Não'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleInputChange('urgenciaPrazo', opt)}
                  className={`flex-1 py-2.5 rounded-xl border-2 font-bold text-sm transition-all ${
                    formData.urgenciaPrazo === opt 
                      ? 'border-blue-600 bg-blue-50 text-blue-700' 
                      : 'border-slate-100 bg-slate-50 text-slate-400'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label sub="Descreva a urgência, o prazo e o motivo da restrição.">Detalhe a urgência ou prazo específico</Label>
            <Input 
              disabled={formData.urgenciaPrazo !== 'Sim'}
              placeholder="Motivo da urgência..."
              value={formData.detalheUrgencia}
              onChange={(e) => handleInputChange('detalheUrgencia', e.target.value)}
            />
          </div>

          <div>
            <Label required sub="Indique o horizonte de tempo esperado para disponibilização.">Expectativa para o produto estar disponível?</Label>
            <Select 
              value={formData.expectativaDisponibilidade}
              onChange={(e) => handleInputChange('expectativaDisponibilidade', e.target.value)}
            >
              <option value="">Selecione o horizonte</option>
              <option value="1">1 a 6 meses</option>
              <option value="2">7 a 12 meses</option>
              <option value="3">13 a 18 meses</option>
              <option value="4">19 a 24 meses</option>
              <option value="5">Mais de 24 meses</option>
            </Select>
          </div>

          <div>
            <Label required sub="Indique se há normas externas que impõem prazos.">Existe legislação ou norma relacionada?</Label>
            <Select 
              value={formData.legislacaoRelacionada}
              onChange={(e) => handleInputChange('legislacaoRelacionada', e.target.value)}
            >
              <option value="">Selecione</option>
              <option value="Nenhuma">Nenhuma</option>
              <option value="Recomendação">Recomendação</option>
              <option value="Imposição sem prazo">Imposição sem prazo</option>
              <option value="Imposição fora do exercício">Imposição com prazo fora do exercício</option>
              <option value="Imposição no exercício">Imposição com prazo no exercício</option>
            </Select>
          </div>

          <div>
            <Label required sub="Informe se haverá necessidade de adequações em normas ou leis.">Mudanças na legislação pertinente?</Label>
            <Select 
              value={formData.mudancasLegislacao}
              onChange={(e) => handleInputChange('mudancasLegislacao', e.target.value)}
            >
              <option value="">Selecione</option>
              <option value="1">Sim, haverá necessidade.</option>
              <option value="2">Não haverá necessidade.</option>
              <option value="3">Não sei informar.</option>
            </Select>
          </div>
          <div>
            <Label sub="Liste as normas ou leis que precisarão ser ajustadas.">Legislação que deverá passar por adequação</Label>
            <Input 
              disabled={formData.mudancasLegislacao !== '1'}
              placeholder="Liste as leis ou normas..."
              value={formData.legislacaoAdequacao}
              onChange={(e) => handleInputChange('legislacaoAdequacao', e.target.value)}
            />
          </div>
        </div>
      </Section>

      <div className="flex justify-end pt-8 pb-10">
        <button 
          disabled={!isFormValid}
          className={`px-12 py-4 rounded-2xl font-black text-sm shadow-xl transition-all active:scale-95 flex items-center gap-3 uppercase tracking-widest ${
            !isFormValid 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
              : 'bg-[#1e40af] hover:bg-blue-800 text-white shadow-blue-100'
          }`}
          onClick={handleSubmit}
        >
          <CheckCircle2 size={18} />
          Enviar Solicitação
        </button>
      </div>
    </div>
  );
};