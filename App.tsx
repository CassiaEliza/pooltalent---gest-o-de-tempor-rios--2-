
import React, { useState, useCallback, useRef, useEffect, useLayoutEffect } from 'react';
import { Sparkles, BrainCircuit, X, Calendar, Download, CheckCircle2 } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardStats } from './components/DashboardStats';
import { PerformanceCharts } from './components/PerformanceCharts';
import { EvaluationTable } from './components/EvaluationTable';
import { EvaluationDetail } from './components/EvaluationDetail';
import { HomeDashboard } from './components/HomeDashboard';
import { TalentPool } from './components/TalentPool';
import { ProfessionalProfile } from './components/ProfessionalProfile';
import { RequestsManagement } from './components/RequestsManagement';
import { CompetencyDetailedView } from './components/CompetencyDetailedView';
import { SettingsView } from './components/SettingsView';
import { Footer } from './components/Footer';
import { getPerformanceInsights } from './services/gemini';
import { EVALUATIONS_MOCK } from './constants';
import { Evaluation } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'evaluations' | 'talents' | 'requests' | 'competencies' | 'settings'>('home');
  const [insights, setInsights] = useState<string | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [period, setPeriod] = useState('3m');
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<any | null>(null);

  // Estado Global para Modal de Cobrança (Nudge)
  const [nudgeModal, setNudgeModal] = useState<{ isOpen: boolean; target: string }>({
    isOpen: false,
    target: ''
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    const resetScroll = () => {
      window.scrollTo(0, 0);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
        scrollContainerRef.current.scrollTo(0, 0);
      }
    };

    resetScroll();
    const rafId = requestAnimationFrame(resetScroll);
    return () => cancelAnimationFrame(rafId);
  }, [activeTab, selectedProfessional]);

  const handleNavigate = (tab: 'home' | 'evaluations' | 'talents' | 'requests' | 'competencies' | 'settings') => {
    setActiveTab(tab);
    setSelectedProfessional(null);
  };

  const handleSelectProfessional = (prof: any) => {
    setSelectedProfessional(prof);
  };

  const handleGenerateInsights = useCallback(async () => {
    setLoadingInsights(true);
    try {
      const result = await getPerformanceInsights(EVALUATIONS_MOCK);
      setInsights(result || "Nenhum insight disponível.");
    } catch (err) {
      setInsights("Erro ao conectar com a IA.");
    } finally {
      setLoadingInsights(false);
    }
  }, []);

  const handleNudge = (target: string) => {
    setNudgeModal({ isOpen: true, target });
  };

  const renderContent = () => {
    if (selectedProfessional && activeTab === 'talents') {
      return (
        <ProfessionalProfile 
          professional={selectedProfessional} 
          onBack={() => setSelectedProfessional(null)} 
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return <HomeDashboard 
          onNavigateToEvaluations={() => handleNavigate('evaluations')} 
          onNavigateToCompetencies={() => handleNavigate('competencies')}
          onNavigateToTalents={() => handleNavigate('talents')}
          onNavigateToRequests={() => handleNavigate('requests')}
        />;
      case 'requests':
        return <RequestsManagement />;
      case 'talents':
        return <TalentPool 
          onSelectProfessional={handleSelectProfessional} 
          onNavigateToCompetencies={() => handleNavigate('competencies')}
        />;
      case 'competencies':
        return <CompetencyDetailedView />;
      case 'settings':
        return <SettingsView />;
      case 'evaluations':
        return (
          <div className="p-8 max-w-[1600px] mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-slate-900">Gerenciamento de Performance</h1>
                <p className="text-slate-500 mt-1">Monitore e otimize o desempenho dos seus talentos temporários.</p>
                <div className="flex items-center gap-2 mt-4 bg-white border border-slate-200 p-1 rounded-xl w-fit shadow-sm">
                  <div className="px-3 py-1.5 text-slate-400 border-r border-slate-100">
                    <Calendar size={16} />
                  </div>
                  {[
                    { id: '1m', label: 'Este Mês' },
                    { id: '3m', label: '3 Meses' },
                    { id: '6m', label: '6 Meses' },
                    { id: '1y', label: 'Este Ano' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPeriod(p.id)}
                      className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        period === p.id 
                          ? 'bg-emerald-50 text-emerald-700 shadow-sm' 
                          : 'text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => alert("Relatório de performance exportado com sucesso!")}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                >
                  <Download size={18} className="text-emerald-600" />
                  Exportar Dados
                </button>
                <button 
                  onClick={handleGenerateInsights}
                  disabled={loadingInsights}
                  className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50"
                >
                  {loadingInsights ? (
                    <Sparkles size={18} className="animate-spin" />
                  ) : (
                    <BrainCircuit size={18} />
                  )}
                  {loadingInsights ? "Analisando..." : "Insights de IA"}
                </button>
              </div>
            </div>
            {insights && (
              <div className="mb-8 bg-indigo-50 border border-indigo-100 rounded-2xl p-6 relative animate-in fade-in slide-in-from-top-4 duration-500">
                <button 
                  onClick={() => setInsights(null)}
                  className="absolute top-4 right-4 text-indigo-400 hover:text-indigo-600 transition-colors"
                >
                  <X size={18} />
                </button>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-200">
                    <Sparkles size={20} />
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-bold text-indigo-900 flex items-center gap-2">
                      Análise Preditiva e Sugestões da Inteligência Artificial
                    </h4>
                    <div className="text-sm text-indigo-800 leading-relaxed whitespace-pre-line prose prose-indigo">
                      {insights}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DashboardStats period={period} />
            <PerformanceCharts period={period} />
            <EvaluationTable 
              onSelectEvaluation={setSelectedEvaluation} 
              onNudge={handleNudge}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} onNavigate={handleNavigate} />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          activeTab={activeTab} 
          onNavigate={handleNavigate}
          isProfile={!!selectedProfessional && activeTab === 'talents'} 
        />
        <div 
          id="main-content"
          key={`main-scroll-${activeTab}-${selectedProfessional?.id || 'root'}`}
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto"
          style={{ overflowAnchor: 'none' }}
        >
          <div className="min-h-full flex flex-col">
            <div className="flex-1">
              {renderContent()}
            </div>
            <div className="mt-auto">
              <Footer />
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Detalhe da Avaliação */}
      {selectedEvaluation && (
        <EvaluationDetail 
          evaluation={selectedEvaluation} 
          onClose={() => setSelectedEvaluation(null)} 
          onNudge={handleNudge}
        />
      )}

      {/* Modal Global de Cobrança (Nudge) */}
      {nudgeModal.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-inner animate-bounce">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Cobrança Enviada!</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-8">
                A solicitação de preenchimento da avaliação foi enviada com sucesso para <span className="font-bold text-slate-800">{nudgeModal.target}</span>.
              </p>
              <button 
                onClick={() => setNudgeModal({ ...nudgeModal, isOpen: false })}
                className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
