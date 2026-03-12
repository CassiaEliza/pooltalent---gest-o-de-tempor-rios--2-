
import React from 'react';
import { X, Calendar, Briefcase, Star, Clock, User, Download, Send, CheckCircle2, AlertCircle, Building2 } from 'lucide-react';
import { Evaluation } from '@/types';

interface EvaluationDetailProps {
  evaluation: Evaluation;
  onClose: () => void;
  onNudge: (target: string) => void;
}

export const EvaluationDetail: React.FC<EvaluationDetailProps> = ({ evaluation, onClose, onNudge }) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-[150] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Side Drawer */}
      <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Detalhes da Avaliação</h2>
            <p className="text-xs text-slate-400 font-medium">Ciclo de Desalocação • #{evaluation.id}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Profile Header */}
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-indigo-600 text-white text-2xl font-bold border-4 border-slate-50 shadow-sm">
              {getInitials(evaluation.professional)}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{evaluation.professional}</h3>
              <p className="text-slate-500 flex items-center gap-2 text-sm mt-1 font-medium">
                <Briefcase size={14} />
                Analista de Sistemas Sênior
              </p>
              <div className="flex items-center gap-3 mt-3">
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-100 uppercase tracking-wider">
                  {evaluation.department}
                </span>
                <span className="text-slate-300 text-xs">•</span>
                <span className="text-slate-400 text-xs font-medium flex items-center gap-1">
                  <Calendar size={12} />
                  Desalocado em {evaluation.dislocationDate}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
               <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Projeto Relacionado</p>
               <p className="text-sm font-bold text-slate-700">{evaluation.project}</p>
             </div>
             <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
               <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Tipo de Vínculo</p>
               <p className="text-sm font-bold text-slate-700">Contrato Temporário</p>
             </div>
          </div>

          {/* Feedback Status */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Clock size={16} className="text-indigo-500" />
              Status do Ciclo de Feedback
            </h4>
            
            <div className="space-y-4">
              {/* Profissional Step */}
              <div className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
                evaluation.statusProfessional === 'Concluída' 
                  ? 'bg-emerald-50/20 border-emerald-100' 
                  : 'bg-amber-50/10 border-amber-50'
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${
                    evaluation.statusProfessional === 'Concluída' ? 'bg-emerald-500 text-white' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {evaluation.statusProfessional === 'Concluída' ? <CheckCircle2 size={20} /> : <User size={20} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Auto-avaliação do Profissional</p>
                    <p className="text-xs text-slate-500 font-medium">Situação: {evaluation.statusProfessional}</p>
                  </div>
                </div>

                <div 
                    onClick={() => evaluation.statusProfessional === 'Pendente' && onNudge(evaluation.professional)}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                        evaluation.statusProfessional === 'Concluída' 
                        ? 'bg-white border-slate-200 text-slate-600' 
                        : 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100 hover:border-amber-300 hover:scale-105 active:scale-95 shadow-sm cursor-pointer'
                    }`}
                    title={evaluation.statusProfessional === 'Pendente' ? "Clique para cobrar profissional" : "Concluído"}
                >
                    <User size={16} />
                    {evaluation.ratingProfessional ? (
                        <span className="text-xs font-bold">{evaluation.ratingProfessional}</span>
                    ) : (
                        <Send size={14} className="text-amber-500" />
                    )}
                </div>
              </div>

              {/* Órgão Step */}
              <div className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
                evaluation.statusDepartment === 'Concluída' 
                  ? 'bg-emerald-50/20 border-emerald-100' 
                  : 'bg-amber-50/10 border-amber-50'
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${
                    evaluation.statusDepartment === 'Concluída' ? 'bg-emerald-500 text-white' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {evaluation.statusDepartment === 'Concluída' ? <CheckCircle2 size={20} /> : <Building2 size={20} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Avaliação do Órgão Solicitante</p>
                    <p className="text-xs text-slate-500 font-medium">Situação: {evaluation.statusDepartment}</p>
                  </div>
                </div>

                <div 
                    onClick={() => evaluation.statusDepartment === 'Pendente' && onNudge(evaluation.department)}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                        evaluation.statusDepartment === 'Concluída' 
                        ? 'bg-white border-slate-200 text-slate-600' 
                        : 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100 hover:border-amber-300 hover:scale-105 active:scale-95 shadow-sm cursor-pointer'
                    }`}
                    title={evaluation.statusDepartment === 'Pendente' ? "Clique para cobrar órgão" : "Concluído"}
                >
                    <Building2 size={16} />
                    {evaluation.ratingDepartment ? (
                        <span className="text-xs font-bold">{evaluation.ratingDepartment}</span>
                    ) : (
                        <Send size={14} className="text-amber-500" />
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-800">Observações de Desalocação</h4>
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-sm text-slate-600 leading-relaxed italic">
              "Profissional demonstrou alto domínio técnico durante a fase de implementação do projeto {evaluation.project}. Sua saída se dá devido ao encerramento do escopo previsto, com recomendação positiva para futuras alocações no pool."
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-100 transition-all active:scale-95 shadow-sm">
            <Download size={18} className="text-indigo-600" />
            Baixar Dossiê Completo
          </button>
          <button 
            onClick={onClose}
            className="flex-1 py-3 bg-[#064e3b] text-white rounded-xl font-bold hover:bg-[#065f46] transition-all active:scale-95 shadow-lg shadow-emerald-100"
          >
            Fechar Visualização
          </button>
        </div>
      </div>
    </div>
  );
};
