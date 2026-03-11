
import { Evaluation, ChartData, RankingItem, RadarData, TimelineData } from './types';

export const EVALUATIONS_MOCK: Evaluation[] = [
  {
    id: '1',
    professional: 'Carlos Mendes',
    department: 'SUTIC',
    project: 'Migração de Cloud',
    dislocationDate: '15/10/2024',
    statusProfessional: 'Concluída',
    statusDepartment: 'Concluída',
    ratingProfessional: 4.9,
    ratingDepartment: 4.8,
    avatar: 'https://i.pravatar.cc/150?u=carlos'
  },
  {
    id: '2',
    professional: 'Ana Paula',
    department: 'SUPGF',
    project: 'Dashboard Financeiro',
    dislocationDate: '02/11/2024',
    statusProfessional: 'Concluída',
    statusDepartment: 'Pendente',
    ratingProfessional: 4.7,
    avatar: 'https://i.pravatar.cc/150?u=ana'
  },
  {
    id: '3',
    professional: 'Roberto Lima',
    department: 'SUPLAN',
    project: 'Planejamento 2025',
    dislocationDate: '10/12/2024',
    statusProfessional: 'Pendente',
    statusDepartment: 'Concluída',
    ratingDepartment: 4.6,
    avatar: 'https://i.pravatar.cc/150?u=roberto'
  },
  {
    id: '4',
    professional: 'Juliana Silva',
    department: 'SUREG',
    project: 'Portal do Cidadão',
    dislocationDate: '05/11/2024',
    statusProfessional: 'Concluída',
    statusDepartment: 'Concluída',
    ratingProfessional: 4.5,
    ratingDepartment: 4.7,
    avatar: 'https://i.pravatar.cc/150?u=juliana'
  },
  {
    id: '5',
    professional: 'Marcos Oliveira',
    department: 'SUTIC',
    project: 'Segurança de Rede',
    dislocationDate: '12/11/2024',
    statusProfessional: 'Concluída',
    statusDepartment: 'Pendente',
    ratingProfessional: 4.8,
    avatar: 'https://i.pravatar.cc/150?u=marcos'
  },
  {
    id: '6',
    professional: 'Fernanda Costa',
    department: 'SEFAZ',
    project: 'Auditoria Digital',
    dislocationDate: '20/11/2024',
    statusProfessional: 'Concluída',
    statusDepartment: 'Concluída',
    ratingProfessional: 4.9,
    ratingDepartment: 4.9,
    avatar: 'https://i.pravatar.cc/150?u=fernanda'
  },
  {
    id: '7',
    professional: 'Lucas Santos',
    department: 'SURGO',
    project: 'App Mobile v2',
    dislocationDate: '25/11/2024',
    statusProfessional: 'Pendente',
    statusDepartment: 'Pendente',
    avatar: 'https://i.pravatar.cc/150?u=lucas'
  },
  {
    id: '8',
    professional: 'Bárbara Reis',
    department: 'SUTIC',
    project: 'Refatoração de Legado',
    dislocationDate: '01/12/2024',
    statusProfessional: 'Concluída',
    statusDepartment: 'Concluída',
    ratingProfessional: 4.6,
    ratingDepartment: 4.5,
    avatar: 'https://i.pravatar.cc/150?u=barbara'
  },
  {
    id: '9',
    professional: 'Ricardo Souza',
    department: 'SUPLAN',
    project: 'Análise de Viabilidade',
    dislocationDate: '03/12/2024',
    statusProfessional: 'Concluída',
    statusDepartment: 'Pendente',
    ratingProfessional: 4.7,
    avatar: 'https://i.pravatar.cc/150?u=ricardo'
  },
  {
    id: '10',
    professional: 'Patrícia Lima',
    department: 'SUPGF',
    project: 'Folha de Pagamento',
    dislocationDate: '05/12/2024',
    statusProfessional: 'Concluída',
    statusDepartment: 'Concluída',
    ratingProfessional: 4.8,
    ratingDepartment: 4.8,
    avatar: 'https://i.pravatar.cc/150?u=patricia'
  },
  {
    id: '11',
    professional: 'Gabriel Farias',
    department: 'SUREG',
    project: 'Sistema de Licenciamento',
    dislocationDate: '08/12/2024',
    statusProfessional: 'Pendente',
    statusDepartment: 'Concluída',
    ratingDepartment: 4.4,
    avatar: 'https://i.pravatar.cc/150?u=gabriel'
  },
  {
    id: '12',
    professional: 'Helena Mendes',
    department: 'SEAD',
    project: 'Gestão de Patrimônio',
    dislocationDate: '10/12/2024',
    statusProfessional: 'Concluída',
    statusDepartment: 'Concluída',
    ratingProfessional: 4.9,
    ratingDepartment: 4.7,
    avatar: 'https://i.pravatar.cc/150?u=helena'
  },
  {
    id: '13',
    professional: 'Vinícius Rocha',
    department: 'SUTIC',
    project: 'Integração de APIs',
    dislocationDate: '12/12/2024',
    statusProfessional: 'Concluída',
    statusDepartment: 'Pendente',
    ratingProfessional: 4.5,
    avatar: 'https://i.pravatar.cc/150?u=vinicius'
  },
  {
    id: '14',
    professional: 'Camila Torres',
    department: 'SUPGF',
    project: 'Relatórios Gerenciais',
    dislocationDate: '14/12/2024',
    statusProfessional: 'Concluída',
    statusDepartment: 'Concluída',
    ratingProfessional: 4.8,
    ratingDepartment: 4.9,
    avatar: 'https://i.pravatar.cc/150?u=camila'
  },
  {
    id: '15',
    professional: 'Eduardo Martins',
    department: 'SUPLAN',
    project: 'Monitoramento de Metas',
    dislocationDate: '15/12/2024',
    statusProfessional: 'Pendente',
    statusDepartment: 'Pendente',
    avatar: 'https://i.pravatar.cc/150?u=eduardo'
  },
  {
    id: '16',
    professional: 'Sofia Albuquerque',
    department: 'SEFAZ',
    project: 'Controle de Insumos',
    dislocationDate: '16/12/2024',
    statusProfessional: 'Concluída',
    statusDepartment: 'Concluída',
    ratingProfessional: 4.7,
    ratingDepartment: 4.6,
    avatar: 'https://i.pravatar.cc/150?u=sofia'
  },
  {
    id: '17',
    professional: 'Igor Viana',
    department: 'SUREG',
    project: 'Fiscalização Campo',
    dislocationDate: '17/12/2024',
    statusProfessional: 'Concluída',
    statusDepartment: 'Pendente',
    ratingProfessional: 4.4,
    avatar: 'https://i.pravatar.cc/150?u=igor'
  },
  {
    id: '18',
    professional: 'Daniela Ferreira',
    department: 'SURGO',
    project: 'Otimização de Banco',
    dislocationDate: '18/12/2024',
    statusProfessional: 'Concluída',
    statusDepartment: 'Concluída',
    ratingProfessional: 4.9,
    ratingDepartment: 4.8,
    avatar: 'https://i.pravatar.cc/150?u=daniela'
  },
  {
    id: '19',
    professional: 'Matheus Braga',
    department: 'SUTIC',
    project: 'Suporte Nível 3',
    dislocationDate: '19/12/2024',
    statusProfessional: 'Pendente',
    statusDepartment: 'Concluída',
    ratingDepartment: 4.3,
    avatar: 'https://i.pravatar.cc/150?u=matheus'
  },
  {
    id: '20',
    professional: 'Beatriz Castro',
    department: 'SEAD',
    project: 'Workflow de Processos',
    dislocationDate: '20/12/2024',
    statusProfessional: 'Concluída',
    statusDepartment: 'Concluída',
    ratingProfessional: 4.8,
    ratingDepartment: 4.7,
    avatar: 'https://i.pravatar.cc/150?u=beatriz'
  },
  {
    id: '21',
    professional: 'Renato Silveira',
    department: 'SUPGF',
    project: 'Consolidação de Dados',
    dislocationDate: '21/12/2024',
    statusProfessional: 'Concluída',
    statusDepartment: 'Pendente',
    ratingProfessional: 4.6,
    avatar: 'https://i.pravatar.cc/150?u=renato'
  },
  {
    id: '22',
    professional: 'Letícia Guimarães',
    department: 'SUREG',
    project: 'Geoprocessamento',
    dislocationDate: '22/12/2024',
    statusProfessional: 'Concluída',
    statusDepartment: 'Concluída',
    ratingProfessional: 4.7,
    ratingDepartment: 4.7,
    avatar: 'https://i.pravatar.cc/150?u=leticia'
  },
  {
    id: '23',
    professional: 'Thiago Novaes',
    department: 'SUPLAN',
    project: 'Estatísticas Anuais',
    dislocationDate: '23/12/2024',
    statusProfessional: 'Pendente',
    statusDepartment: 'Pendente',
    avatar: 'https://i.pravatar.cc/150?u=thiago'
  },
  {
    id: '24',
    professional: 'Clarice Falcão',
    department: 'SUTIC',
    project: 'UX Research',
    dislocationDate: '24/12/2024',
    statusProfessional: 'Concluída',
    statusDepartment: 'Concluída',
    ratingProfessional: 5.0,
    ratingDepartment: 4.9,
    avatar: 'https://i.pravatar.cc/150?u=clarice'
  },
  {
    id: '25',
    professional: 'André Jordão',
    department: 'SURGO',
    project: 'Business Intelligence',
    dislocationDate: '25/12/2024',
    statusProfessional: 'Concluída',
    statusDepartment: 'Concluída',
    ratingProfessional: 4.8,
    ratingDepartment: 4.8,
    avatar: 'https://i.pravatar.cc/150?u=andre'
  }
];

export const RANKING_ITEMS: RankingItem[] = [
  { id: 1, name: 'Carlos Mendes', initials: 'CM', dept: 'SUTIC', score: 95, projects: 12, rating: 4.9, color: '#0369a1', trend: 'up' },
  { id: 2, name: 'Ana Paula', initials: 'AP', dept: 'SUPGF', score: 88, projects: 10, rating: 4.7, color: '#9333ea', trend: 'stable' },
  { id: 3, name: 'Roberto Lima', initials: 'RL', dept: 'SUPLAN', score: 82, projects: 9, rating: 4.6, color: '#059669', trend: 'up' },
  { id: 4, name: 'Júlia Santos', initials: 'JS', dept: 'SUREG', score: 78, projects: 8, rating: 4.5, color: '#ea580c', trend: 'stable' },
  { id: 5, name: 'Pedro Costa', initials: 'PC', dept: 'SURGO', score: 75, projects: 7, rating: 4.4, color: '#2563eb', trend: 'stable' },
];

export const TIMELINE_DATA: TimelineData[] = [
  { period: 'Jan', profissional: 4.2, orgao: 4.0 },
  { period: 'Fev', profissional: 4.4, orgao: 4.1 },
  { period: 'Mar', profissional: 4.3, orgao: 4.3 },
  { period: 'Abr', profissional: 4.5, orgao: 4.2 },
  { period: 'Mai', profissional: 4.7, orgao: 4.4 },
  { period: 'Jun', profissional: 4.6, orgao: 4.5 },
  { period: 'Jul', profissional: 4.8, orgao: 4.3 },
  { period: 'Ago', profissional: 4.5, orgao: 4.6 },
  { period: 'Set', profissional: 4.9, orgao: 4.7 },
  { period: 'Out', profissional: 4.8, orgao: 4.8 },
];

export const INITIAL_TALENTS = [
  { id: 1, name: 'Ana Carolina Silva', role: 'Analista de Dados', level: 'Senior', dept: 'SEFAZ', superintendency: 'Superintendência de Tecnologia da Informação', status: 'Alocado', rating: 4.8, projects: 12, exp: '8 anos exp.', skills: ['React', 'TypeScript', 'Node.js', 'Python', 'SQL'], avatar: 'AC', color: 'bg-blue-900', dateJoined: '2023-10-15' },
  { id: 2, name: 'Bruno Costa Oliveira', role: 'Gerente de Projetos', level: 'Especialista', dept: 'SEDUC', superintendency: 'Superintendência de Gestão e Planejamento', status: 'Alocado', rating: 4.5, projects: 20, exp: '12 anos exp.', skills: ['Gestão de Projetos', 'Scrum', 'Kanban'], avatar: 'BC', color: 'bg-blue-800', dateJoined: '2023-11-20' },
  { id: 3, name: 'Carla Fernandes Lima', role: 'Analista de Dados', level: 'Pleno', dept: 'SUPGF', superintendency: 'Superintendência de Finanças', status: 'Disponível', rating: 4.9, projects: 8, exp: '5 anos exp.', skills: ['Python', 'SQL', 'Power BI', 'Tableau'], avatar: 'CF', color: 'bg-blue-900', dateJoined: '2024-01-05' },
  { id: 4, name: 'Daniel Souza Martins', role: 'Desenvolvedor Full Stack', level: 'Pleno', dept: 'SUTIC', superintendency: 'Superintendência de Infraestrutura', status: 'Disponível', rating: 4.3, projects: 6, exp: '4 anos exp.', skills: ['Java', 'Spring Boot', 'Angular', 'React', 'Node.js'], avatar: 'DS', color: 'bg-blue-800', dateJoined: '2023-12-12' },
  { id: 5, name: 'Elena Rodrigues Alves', role: 'UX Designer', level: 'Senior', dept: 'SADCS', superintendency: 'Superintendência de Comunicação', status: 'Alocado', rating: 4.7, projects: 15, exp: '7 anos exp.', skills: ['Figma', 'User Research', 'Prototypagem', 'UX/UI'], avatar: 'ER', color: 'bg-blue-900', dateJoined: '2024-02-10' },
  { id: 6, name: 'Felipe Nascimento', role: 'Arquiteto de Software', level: 'Especialista', dept: 'SETRAN', superintendency: 'Superintendência de Transportes', status: 'Alocado', rating: 4.6, projects: 18, exp: '10 anos exp.', skills: ['Microservices', 'AWS', 'Kubernetes', 'Docker', 'DevOps'], avatar: 'FN', color: 'bg-blue-800', dateJoined: '2023-09-01' },
  { id: 7, name: 'Gustavo Santos', role: 'Analista de Sistemas', level: 'Pleno', dept: 'SEAD', superintendency: 'Superintendência de Administração', status: 'Disponível', rating: 4.1, projects: 5, exp: '3 anos exp.', skills: ['Node.js', 'PostgreSQL', 'SQL', 'Python'], avatar: 'GS', color: 'bg-blue-700', dateJoined: '2024-03-01' },
  { id: 8, name: 'Carlos Mendes', role: 'DevOps Engineer', level: 'Senior', dept: 'SUTIC', superintendency: 'Superintendência de Infraestrutura', status: 'Alocado', rating: 4.9, projects: 12, exp: '8 anos exp.', skills: ['AWS', 'Terraform', 'Kubernetes', 'CI/CD'], avatar: 'CM', color: 'bg-blue-900', dateJoined: '2023-08-10' },
];

export const MASTER_ROLES = [
  { name: 'Arquiteto de Big Data', category: 'Projeto' },
  { name: 'Especialista em Administração de Banco de Dados', category: 'Operação' },
  { name: 'Especialista em Análise de Dados e BI', category: 'Projeto' },
  { name: 'Especialista em Ciência de Dados', category: 'Projeto' },
  { name: 'Especialista em Ciência de Dados – Inteligência Artificial', category: 'Projeto' },
  { name: 'Especialista em Engenharia de Dados', category: 'Projeto' },
  { name: 'Analista de Projetos de Transformação Digital', category: 'Projeto' },
  { name: 'Analista de Sistemas de Informação Geográfica (SIG)', category: 'Projeto' },
  { name: 'Especialista em Análise de Sistemas', category: 'Operação' },
  { name: 'Especialista em Desenvolvimento de Software', category: 'Projeto' },
  { name: 'Especialista em Experiência do Usuário (UX)', category: 'Projeto' },
  { name: 'Técnico em Manutenção de Equipamentos de Informática', category: 'Operação' },
  { name: 'Especialista em Gestão de Serviços de TI', category: 'Operação' },
  { name: 'Especialista em Monitoramento de Infraestrutura e Serviços', category: 'Operação' },
  { name: 'Especialista em Gestão de Projetos de Tecnologia da Informação e Comunicação', category: 'Projeto' },
  { name: 'Especialista em Especificações Técnicas e Contratos de Tecnologia da Informação e Comunicação', category: 'Operação' },
  { name: 'Especialista em Cibersegurança', category: 'Operação' },
  { name: 'Especialista em DevOps', category: 'Projeto' },
  { name: 'Especialista em Armazenamento de Dados e Backup', category: 'Operação' },
  { name: 'Especialista em Gestão de Facilities de Data Center', category: 'Operação' },
  { name: 'Especialista em Serviços de Correio Eletrônico, Colaboração e Produtividade', category: 'Operação' },
  { name: 'Especialista em Infraestrutura de Virtualização', category: 'Operação' },
  { name: 'Especialista em Plataformas de Aplicações', category: 'Operação' },
  { name: 'Especialista em Redes e Segurança de Aplicações', category: 'Operação' }
];

export const FUNCTIONS = [
  'Líder Técnico',
  'Desenvolvedor Senior',
  'Desenvolvedor Pleno',
  'Desenvolvedor Junior',
  'Analista de Negócios',
  'Product Owner',
  'Scrum Master',
  'QA Engineer',
  'Designer UI/UX',
  'Arquiteto de Soluções',
  'Suporte Técnico',
  'Consultor Especialista'
];

export const COMPETENCIES = [
  'React', 'TypeScript', 'Node.js', 'Python', 'SQL', 'NoSQL',
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes',
  'Gestão de Projetos', 'Metodologias Ágeis', 'Scrum', 'Kanban',
  'UI/UX Design', 'Figma', 'Prototipagem',
  'Segurança da Informação', 'Cibersegurança',
  'Análise de Dados', 'Power BI', 'Tableau',
  'Comunicação Assertiva', 'Liderança', 'Trabalho em Equipe'
];

export const INITIAL_SUPPORT_TYPES: any[] = [
  {
    id: 1,
    title: 'Apoio para projeto de Dados',
    category: 'Projeto',
    roles: [
      'Arquiteto de Big Data',
      'Especialista em Administração de Banco de Dados',
      'Especialista em Análise de Dados e BI',
      'Especialista em Ciência de Dados',
      'Especialista em Ciência de Dados – Inteligência Artificial',
      'Especialista em Engenharia de Dados'
    ],
    active: true
  },
  {
    id: 2,
    title: 'Apoio para Transformação Digital',
    category: 'Projeto',
    roles: [
      'Analista de Projetos de Transformação Digital',
      'Analista de Sistemas de Informação Geográfica (SIG)',
      'Especialista em Análise de Sistemas',
      'Especialista em Desenvolvimento de Software',
      'Especialista em Experiência do Usuário (UX)'
    ],
    active: true
  },
  {
    id: 3,
    title: 'Apoio para Gestão de Projetos',
    category: 'Projeto',
    roles: [
      'Especialista em Gestão de Projetos de Tecnologia da Informação e Comunicação'
    ],
    active: true
  },
  {
    id: 4,
    title: 'Apoio para Gestão de Contratos',
    category: 'Projeto',
    roles: [
      'Especialista em Especificações Técnicas e Contratos de Tecnologia da Informação e Comunicação'
    ],
    active: true
  },
  {
    id: 5,
    title: 'Apoio para Infraestrutura de TI',
    category: 'Projeto',
    roles: [
      'Técnico em Manutenção de Equipamentos de Informática',
      'Especialista em Monitoramento de Infraestrutura e Serviços',
      'Especialista em Gestão de Facilities de Data Center',
      'Especialista em Infraestrutura de Virtualização'
    ],
    active: true
  },
  {
    id: 6,
    title: 'Apoio para Atendimento ao Usuário',
    category: 'Operação',
    roles: [
      'Técnico em Manutenção de Equipamentos de Informática',
      'Especialista em Gestão de Serviços de TI',
      'Especialista em Monitoramento de Infraestrutura e Serviços'
    ],
    active: true
  },
  {
    id: 7,
    title: 'Apoio para Gestão de Contratos',
    category: 'Operação',
    roles: [
      'Especialista em Especificações Técnicas e Contratos de Tecnologia da Informação e Comunicação'
    ],
    active: true
  }
];

export const RADAR_DATA: RadarData[] = []; 
export const EVOLUTION_CHART_DATA: ChartData[] = [];
