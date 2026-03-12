
import React, { useState, useMemo } from 'react';
import { 
  Bell, Shield, Mail, Monitor, 
  Plus, Search, Edit2, Trash2, Save,
  Briefcase, LayoutGrid, Clock,
  ArrowLeft, Check, Info, Power, Eye, EyeOff, Tag
} from 'lucide-react';

import { MASTER_ROLES, INITIAL_SUPPORT_TYPES } from '@/constants';

type SettingsTab = 'notifications' | 'access' | 'support_types' | 'sla';

// when editing a support type we maintain a list of roles along with the
// availability of each role (project, operation, or both). this allows the
// administrator to configure, per role, whether it should be offered for
// solicitações de Operação, Projeto ou Operação e Projeto.

type RoleAvailability = 'Projeto' | 'Operação' | 'Operação e Projeto';

interface SelectedRole {
  name: string;
  availability: RoleAvailability;
}

interface User {
  id: number;
  name: string;
  email: string;
  profile: string;
  status: string;
  lastAccess: string;
  creationDate?: string;
  phone?: string;
  subProfile?: string;
  supportTypes?: string[];
  permissionType?: string;
}

interface SupportType {
  id: number;
  title: string;
  // store roles as objects so we can attach availability metadata
  roles: SelectedRole[];
  active: boolean;
}

const MOCK_USERS: User[] = [
  { id: 1, name: 'Maria Silva', email: 'maria.silva@gov.br', profile: 'Administrador', status: 'Ativo', lastAccess: '12/12/2024 14:30', creationDate: '10/12/2024' },
  { id: 2, name: 'João Pereira', email: 'joao.pereira@gov.br', profile: 'Órgão', status: 'Ativo', lastAccess: '11/12/2024 09:15', permissionType: 'Editar e Visualizar', creationDate: '10/12/2024' },
  { id: 3, name: 'Cláudia Rocha', email: 'claudia.rocha@gov.br', profile: 'Visualizador Geral', status: 'Inativo', lastAccess: '10/11/2024 16:45', creationDate: '10/11/2024' },
  { id: 4, name: 'Ricardo Santos', email: 'ricardo.santos@gov.br', profile: 'Órgão', status: 'Ativo', lastAccess: '12/12/2024 11:20', permissionType: 'Visualizar', creationDate: '09/11/2024' },
  { id: 5, name: 'Ana Costa', email: 'ana.costa@gov.br', profile: 'RH da STI', status: 'Ativo', lastAccess: '12/12/2024 10:00', permissionType: 'Editar e Visualizar', creationDate: '09/11/2024' },
];

const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
  <button
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
      enabled ? 'bg-emerald-600' : 'bg-slate-200'
    }`}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
        enabled ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

export const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('notifications');
  // convert any legacy string-based roles into the new object shape with
  // default availability set to "Operação e Projeto" so that older data
  // doesn't break when the component first renders.
  const [supportTypes, setSupportTypes] = useState<SupportType[]>(
    INITIAL_SUPPORT_TYPES.map(s => ({
      ...s,
      roles: (s.roles || []).map((r: any) =>
        typeof r === 'string'
          ? { name: r, availability: 'Operação e Projeto' as RoleAvailability }
          : r
      )
    }))
  );

  const [isEditingSupportType, setIsEditingSupportType] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formSupportType, setFormSupportType] = useState({
    title: '',
    selectedRoles: [] as SelectedRole[]
  });
  const [roleSearch, setRoleSearch] = useState('');

  // users and form state for "Acessos" tab
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [formUser, setFormUser] = useState({
    name: '',
    email: '',
    phone: '',
    profile: '',
    status: 'Ativo',
    subProfile: '',
    supportTypes: [] as string[],
    permissionType: '',
  });
  const [supportSearch, setSupportSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [profileFilter, setProfileFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');


  const updateRoleAvailability = (roleName: string, availability: RoleAvailability) => {
    setFormSupportType(prev => ({
      ...prev,
      selectedRoles: prev.selectedRoles.map(r =>
        r.name === roleName ? { ...r, availability } : r
      )
    }));
  };

  const [slaSettings, setSlaSettings] = useState({
    low_low: 15, // Baixo Impacto / Baixa Urgência
    low_high: 7,  // Baixo Impacto / Alta Urgência
    high_low: 5,  // Alto Impacto / Baixa Urgência
    high_high: 2  // Alto Impacto / Alta Urgência
  });

  const handleSlaChange = (key: keyof typeof slaSettings, value: string) => {
    const numValue = parseInt(value) || 0;
    setSlaSettings(prev => ({ ...prev, [key]: numValue }));
  };
  const [notifications, setNotifications] = useState({
    new_request: { email: true, teams: true, system: true },
    status_update: { email: true, teams: false, system: true },
    sla_warning: { email: true, teams: true, system: true },
    allocation_change: { email: true, teams: true, system: true },
    deadline_extension: { email: true, teams: false, system: true },
    performance_eval: { email: true, teams: true, system: true },
  });

  const handleToggleNotification = (type: keyof typeof notifications, channel: 'email' | 'teams' | 'system') => {
    setNotifications(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [channel]: !prev[type][channel]
      }
    }));
  };

  const notificationTypes = [
    { id: 'new_request', label: 'Novas Solicitações', desc: 'Sempre que houver registro de uma nova solicitação.' },
    { id: 'status_update', label: 'Mudança de Status', desc: 'Notifica quando houver mudança de status das solicitações.' },
    { id: 'sla_warning', label: 'SLA Próximo do Limite', desc: 'Quando uma solicitação está próxima de atingir o SLA definido para o atendimento das solicitações.' },
    { id: 'allocation_change', label: 'Alocações e Desalocações', desc: 'Trazendo nome do talento, data de início e detalhes de aprovação' },
    { id: 'deadline_extension', label: 'Aumento de Prazo', desc: 'Solicitações de extensão de prazo realizadas pelo órgão' },
    { id: 'performance_eval', label: 'Avaliação de Desempenho', desc: 'Enviada ao órgão e talento após desalocação (Configuração para o Órgão)' },
  ];

  const filteredRoles = useMemo(() => {
    return MASTER_ROLES.filter(role => 
      role.name.toLowerCase().includes(roleSearch.toLowerCase())
    );
  }, [roleSearch]);

  const toggleRoleSelection = (role: string) => {
    setFormSupportType(prev => {
      const exists = prev.selectedRoles.find(r => r.name === role);
      if (exists) {
        return {
          ...prev,
          selectedRoles: prev.selectedRoles.filter(r => r.name !== role)
        };
      }
      return {
        ...prev,
        selectedRoles: [...prev.selectedRoles, { name: role, availability: 'Operação e Projeto' }]
      };
    });
  };

  const handleStartCreate = () => {
    setEditingId(null);
    setFormSupportType({ title: '', selectedRoles: [] });
    setIsEditingSupportType(true);
  };

  const handleStartEdit = (support: SupportType) => {
    setEditingId(support.id);
    // support.roles should already be SelectedRole[] but guard for legacy strings
    const mapped = support.roles.map((r: any) =>
      typeof r === 'string'
        ? { name: r, availability: 'Operação e Projeto' as RoleAvailability }
        : r
    );
    setFormSupportType({ 
      title: support.title, 
      selectedRoles: mapped
    });
    setIsEditingSupportType(true);
  };

  const handleDeleteSupport = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este tipo de apoio?")) {
      setSupportTypes(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    setSupportTypes(prev => prev.map(s => 
      s.id === id ? { ...s, active: !s.active } : s
    ));
  };

  const handleSaveSupportType = () => {
    if (editingId) {
      setSupportTypes(prev => prev.map(s => 
        s.id === editingId 
          ? { ...s, title: formSupportType.title, roles: formSupportType.selectedRoles } 
          : s
      ));
    } else {
      const newId = supportTypes.length > 0 ? Math.max(...supportTypes.map(s => s.id)) + 1 : 1;
      setSupportTypes(prev => [...prev, {
        id: newId,
        title: formSupportType.title,
        roles: formSupportType.selectedRoles,
        active: true
      }]);
    }
    setIsEditingSupportType(false);
  };

  // helpers for user creation/editing
  const toggleUserSupportType = (title: string) => {
    setFormUser(prev => {
      const exists = prev.supportTypes.includes(title);
      if (exists) {
        return { ...prev, supportTypes: prev.supportTypes.filter(t => t !== title) };
      }
      return { ...prev, supportTypes: [...prev.supportTypes, title] };
    });
  };

  const handleSaveUser = () => {
    if (editingUserId !== null) {
      setUsers(prev =>
        prev.map(u =>
          u.id === editingUserId
            ? { ...u, ...formUser }
            : u
        )
      );
    } else {
      const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
      const now = new Date();
      const formattedDate = now.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).replace(',', '');
      const creationDate = new Date().toLocaleDateString('pt-BR');
      setUsers(prev => [...prev, { id: newId, ...formUser, lastAccess: formattedDate, creationDate }]);
    }
    setIsEditingUser(false);
    setEditingUserId(null);
    setFormUser({ name: '', email: '', phone: '', profile: '', status: 'Ativo', subProfile: '', supportTypes: [], permissionType: '' });
    setSupportSearch('');
  };

  const handleSelectUser = (userId: number) => {
    setSelectedUserIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAllUsers = () => {
    if (selectedUserIds.length === users.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(users.map(u => u.id));
    }
  };

  const handleUpdateUserStatus = (status: 'Ativo' | 'Inativo') => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        selectedUserIds.includes(user.id) ? { ...user, status } : user
      )
    );
    setSelectedUserIds([]);
  };

  const handleStartEditUser = (user: User) => {
    setEditingUserId(user.id);
    setFormUser({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      profile: user.profile,
      status: user.status as 'Ativo' | 'Inativo',
      subProfile: user.subProfile || '',
      supportTypes: user.supportTypes || [],
      permissionType: user.permissionType,
    });
    setIsEditingUser(true);
  };

  const renderSupportForm = () => (
    <div className="animate-in slide-in-from-right duration-500 pb-20 space-y-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsEditingSupportType(false)}
          className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {editingId ? 'Editar Tipo de Apoio' : 'Novo Tipo de Apoio'}
          </h2>
          <p className="text-slate-500 text-sm">Configure a categoria de apoio e gerencie os cargos associados</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nome do Tipo de Apoio</label>
              <input 
                type="text" 
                value={formSupportType.title}
                onChange={(e) => setFormSupportType({ ...formSupportType, title: e.target.value })}
                placeholder="Ex: Apoio para Governança Digital"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 ring-emerald-100 font-medium"
              />
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Seleção de Cargos Integrados</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Marque ou desmarque cargos do cadastro mestre</p>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                <input 
                  type="text" 
                  value={roleSearch}
                  onChange={(e) => setRoleSearch(e.target.value)}
                  placeholder="Pesquisar cargo..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs outline-none focus:ring-1 ring-emerald-500"
                />
              </div>
            </div>

            <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredRoles.map((role) => {
                const selected = formSupportType.selectedRoles.find(r => r.name === role.name);
                const isSelected = !!selected;
                return (
                  <div
                    key={role.name}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      isSelected 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                        : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      onClick={() => toggleRoleSelection(role.name)}
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                        isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-200'
                      }`}
                    >
                      {isSelected && <Check size={12} strokeWidth={3} />}
                    </div>
                    <div className="flex-1" onClick={() => toggleRoleSelection(role.name)}>
                      <span className="text-xs font-bold leading-tight block">{role.name}</span>
                      {isSelected && (
                        <span className="text-[8px] font-black uppercase tracking-widest">
                          {selected!.availability}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <select
                        value={selected!.availability}
                        onChange={(e) => { e.stopPropagation(); updateRoleAvailability(role.name, e.target.value as any); }}
                        className="text-[10px] bg-transparent border-none outline-none"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="Operação">Operação</option>
                        <option value="Projeto">Projeto</option>
                        <option value="Operação e Projeto">Operação e Projeto</option>
                      </select>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6 sticky top-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-4">Pré-visualização do Card</h3>
            
            <div className="bg-white rounded-3xl border border-emerald-200 shadow-xl overflow-hidden flex flex-col scale-100 transition-transform">
              <div className="p-6 border-b border-slate-50 bg-emerald-50/20">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-slate-800 leading-tight">
                    {formSupportType.title || 'Nome do Apoio'}
                  </h4>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{formSupportType.selectedRoles.length} cargos selecionados</p>
              </div>
              
              <div className="p-6 min-h-[120px]">
                <div className="flex flex-wrap gap-2">
                  {formSupportType.selectedRoles.length > 0 ? formSupportType.selectedRoles.map((r, idx) => {
                    const roleData = MASTER_ROLES.find(rr => rr.name === r.name);
                    return (
                      <div key={idx} className="flex flex-col gap-1 px-3 py-2 bg-slate-50 text-slate-600 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-2 text-[10px] font-bold">
                          <Briefcase size={10} className="text-slate-300" />
                          {r.name}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[7px] font-black uppercase tracking-widest">
                            {r.availability}
                          </span>
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="flex flex-col items-center justify-center w-full py-8 text-slate-300 space-y-2">
                      <Info size={32} strokeWidth={1} />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-center">Nenhum cargo selecionado</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => setIsEditingSupportType(false)}
                className="flex-1 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
              >
                Cancelar
              </button>
              <button 
                disabled={!formSupportType.title || formSupportType.selectedRoles.length === 0}
                onClick={handleSaveSupportType}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#065f46] text-white rounded-xl font-bold shadow-lg shadow-emerald-100 hover:bg-[#064e3b] transition-all disabled:opacity-50 disabled:shadow-none active:scale-95"
              >
                <Save size={18} />
                {editingId ? 'Salvar Alterações' : 'Salvar Novo'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSupportTypesList = () => (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Cargos e Apoios</h3>
          <p className="text-xs text-slate-400 font-medium">Gerencie as categorias de apoio e a vinculação de cargos integrados</p>
        </div>
        <button 
          onClick={handleStartCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#065f46] text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-100 hover:bg-[#064e3b] transition-all"
        >
          <Plus size={18} />
          Novo Tipo de Apoio
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {supportTypes.map((support) => (
          <div key={support.id} className={`bg-white rounded-3xl border shadow-sm overflow-hidden flex flex-col hover:border-blue-200 transition-all group ${!support.active ? 'opacity-60 border-slate-100' : 'border-slate-200'}`}>
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-800 leading-tight">{support.title}</h4>
                  {!support.active && (
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-400 rounded text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                      <EyeOff size={8} /> Inativo
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{support.roles.length} cargos associados</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleToggleStatus(support.id)}
                  title={support.active ? "Desativar" : "Ativar"}
                  className={`p-2 transition-colors bg-white rounded-xl border border-slate-100 shadow-sm ${support.active ? 'text-slate-400 hover:text-rose-500' : 'text-emerald-500 hover:text-emerald-600'}`}
                >
                  {support.active ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button 
                  onClick={() => handleStartEdit(support)}
                  className="p-2 text-slate-400 hover:text-blue-600 transition-colors bg-white rounded-xl border border-slate-100 shadow-sm"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDeleteSupport(support.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 transition-colors bg-white rounded-xl border border-slate-100 shadow-sm"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="p-6 flex-1 bg-white">
              <div className="flex flex-wrap gap-2">
                {support.roles.map((r, idx) => {
                  const roleName = typeof r === 'string' ? r : r.name;
                  const availability: RoleAvailability = typeof r === 'string' ? 'Operação e Projeto' : r.availability;
                  const roleData = MASTER_ROLES.find(rr => rr.name === roleName);
                  return (
                    <div key={idx} className="group/role flex flex-col gap-0.5 px-3 py-2 bg-slate-50 text-slate-600 rounded-xl border border-slate-100 hover:bg-blue-50 hover:border-blue-100 hover:text-blue-700 transition-all cursor-default">
                      <div className="flex items-center gap-2 text-[11px] font-bold">
                        <Briefcase size={12} className="text-slate-300 group-hover/role:text-blue-400" />
                        {roleName}
                      </div>
                      <div className="flex gap-2 items-center ml-5">
                        <span className="text-[7px] font-black uppercase tracking-widest">
                          {availability}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            
          </div>
        ))}

        {supportTypes.length === 0 && (
          <div className="lg:col-span-2 py-20 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-slate-400 space-y-4">
            <LayoutGrid size={48} strokeWidth={1} />
            <div className="text-center">
              <p className="font-bold">Nenhum tipo de apoio cadastrado</p>
              <p className="text-xs">Clique no botão acima para criar a primeira categoria</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderSla = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <Clock size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Acordo de Nível de Serviço (SLA)</h3>
            <p className="text-xs text-slate-400 font-medium">Defina os prazos máximos de atendimento por nível de prioridade</p>
          </div>
        </div>
         <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl flex gap-4">
          <div className="p-2 bg-white rounded-xl text-amber-500 h-fit shadow-sm">
            <Info size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-amber-900">Como o SLA é utilizado?</p>
            <p className="text-xs text-amber-700 leading-relaxed mt-1">
              Estes prazos são utilizados para calcular alertas e informações nos indicadores. 
              Solicitações que ultrapassarem 80% do tempo definido entrarão em estado de atenção.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          <div className="space-y-6 p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Prioridade Baixa</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Informe a quantidade de Dias a serem considerados:</label>
                <input 
                  type="number" 
                  value={slaSettings.low_low}
                  onChange={(e) => handleSlaChange('low_low', e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 ring-emerald-100 font-medium"
                />
              </div>
            </div>
          </div>
          <div className="space-y-6 p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Prioridade Média</h4>
            <div className="space-y-4">
             <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Informe a quantidade de Dias a serem considerados:</label>
                <input 
                  type="number" 
                  value={slaSettings.low_high}
                  onChange={(e) => handleSlaChange('low_high', e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 ring-emerald-100 font-medium"
                />
              </div>
            </div>
          </div>
          <div className="space-y-6 p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Prioridade Alta</h4>
            <div className="space-y-4">
             <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Informe a quantidade de Dias a serem considerados:</label>
                <input 
                  type="number" 
                  value={slaSettings.high_low}
                  onChange={(e) => handleSlaChange('high_low', e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 ring-emerald-100 font-medium"
                />
              </div>
            </div>
          </div>
        </div>

       
      </div>

      <div className="flex justify-end">
        <button 
          onClick={() => alert("Configurações de SLA salvas com sucesso!")}
          className="flex items-center gap-2 px-6 py-3 bg-[#065f46] text-white rounded-xl font-bold shadow-lg shadow-emerald-100 hover:bg-[#064e3b] transition-all active:scale-95"
        >
          <Save size={18} />
          Salvar Configurações de SLA
        </button>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Bell size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Central de Notificações</h3>
              <p className="text-xs text-slate-400 font-medium">Configure como e onde você deseja ser alertado.</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo de Notificação</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">E-mail</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Microsoft Teams</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Push</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {notificationTypes.map((type) => (
                <tr key={type.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">{type.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{type.desc}</p>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="flex justify-center">
                      <Toggle 
                        enabled={notifications[type.id as keyof typeof notifications].email} 
                        onChange={() => handleToggleNotification(type.id as keyof typeof notifications, 'email')} 
                      />
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="flex justify-center">
                      <Toggle 
                        enabled={notifications[type.id as keyof typeof notifications].teams} 
                        onChange={() => handleToggleNotification(type.id as keyof typeof notifications, 'teams')} 
                      />
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="flex justify-center">
                      <Toggle 
                        enabled={notifications[type.id as keyof typeof notifications].system} 
                        onChange={() => handleToggleNotification(type.id as keyof typeof notifications, 'system')} 
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-8 bg-slate-50/50 border-t border-slate-100">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-white rounded-xl text-slate-400 border border-slate-100 shadow-sm">
              <Info size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-600">Dica de Configuração</p>
              <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                Você pode desativar todos os canais de um tipo de notificação para silenciá-la completamente. 
                </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={() => alert("Preferências de notificação unificadas salvas com sucesso!")}
          className="flex items-center gap-2 px-8 py-3.5 bg-[#065f46] text-white rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-[#064e3b] transition-all active:scale-95"
        >
          <Save size={18} />
          Salvar
        </button>
      </div>
    </div>
  );

  const renderAccess = () => {
    if (isEditingUser || editingUserId !== null) {
      return renderUserForm();
    }
    return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <Shield size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Perfis de Acesso</h3>
            <p className="text-xs text-slate-400 font-medium">Níveis de acesso disponíveis no sistema</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: 'Administrador', desc: 'Superintendentes, Subsecretários e Escritório de Projetos', color: 'bg-emerald-600 text-white' },
            { name: 'Órgão', desc: 'Responsáveis pela solicitação e RH do órgão solicitante', color: 'bg-blue-100 text-blue-800' },
            { name: 'RH da STI', desc: 'Gestão de Pessoas da Subsecretaria de Tecnologia', color: 'bg-purple-100 text-purple-800' },
            { name: 'Visualizador Geral', desc: 'Acesso àqueles que somente irão acompanhar e visualizar', color: 'bg-slate-100 text-slate-800' },
          ].map((profile) => (
            <div key={profile.name} className="p-6 border border-slate-100 rounded-2xl bg-slate-50/30">
              <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-bold mb-3 ${
                profile.color
              }`}>
                {profile.name}
              </span>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{profile.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Usuários com Acesso</h3>
            <p className="text-xs text-slate-400 font-medium">Gerencie os usuários que têm acesso ao sistema</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsEditingUser(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#065f46] text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-100 hover:bg-[#064e3b] transition-all"
            >
              <Plus size={18} />
              Adicionar Usuário
            </button>
            <button
              onClick={() => handleUpdateUserStatus('Inativo')}
              disabled={selectedUserIds.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <EyeOff size={16} />
              Inativar
            </button>
            <button
              onClick={() => handleUpdateUserStatus('Ativo')}
              disabled={selectedUserIds.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Eye size={16} />
              Ativar
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-4 py-4 w-12 text-center cursor-pointer" onClick={handleSelectAllUsers}>
                  <input
                    type="checkbox"
                    readOnly
                    checked={selectedUserIds.length === users.length}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </th>
                <th className="px-8 py-4">Nome</th>
                <th className="px-8 py-4">E-mail</th>
                <th className="px-8 py-4">Perfil</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Último Acesso</th>
                <th className="px-8 py-4">Data de criação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((user) => (
                <tr key={user.id} onClick={() => handleStartEditUser(user)} className={`transition-colors cursor-pointer ${selectedUserIds.includes(user.id) ? 'bg-emerald-50' : 'hover:bg-slate-50/30'}`}>
                  <td className="px-4 py-5 w-12 text-center cursor-pointer" onClick={(e) => { e.stopPropagation(); handleSelectUser(user.id); }}>
                    <input
                      type="checkbox"
                      readOnly
                      checked={selectedUserIds.includes(user.id)}
                      className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-800">{user.name}</td>
                  <td className="px-8 py-5 text-sm text-slate-500">{user.email}</td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold ${
                      user.profile === 'Administrador' ? 'bg-emerald-600 text-white' : 
                      user.profile === 'Órgão' ? 'bg-blue-100 text-blue-800' : 
                      user.profile === 'RH da STI' ? 'bg-purple-100 text-purple-800' :
                      user.profile === 'Visualizador Geral' ? 'bg-slate-100 text-slate-800' : ''
                    }`}>
                      {user.profile}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 w-fit ${
                      user.status === 'Ativo' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-200'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Ativo' ? 'bg-emerald-600' : 'bg-slate-400'}`}></div>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500">{user.lastAccess}</td>
                  <td className="px-8 py-5 text-sm text-slate-500">{user.creationDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    );
  };

  const renderCargosEApoios = () => (
    <div className="space-y-4">
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Cargos e Apoios</label>
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
        <input
          type="text"
          value={supportSearch}
          onChange={e => setSupportSearch(e.target.value)}
          placeholder="Pesquisar..."
          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs outline-none focus:ring-1 ring-emerald-500"
        />
      </div>
      <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-3">
        {supportTypes
          .filter(st => st.title.toLowerCase().includes(supportSearch.toLowerCase()))
          .map(st => (
            <button
              key={st.id}
              onClick={() => toggleUserSupportType(st.title)}
              className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                formUser.supportTypes.includes(st.title)
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-slate-200'
              }`}
            >
              {st.title}
            </button>
          ))}
      </div>
    </div>
  );

  const renderUserForm = () => (
    <div className="animate-in slide-in-from-right duration-500 pb-20 space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={() => { setIsEditingUser(false); setEditingUserId(null); }}
          className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-all shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {editingUserId ? 'Editar Usuário' : 'Novo Usuário'}
          </h2>
          <p className="text-slate-500 text-sm">Preencha as informações do usuário</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nome</label>
              <input
                type="text"
                value={formUser.name}
                onChange={e => setFormUser({ ...formUser, name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 ring-emerald-100 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">E-mail</label>
              <input
                type="email"
                value={formUser.email}
                onChange={e => setFormUser({ ...formUser, email: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 ring-emerald-100 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Telefone</label>
              <input
                type="text"
                value={formUser.phone}
                onChange={e => setFormUser({ ...formUser, phone: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 ring-emerald-100 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Perfil</label>
              <select
                value={formUser.profile}
                onChange={e => setFormUser({ ...formUser, profile: e.target.value, subProfile: '', supportTypes: [] })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 ring-emerald-100 font-medium"
              >
                <option value="">Selecione</option>
                <option value="Administrador">Administrador</option>
                <option value="Órgão">Órgão</option>
                <option value="RH da STI">RH da STI</option>
                <option value="Visualizador Geral">Visualizador Geral</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Status</label>
              <select
                value={formUser.status}
                onChange={e => setFormUser({ ...formUser, status: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 ring-emerald-100 font-medium"
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>

            {(formUser.profile === 'Órgão' || formUser.profile === 'RH da STI') && (
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Tipo de Permissão</label>
                <select
                  value={formUser.permissionType}
                  onChange={e => setFormUser({ ...formUser, permissionType: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 ring-emerald-100 font-medium"
                >
                  <option value="">Selecione</option>
                  <option value="Visualizar">Visualizar</option>
                  <option value="Editar e Visualizar">Editar e Visualizar</option>
                </select>
              </div>
            )}

            {formUser.profile === 'Administrador' && (
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Sub‑Perfil</label>
                <select
                  value={formUser.subProfile}
                  onChange={e => setFormUser({ ...formUser, subProfile: e.target.value, supportTypes: [] })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 ring-emerald-100 font-medium"
                >
                  <option value="">Selecione</option>
                  <option value="Superintendentes">Superintendentes</option>
                  <option value="Subsecretários">Subsecretários</option>
                  <option value="Escritório de Projetos">Escritório de Projetos</option>
                </select>
              </div>
            )}

            {formUser.subProfile === 'Superintendentes' && renderCargosEApoios()}

            <div className="flex justify-end pt-4">
              <button
                onClick={handleSaveUser}
                disabled={!formUser.name || !formUser.email || !formUser.profile}
                className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all disabled:opacity-50"
              >
                <Save size={16} />
                {editingUserId ? 'Salvar Alterações' : 'Salvar Novo Usuário'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-[1200px] mx-auto w-full space-y-8 animate-in fade-in duration-500">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Configurações</h1>
        <p className="text-slate-500 text-sm">Gerencie suas preferências e acessos do sistema</p>
      </div>

      {!isEditingSupportType && (
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
          {[
            { id: 'notifications', label: 'Notificações', icon: Bell },
            { id: 'support_types', label: 'Cargos e Apoios', icon: LayoutGrid },
            { id: 'sla', label: 'SLA', icon: Clock },
            { id: 'access', label: 'Acessos', icon: Shield },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {activeTab === 'notifications' && !isEditingSupportType && renderNotifications()}
      {activeTab === 'sla' && !isEditingSupportType && renderSla()}
      {activeTab === 'access' && !isEditingSupportType && renderAccess()}
      {activeTab === 'support_types' && (
        isEditingSupportType ? renderSupportForm() : renderSupportTypesList()
      )}
    </div>
  );
};
