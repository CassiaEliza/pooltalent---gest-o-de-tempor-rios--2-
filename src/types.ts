
export interface Evaluation {
  id: string;
  professional: string;
  department: string;
  project: string;
  dislocationDate: string;
  statusProfessional: 'Concluída' | 'Pendente';
  statusDepartment: 'Concluída' | 'Pendente';
  ratingProfessional?: number;
  ratingDepartment?: number;
  avatar: string;
}

export interface ChartData {
  name: string;
  profissional: number;
  orgao: number;
}

export interface RankingItem {
  id: number;
  name: string;
  initials: string;
  dept: string;
  score: number;
  projects: number;
  rating: number;
  color: string;
  trend: 'up' | 'down' | 'stable';
}

export interface RadarData {
  subject: string;
  profissional: number;
  orgao: number;
  fullMark: number;
}

export interface TimelineData {
  period: string;
  profissional: number;
  orgao: number;
}

export interface RequestItem {
  id: string; // ID do Produto (ex: #001)
  gomap: string; // ID GOMAP (ex: SOL-24.001)
  project: string;
  description: string;
  org: string;
  skills: string[];
  qty: number;
  requestDate: string;
  startDate: string;
  endDate: string;
  hasMultiplePeriods?: boolean;
  classification: 'Urgência Legal' | 'Prioridade Governamental' | 'Normal';
  status: 'Reprovadas' | 'Em Backlog' | 'Em Andamento' | 'Concluídas' | 'Pendente Análise' | 'Canceladas';
  type: 'Projeto' | 'Operação';
  supportType?: string[];
}

export interface MicroCompetency {
  name: string;
  allocated: number;
  total: number;
  percent: number;
}

export interface MacroCompetency {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  microSkills: MicroCompetency[];
}
