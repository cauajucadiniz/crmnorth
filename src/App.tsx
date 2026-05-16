import React, { useState, useEffect, useMemo } from 'react';
import { 
  MessageCircle, 
  Plus, 
  Filter, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  X,
  Target,
  AlertCircle,
  Search,
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  LogOut,
  ChevronRight,
  Palette,
  Menu,
  Trash2,
  Triangle
} from 'lucide-react';

// --- TYPES ---
type LeadStatus = 'Entrada' | 'Qualificação' | 'Proposta' | 'Follow-up' | 'Fechamento' | 'Perdido';
type EventType = 'Casamento' | 'Aniversário' | 'Formatura' | 'Corporativo' | 'Confraternização' | 'Outro';
type AppTheme = 'orus-light' | 'north-dark';
type Page = 'dashboard' | 'funil' | 'clientes' | 'agenda' | 'config';

interface Lead {
  id: string;
  name: string;
  phone: string;
  eventType: EventType;
  product: string;
  source: string;
  status: LeadStatus;
  estimatedValue: number;
  eventDate?: string;
  eventTime?: string;
  createdAt: number;
  updatedAt: number;
}

const EVENT_TYPES: EventType[] = ['Casamento', 'Aniversário', 'Formatura', 'Corporativo', 'Confraternização', 'Outro'];

// --- THEMING ---
const THEMES = {
  'orus-light': {
    name: 'Orus CRM (Padrão)',
    app: 'h-screen bg-slate-50 text-slate-900 flex font-sans overflow-hidden',
    sidebar: 'w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 z-40 fixed inset-y-0 left-0 transition-transform duration-300 md:relative md:translate-x-0',
    sidebarLogo: 'flex items-center gap-2 px-6 h-16 border-b border-slate-200',
    sidebarLogoText: 'text-slate-900 font-bold text-xl tracking-tight',
    sidebarLogoIcon: 'w-8 h-8 bg-blue-600 text-white rounded flex items-center justify-center font-bold text-lg',
    sidebarNav: 'flex-1 p-4 space-y-1 overflow-y-auto',
    sidebarItem: 'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer w-full',
    sidebarItemActive: 'flex items-center gap-3 px-3 py-2.5 text-sm font-bold rounded-lg bg-blue-50 text-blue-700 transition-colors cursor-pointer w-full',
    sidebarFooter: 'p-4 border-t border-slate-200',
    
    header: 'h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0',
    headerTitle: 'text-lg font-bold text-slate-800',
    headerSubtitle: 'text-xs text-slate-500 font-medium',
    metricLabel: 'text-[10px] text-slate-500 uppercase tracking-widest',
    metricValue: 'text-lg text-blue-600 font-bold leading-none',
    metricDivider: 'h-8 w-[1px] bg-slate-200',
    primaryButton: 'bg-blue-600 text-white hover:bg-blue-700 w-8 h-8 rounded-lg flex items-center justify-center transition-colors shadow-sm',
    
    toolbar: 'h-14 px-6 flex flex-shrink-0 items-center justify-between bg-white border-b border-slate-200 overflow-x-auto scrollbar-hide',
    filterBtnActive: 'px-3 py-1.5 text-xs rounded-md uppercase tracking-tighter whitespace-nowrap bg-blue-600 text-white font-bold',
    filterBtnInactive: 'px-3 py-1.5 text-xs rounded-md uppercase tracking-tighter whitespace-nowrap bg-slate-100 border border-slate-200 text-slate-600 font-medium hover:text-slate-900',
    filterBtnAlertActive: 'px-3 py-1.5 text-xs rounded-md uppercase tracking-tighter whitespace-nowrap bg-red-600 text-white font-bold',
    filterBtnAlertInactive: 'px-3 py-1.5 text-xs rounded-md uppercase tracking-tighter whitespace-nowrap bg-red-50 border border-red-200 text-red-600 font-medium',
    searchInput: 'flex items-center bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 w-64',
    searchText: 'bg-transparent border-none text-xs w-full focus:outline-none text-slate-900 placeholder-slate-500',
    
    mainBase: 'flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden',
    kanbanContainer: 'flex-1 flex gap-4 p-4 md:p-6 overflow-x-auto min-h-0 items-start',
    column: 'flex flex-col gap-3 w-[280px] md:w-[320px] flex-shrink-0 bg-slate-100/70 rounded-xl p-3 border border-slate-200/60 max-h-full',
    columnHeaderTitle: 'text-[11px] font-bold uppercase tracking-widest text-slate-500',
    
    card: 'bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-grab active:cursor-grabbing relative shrink-0',
    cardBadge: 'px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded-md border border-slate-200',
    cardTimeAgo: 'text-[9px] text-slate-400 font-medium whitespace-nowrap',
    cardTitle: 'text-sm font-semibold text-slate-800 mb-1',
    cardSubtitle: 'text-[11px] text-slate-500 mb-3 truncate font-medium',
    cardValue: 'text-xs font-semibold text-blue-600',
    whatsappBtn: 'flex items-center gap-1.5 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white border border-green-200 px-2 py-1 rounded text-[10px] font-bold transition-all',
    
    modalOverlay: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm',
    modalContent: 'bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-md overflow-hidden',
    modalHeader: 'px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50',
    modalTitle: 'text-lg font-bold text-slate-800',
    modalLabel: 'block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5',
    modalInput: 'w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm',
    modalCancelBtn: 'px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors',
    modalSubmitBtn: 'px-6 py-2 rounded-lg text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm',
    
    footer: 'h-8 bg-white border-t border-slate-200 px-6 flex items-center justify-between text-[10px] text-slate-500 flex-shrink-0',
    
    dashboardCard: 'bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow',
    dashboardCardLabel: 'text-sm text-slate-500 mb-2 uppercase tracking-wider font-semibold',
    dashboardCardValue: 'text-3xl font-mono font-bold text-blue-600',
    dashboardCardValueSuccess: 'text-3xl font-mono font-bold text-emerald-600',
    dashboardMetricLabel: 'text-xs text-slate-500 mt-2',
    dashboardCardSpecial: 'bg-white border border-emerald-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow ring-1 ring-emerald-500/10',

    agendaCard: 'bg-white border border-slate-200 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow',
    agendaDateText: 'text-sm font-bold text-blue-600 capitalize',
    agendaTimeBadge: 'bg-slate-100 px-2 py-0.5 rounded text-xs text-slate-500 font-mono border border-slate-200',
    agendaStatusBadgePaid: 'px-2 py-1 text-xs font-bold rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200',
    agendaStatusBadgeNormal: 'px-2 py-1 text-xs font-bold rounded-md bg-slate-50 text-slate-600 border border-slate-200',
    
    configBase: 'bg-white border border-slate-200 p-6 rounded-xl shadow-sm',
    configLabel: 'text-lg font-bold mb-2 text-slate-800',
    configDesc: 'text-sm text-slate-500 mb-4',
    configPlanBasic: 'bg-white border border-slate-200 p-6 rounded-xl flex flex-col shadow-sm',
    configPlanPro: 'bg-blue-50 border border-blue-200 p-6 rounded-xl flex flex-col relative scale-[1.02] shadow-md ring-1 ring-blue-500/10',
    configPlanEnterprise: 'bg-white border border-slate-200 p-6 rounded-xl flex flex-col shadow-sm',
    
    tableContainer: 'bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm',
    tableHeader: 'bg-slate-50 text-xs uppercase text-slate-500',
    tableRow: 'hover:bg-slate-50',
    tableDivider: 'divide-y divide-slate-200'
  },
  'north-dark': {
    name: 'North Locações (Personalizado)',
    app: 'h-screen bg-[#0A0A0A] text-gray-200 flex font-sans overflow-hidden',
    sidebar: 'w-64 bg-[#111111] border-r border-[#333333] flex flex-col flex-shrink-0 z-40 fixed inset-y-0 left-0 transition-transform duration-300 md:relative md:translate-x-0',
    sidebarLogo: 'flex items-center gap-3 px-6 h-16 border-b border-[#333333]',
    sidebarLogoText: 'text-[#DABF8A] font-bold text-xl tracking-tight uppercase',
    sidebarLogoIcon: 'w-8 h-8 bg-[#CBA14D] text-[#111111] rounded flex items-center justify-center font-bold text-xl',
    sidebarNav: 'flex-1 p-4 space-y-1 overflow-y-auto',
    sidebarItem: 'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-white hover:text-[#CBA14D] hover:bg-white/10 transition-colors cursor-pointer w-full',
    sidebarItemActive: 'flex items-center gap-3 px-3 py-2.5 text-sm font-bold rounded-lg bg-[#6E1B1B] text-[#CBA14D] shadow-[0_0_10px_rgba(110,27,27,0.5)] transition-colors cursor-pointer w-full',
    sidebarFooter: 'p-4 border-t border-[#333333]',
    
    header: 'h-16 bg-[#111111] border-b border-[#333333] flex items-center justify-between px-6 flex-shrink-0',
    headerTitle: 'text-lg font-bold text-white',
    headerSubtitle: 'text-xs text-[#DABF8A] font-medium tracking-wider',
    metricLabel: 'text-[10px] text-gray-300 uppercase tracking-widest',
    metricValue: 'text-lg font-mono text-[#CBA14D] font-bold leading-none',
    metricDivider: 'h-8 w-[1px] bg-white/20',
    primaryButton: 'bg-[#CBA14D] text-[#111111] hover:bg-[#DABF8A] w-8 h-8 rounded flex items-center justify-center transition-colors shadow-sm font-bold',
    
    toolbar: 'h-14 px-6 flex flex-shrink-0 items-center justify-between bg-[#161616] border-b border-[#333333] overflow-x-auto scrollbar-hide',
    filterBtnActive: 'px-3 py-1.5 text-xs rounded-sm uppercase tracking-tighter whitespace-nowrap bg-[#CBA14D] text-[#111111] font-bold',
    filterBtnInactive: 'px-3 py-1.5 text-xs rounded-sm uppercase tracking-tighter whitespace-nowrap bg-[#111111]/50 border border-[#333333] text-[#DABF8A] font-medium hover:text-white',
    filterBtnAlertActive: 'px-3 py-1.5 text-xs rounded-sm uppercase tracking-tighter whitespace-nowrap bg-red-500 text-white font-bold border border-red-500',
    filterBtnAlertInactive: 'px-3 py-1.5 text-xs rounded-sm uppercase tracking-tighter whitespace-nowrap bg-red-900/40 border border-red-500/50 text-red-300 font-medium',
    searchInput: 'flex items-center bg-[#0A0A0A] border border-[#333333] rounded px-3 py-1.5 w-64 text-white',
    searchText: 'bg-transparent border-none text-xs w-full focus:outline-none text-white placeholder-gray-400',
    
    mainBase: 'flex-1 flex flex-col min-w-0 bg-[#0A0A0A] overflow-hidden',
    kanbanContainer: 'flex-1 flex gap-4 p-4 md:p-6 overflow-x-auto min-h-0 items-start',
    column: 'flex flex-col gap-3 w-[280px] md:w-[320px] flex-shrink-0 bg-[#161616] rounded-xl p-3 border-t-[3px] border-t-[#6E1B1B] border border-x-[#333333] border-b-[#333333] max-h-full',
    columnHeaderTitle: 'text-[11px] font-bold uppercase tracking-widest text-[#DABF8A]',
    
    card: 'bg-[#1C1C1C] border border-[#333333] p-4 rounded-md shadow-lg group hover:border-[#CBA14D] transition-colors cursor-grab active:cursor-grabbing relative shrink-0',
    cardBadge: 'px-2 py-0.5 bg-[#0A0A0A] text-[#DABF8A] text-[9px] font-bold uppercase rounded border border-[#333333]',
    cardTimeAgo: 'text-[9px] text-[#DABF8A]/70 font-semibold whitespace-nowrap',
    cardTitle: 'text-sm font-semibold text-white mb-1',
    cardSubtitle: 'text-[10px] text-gray-300 mb-3 truncate',
    cardValue: 'text-xs font-mono text-[#CBA14D]',
    whatsappBtn: 'flex items-center gap-1.5 bg-green-600/20 text-green-400 border border-green-500/30 px-2 py-1 rounded text-[10px] font-bold hover:bg-green-600 hover:text-white transition-all',
    
    modalOverlay: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm',
    modalContent: 'bg-[#161616] border border-[#333333] rounded-xl shadow-2xl w-full max-w-md overflow-hidden',
    modalHeader: 'px-6 py-4 border-b border-[#333333] flex justify-between items-center bg-[#161616]',
    modalTitle: 'text-lg font-bold text-white',
    modalLabel: 'block text-xs font-semibold text-[#DABF8A] uppercase tracking-wider mb-1.5',
    modalInput: 'w-full bg-[#0A0A0A] border border-[#333333] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#CBA14D] focus:ring-1 focus:ring-[#CBA14D] transition-all',
    modalCancelBtn: 'px-4 py-2 rounded-lg text-sm font-medium text-[#DABF8A] hover:text-white hover:bg-[#111111] transition-colors',
    modalSubmitBtn: 'px-6 py-2 rounded-lg text-sm font-bold bg-[#CBA14D] text-[#111111] hover:bg-[#DABF8A] transition-colors shadow-[0_4px_15px_rgba(203,161,77,0.2)]',

    footer: 'h-8 bg-[#0A0A0A] border-t border-[#333333] px-6 flex items-center justify-between text-[10px] text-[#DABF8A] flex-shrink-0',
    
    dashboardCard: 'bg-[#161616] border border-[#333333] p-6 rounded-xl',
    dashboardCardLabel: 'text-sm opacity-70 mb-2 uppercase tracking-wider font-semibold text-gray-400',
    dashboardCardValue: 'text-3xl font-mono font-bold text-[#CBA14D]',
    dashboardCardValueSuccess: 'text-3xl font-mono font-bold text-green-500',
    dashboardMetricLabel: 'text-xs opacity-50 mt-2 text-gray-400',
    dashboardCardSpecial: 'bg-[#161616] border border-green-900/30 p-6 rounded-xl shadow-lg ring-1 ring-green-500/20',

    agendaCard: 'bg-[#161616] border border-[#333333] p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4',
    agendaDateText: 'text-sm font-bold text-[#CBA14D] capitalize',
    agendaTimeBadge: 'bg-[#111] px-2 py-0.5 rounded text-xs text-gray-400 font-mono border border-[#333333]',
    agendaStatusBadgePaid: 'px-2 py-1 text-xs font-bold rounded-md bg-green-500/20 text-green-500',
    agendaStatusBadgeNormal: 'px-2 py-1 text-xs font-bold rounded-md bg-white/10 text-gray-300',

    configBase: 'bg-[#161616] border border-[#333333] p-6 rounded-xl',
    configLabel: 'text-lg font-bold mb-2 text-white',
    configDesc: 'text-sm opacity-70 mb-4 text-gray-300',
    configPlanBasic: 'bg-[#161616] border border-[#333333] p-6 rounded-xl flex flex-col',
    configPlanPro: 'bg-[#CBA14D]/10 border border-[#CBA14D]/50 p-6 rounded-xl flex flex-col relative scale-[1.02] shadow-xl',
    configPlanEnterprise: 'bg-[#161616] border border-[#333333] p-6 rounded-xl flex flex-col',
    
    tableContainer: 'bg-[#161616] border border-[#333333] rounded-xl overflow-hidden',
    tableHeader: 'bg-black/40 text-xs uppercase opacity-70 text-gray-300',
    tableRow: 'hover:bg-white/5 text-gray-200',
    tableDivider: 'divide-y divide-white/5'
  }
};

type ThemeContext = typeof THEMES['orus-light'];

// --- CONSTANTS ---
const COLUMNS: { id: LeadStatus; title: string; headerColor?: string; titleColor?: string }[] = [
  { id: 'Entrada', title: 'Entrada' },
  { id: 'Qualificação', title: 'Qualificação' },
  { id: 'Proposta', title: 'Proposta' },
  { id: 'Follow-up', title: 'Follow-up' },
  { id: 'Fechamento', title: 'Fechamento' },
  { id: 'Perdido', title: 'Perdido' },
];

const STORAGE_KEY = '@OrusCRM:leads';
const THEME_STORAGE_KEY = '@OrusCRM:theme';

const INITIAL_LEADS: Lead[] = [
  {
    id: '1',
    name: 'Ana Carolina',
    phone: '85999991111',
    eventType: 'Casamento',
    product: 'Kit Mesa Retangular',
    source: 'Instagram',
    status: 'Entrada',
    estimatedValue: 1200,
    eventDate: '2026-10-15',
    eventTime: '19:00',
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
    updatedAt: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: '2',
    name: 'Roberto Moraes',
    phone: '85988882222',
    eventType: 'Corporativo',
    product: 'Pacote Bora Casar',
    source: 'WhatsApp',
    status: 'Fechamento',
    estimatedValue: 3500,
    eventDate: '2026-06-20',
    eventTime: '08:00',
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24,
  }
];

// --- UTILS ---
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const formatPhone = (phone: string) => {
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{1})(\d{4})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]} ${match[3]}-${match[4]}`;
  }
  return phone;
};

const getWhatsAppLink = (lead: Lead) => {
  const cleanPhone = lead.phone.replace(/\D/g, '');
  const text = `Olá ${lead.name}, aqui é da North Locações, vi que tem interesse no ${lead.product}...`;
  return `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(text)}`;
};

const getTimeAgo = (timestamp: number) => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  let interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + 'd';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + 'h';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + 'm';
  return Math.floor(seconds) + 's';
};

// --- COMPONENTS ---

export default function App() {
  // State
  const [activePage, setActivePage] = useState<Page>('funil');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [appTheme, setAppTheme] = useState<AppTheme>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as AppTheme;
      if (saved && THEMES[saved]) return saved;
    } catch (e) {}
    return 'north-dark'; // Defaulting to North Locações view as requested
  });

  const themeClasses = THEMES[appTheme];

  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse local storage UI state");
    }
    return INITIAL_LEADS;
  });

  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, appTheme);
  }, [appTheme]);

  // Derived State (Metrics)
  const metrics = useMemo(() => {
    const totalNegociacao = leads
      .filter(l => ['Entrada', 'Qualificação', 'Proposta', 'Follow-up'].includes(l.status))
      .reduce((acc, l) => acc + (Number(l.estimatedValue) || 0), 0);
    
    const ganhosReais = leads
      .filter(l => l.status === 'Fechamento')
      .reduce((acc, l) => acc + (Number(l.estimatedValue) || 0), 0);

    const leadsPagos = leads.filter(l => l.status === 'Fechamento').length;
    const leadsFinalizados = leads.filter(l => ['Fechamento', 'Perdido'].includes(l.status)).length;
    const taxaConversao = leadsFinalizados === 0 ? 0 : Math.round((leadsPagos / leadsFinalizados) * 100);

    const originsCount = leads.reduce((acc, l) => {
      acc[l.source] = (acc[l.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { totalNegociacao, taxaConversao, ganhosReais, leadsPagos, originsCount };
  }, [leads]);

  // Derived State (Filtered Leads)
  const displayLeads = useMemo(() => {
    let filtered = leads;
    
    if (activeFilter) {
      if (activeFilter === 'atrasado') {
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
        filtered = filtered.filter(l => l.updatedAt < oneDayAgo && !['Fechamento', 'Perdido'].includes(l.status));
      } else {
        filtered = filtered.filter(l => l.eventType === activeFilter);
      }
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(l => 
        l.name.toLowerCase().includes(query) || 
        l.product.toLowerCase().includes(query) ||
        l.phone.includes(query) ||
        l.estimatedValue.toString().includes(query)
      );
    }
    
    return filtered;
  }, [leads, activeFilter, searchQuery]);

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedLeadId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
    
    setTimeout(() => {
      const el = document.getElementById(`lead-${id}`);
      if (el) el.classList.add('opacity-50');
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent, id: string) => {
    setDraggedLeadId(null);
    const el = document.getElementById(`lead-${id}`);
    if (el) el.classList.remove('opacity-50');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, status: LeadStatus) => {
    e.preventDefault();
    if (!draggedLeadId) return;

    setLeads(prev => prev.map(lead => {
      if (lead.id === draggedLeadId && lead.status !== status) {
        return { ...lead, status, updatedAt: Date.now() };
      }
      return lead;
    }));
    setDraggedLeadId(null);
  };

  const handleMoveLead = (id: string, direction: 'prev' | 'next') => {
    const lead = leads.find(l => l.id === id);
    if (!lead) return;
    const currentIndex = COLUMNS.findIndex(c => c.id === lead.status);
    const newIndex = direction === 'next' ? Math.min(currentIndex + 1, COLUMNS.length - 1) : Math.max(currentIndex - 1, 0);
    const newStatus = COLUMNS[newIndex].id;
    if (lead.status !== newStatus) {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus, updatedAt: Date.now() } : l));
    }
  };

  const handleDeleteLead = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este lead?')) {
      setLeads(prev => prev.filter(l => l.id !== id));
    }
  };

  const handleAddLead = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newLead: Lead = {
      id: Math.random().toString(36).substring(7),
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      eventType: formData.get('eventType') as EventType,
      product: formData.get('product') as string,
      source: formData.get('source') as string,
      estimatedValue: Number(formData.get('estimatedValue')) || 0,
      eventDate: (formData.get('eventDate') as string) || undefined,
      eventTime: (formData.get('eventTime') as string) || undefined,
      status: 'Entrada',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setLeads([newLead, ...leads]);
    setIsModalOpen(false);
  };

  return (
    <div className={themeClasses.app}>
      
      {/* --- SIDEBAR --- */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <aside className={`${themeClasses.sidebar} ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className={themeClasses.sidebarLogo}>
          {appTheme === 'north-dark' ? (
            <>
              <div className={themeClasses.sidebarLogoIcon}>N</div>
              <span className={themeClasses.sidebarLogoText}>North</span>
            </>
          ) : (
            <>
              <Triangle className="w-8 h-8 text-blue-600 fill-blue-600" />
              <span className={themeClasses.sidebarLogoText}>Orus CRM</span>
            </>
          )}
        </div>
        
        <nav className={themeClasses.sidebarNav}>
          <div 
            onClick={() => { setActivePage('dashboard'); setIsMobileMenuOpen(false); }}
            className={activePage === 'dashboard' ? themeClasses.sidebarItemActive : themeClasses.sidebarItem}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </div>
          <div 
            onClick={() => { setActivePage('funil'); setIsMobileMenuOpen(false); }}
            className={activePage === 'funil' ? themeClasses.sidebarItemActive : themeClasses.sidebarItem}
          >
            <Target className="w-5 h-5" />
            <span>CRM</span>
          </div>
          <div 
            onClick={() => { setActivePage('clientes'); setIsMobileMenuOpen(false); }}
            className={activePage === 'clientes' ? themeClasses.sidebarItemActive : themeClasses.sidebarItem}
          >
            <Users className="w-5 h-5" />
            <span>Clientes</span>
          </div>
          <div 
            onClick={() => { setActivePage('agenda'); setIsMobileMenuOpen(false); }}
            className={activePage === 'agenda' ? themeClasses.sidebarItemActive : themeClasses.sidebarItem}
          >
            <Calendar className="w-5 h-5" />
            <span>Agenda</span>
          </div>
        </nav>

        <div className={themeClasses.sidebarFooter}>
          <div className="mb-4">
             <label className="text-[10px] uppercase font-bold tracking-wider mb-2 block opacity-50 text-inherit">Conta & Tema</label>
             <button 
               onClick={() => setAppTheme(appTheme === 'orus-light' ? 'north-dark' : 'orus-light')}
               className={themeClasses.sidebarItem}
             >
               <Palette className="w-4 h-4" />
               <span className="truncate flex-1 text-left">{appTheme === 'orus-light' ? 'Aplicar Tema da Empresa' : 'Voltar ao Padrão CRM'}</span>
             </button>
          </div>
          
          <button 
            onClick={() => setActivePage('config')}
            className={activePage === 'config' ? themeClasses.sidebarItemActive : themeClasses.sidebarItem}
          >
            <Settings className="w-4 h-4" />
            <span>Configurações</span>
          </button>
          <button className={themeClasses.sidebarItem}>
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className={themeClasses.mainBase}>
        
        {/* Header */}
        <header className={themeClasses.header}>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-inherit opacity-70 hover:opacity-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className={themeClasses.headerTitle}>
              {activePage === 'funil' && 'CRM'}
              {activePage === 'dashboard' && 'Dashboard de Metas'}
              {activePage === 'clientes' && 'Meus Clientes'}
              {activePage === 'agenda' && 'Agenda'}
              {activePage === 'config' && 'Configurações'}
            </h1>
            <p className={themeClasses.headerSubtitle}>
              {appTheme === 'north-dark' ? 'Gestão North Locações' : 'Workspace Principal'}
            </p>
            </div>
          </div>
          
          <div className="flex gap-4 sm:gap-8 items-center">
            <div className="text-right hidden sm:block">
              <p className={themeClasses.metricLabel}>Em Negociação</p>
              <p className={themeClasses.metricValue}>{formatCurrency(metrics.totalNegociacao)}</p>
            </div>
            <div className={themeClasses.metricDivider + " hidden sm:block"}></div>
            <div className="text-right">
              <p className={themeClasses.metricLabel}>Conversão Mês</p>
              <p className={themeClasses.metricValue}>{metrics.taxaConversao}%</p>
            </div>
            <div className={themeClasses.metricDivider}></div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className={themeClasses.primaryButton}
              title="Novo Lead"
            >
              <Plus className="w-5 h-5" />
            </button>
            
            <div className="hidden md:flex items-center gap-2 pl-4">
              <div className="w-8 h-8 rounded-full bg-slate-300 overflow-hidden flex items-center justify-center">
                {appTheme === 'north-dark' ? (
                   <div className="w-full h-full bg-[#D4AF37] text-black flex items-center justify-center font-bold text-xs uppercase">NL</div>
                ) : (
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Felix`} alt="User" className="w-full h-full object-cover" />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Toolbar */}
        {activePage === 'funil' && (
          <div className={themeClasses.toolbar}>
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveFilter(null)}
                className={!activeFilter ? themeClasses.filterBtnActive : themeClasses.filterBtnInactive}
              >
                Todos
              </button>
              
              {EVENT_TYPES.map(type => (
                <button 
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  className={activeFilter === type ? themeClasses.filterBtnActive : themeClasses.filterBtnInactive}
                >
                  {type}
                </button>
              ))}

              <button 
                onClick={() => setActiveFilter('atrasado')}
                className={activeFilter === 'atrasado' ? themeClasses.filterBtnAlertActive : themeClasses.filterBtnAlertInactive}
              >
                Inativos 24h
              </button>
            </div>
            <div className="hidden md:block">
              <div className={themeClasses.searchInput}>
                <Search className="w-4 h-4 text-inherit opacity-50 mr-2 flex-shrink-0" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar lead ou produto..." 
                  className={themeClasses.searchText} 
                />
              </div>
            </div>
          </div>
        )}

        {/* View Renderer */}
        <div className="flex-1 overflow-y-auto flex flex-col min-h-0">
          
          {activePage === 'dashboard' && (
            <div className="p-6 md:p-8 space-y-6">
              <h2 className="text-xl font-bold text-inherit mb-6">Visão Geral de Performance</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className={themeClasses.dashboardCard}>
                  <p className={themeClasses.dashboardCardLabel}>Leads Ativos</p>
                  <p className={themeClasses.dashboardCardValue}>{leads.filter(l => !['Fechamento', 'Perdido'].includes(l.status)).length}</p>
                </div>
                <div className={themeClasses.dashboardCardSpecial}>
                  <p className={`${themeClasses.dashboardCardLabel} !text-emerald-500 flex items-center`}>Ganhos (Pagos)</p>
                  <p className={themeClasses.dashboardCardValueSuccess}>{formatCurrency(metrics.ganhosReais)}</p>
                  <p className={themeClasses.dashboardMetricLabel}>{metrics.leadsPagos} negócios fechados</p>
                </div>
                <div className={themeClasses.dashboardCard}>
                  <p className={themeClasses.dashboardCardLabel}>Conversão Geral</p>
                  <p className={themeClasses.dashboardCardValue}>{metrics.taxaConversao}%</p>
                </div>
                <div className={themeClasses.dashboardCard}>
                  <p className={themeClasses.dashboardCardLabel}>Valor em Pipeline</p>
                  <p className={themeClasses.dashboardCardValue}>{formatCurrency(metrics.totalNegociacao)}</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-inherit mb-4 mt-8 pt-4 border-t border-inherit/10">Origem dos Leads</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {Object.entries(metrics.originsCount).sort((a,b) => b[1] - a[1]).map(([origin, count]) => (
                  <div key={origin} className={`${themeClasses.dashboardCard} flex flex-col items-center justify-center`}>
                    <p className={themeClasses.dashboardCardValue}>{count}</p>
                    <p className={`${themeClasses.dashboardCardLabel} !mb-0 mt-2`}>{origin}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activePage === 'clientes' && (
            <div className="p-6 md:p-8">
              <h2 className="text-xl font-bold text-inherit mb-6">Lista de Clientes (Fechamentos)</h2>
              <div className={themeClasses.tableContainer}>
                <table className="w-full text-left text-sm">
                  <thead className={themeClasses.tableHeader}>
                    <tr>
                      <th className="px-6 py-4">Cliente</th>
                      <th className="px-6 py-4">Evento</th>
                      <th className="px-6 py-4">Produto</th>
                      <th className="px-6 py-4 text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody className={themeClasses.tableDivider}>
                    {leads.filter(l => l.status === 'Fechamento').map(lead => (
                      <tr key={lead.id} className={themeClasses.tableRow}>
                        <td className="px-6 py-4 font-medium">{lead.name}</td>
                        <td className="px-6 py-4">{lead.eventType}</td>
                        <td className="px-6 py-4">{lead.product}</td>
                        <td className={`px-6 py-4 text-right font-mono ${appTheme === ' north-dark' ? 'text-[#CBA14D]' : 'text-blue-600 font-bold'}`}>
                          {formatCurrency(lead.estimatedValue)}
                        </td>
                      </tr>
                    ))}
                    {leads.filter(l => l.status === 'Fechamento').length === 0 && (
                      <tr><td colSpan={4} className="px-6 py-8 text-center opacity-50">Nenhum cliente fechado ainda.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activePage === 'agenda' && (
            <div className="p-6 md:p-8">
              <h2 className="text-xl font-bold text-inherit mb-6">Agenda de Eventos</h2>
              
              <div className="flex flex-col gap-4">
                {leads
                  .filter(l => l.eventDate)
                  .sort((a, b) => new Date(a.eventDate!).getTime() - new Date(b.eventDate!).getTime())
                  .map(lead => {
                    const dateObj = new Date(`${lead.eventDate}T00:00:00`);
                    const formattedDate = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(dateObj);
                    return (
                      <div key={lead.id} className={themeClasses.agendaCard}>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className={themeClasses.agendaDateText}>{formattedDate}</span>
                            {lead.eventTime && <span className={themeClasses.agendaTimeBadge}>{lead.eventTime}</span>}
                          </div>
                          <h3 className="text-lg font-bold">{lead.name}</h3>
                          <p className="text-sm opacity-70">{lead.eventType} • {lead.product}</p>
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-2">
                           <span className={lead.status === 'Fechamento' ? themeClasses.agendaStatusBadgePaid : themeClasses.agendaStatusBadgeNormal}>
                             Status: {lead.status}
                           </span>
                           <a 
                              href={getWhatsAppLink(lead)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={themeClasses.whatsappBtn}
                            >
                              <MessageCircle className="w-3 h-3" />
                              Falar no WhatsApp
                            </a>
                        </div>
                      </div>
                    )
                  })
                }
                {leads.filter(l => l.eventDate).length === 0 && (
                   <div className="text-center opacity-50 py-12">
                     <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                     <p>Nenhum evento agendado.</p>
                   </div>
                )}
              </div>
            </div>
          )}

          {activePage === 'config' && (
            <div className="p-6 md:p-8 max-w-5xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <Settings className={`w-6 h-6 ${appTheme === ' north-dark' ? 'text-[#CBA14D]' : 'text-slate-500'}`} />
                <h2 className="text-xl font-bold text-inherit">Configurações e Planos</h2>
              </div>
              
              <div className={`${themeClasses.configBase} mb-12`}>
                 <h3 className={themeClasses.configLabel}>Aparência do CRM</h3>
                 <p className={themeClasses.configDesc}>Escolha como deseja visualizar seu painel de trabalho.</p>
                 <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setAppTheme('orus-light')}
                      className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${appTheme === 'orus-light' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      Padrão Orus (Claro)
                    </button>
                    <button 
                      onClick={() => setAppTheme('north-dark')}
                      className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${appTheme === 'north-dark' ? 'bg-[#CBA14D] text-[#111]' : 'bg-white/10 hover:bg-white/20'}`}
                    >
                      North Locações (Escuro)
                    </button>
                 </div>
              </div>

              <h3 className="text-xl font-bold text-inherit mb-6 text-center">Evolua seu plano do Orus CRM</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Plano Basic */}
                <div className={themeClasses.configPlanBasic}>
                  <h4 className={themeClasses.configLabel}>Starter</h4>
                  <p className={themeClasses.configDesc}>Essencial para quem está começando</p>
                  <p className={`text-3xl font-bold font-mono mb-6 ${appTheme === 'north-dark' ? 'text-[#CBA14D]' : 'text-slate-800'}`}>R$ 49<span className="text-sm font-sans opacity-50">/mês</span></p>
                  <ul className="space-y-3 text-sm flex-1 mb-6">
                     <li className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${appTheme === 'north-dark' ? 'bg-[#CBA14D]' : 'bg-slate-800'}`}></div> Até 100 leads/mês</li>
                     <li className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${appTheme === 'north-dark' ? 'bg-[#CBA14D]' : 'bg-slate-800'}`}></div> Funil de Vendas Básico</li>
                     <li className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${appTheme === 'north-dark' ? 'bg-[#CBA14D]' : 'bg-slate-800'}`}></div> Integração com WhatsApp</li>
                  </ul>
                  <button className={`w-full py-2 rounded-lg font-bold transition-colors ${appTheme === 'north-dark' ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}>Plano Atual</button>
                </div>
                
                 {/* Plano Pro */}
                <div className={themeClasses.configPlanPro}>
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${appTheme === 'north-dark' ? 'bg-[#CBA14D] text-[#111]' : 'bg-blue-600 text-white'}`}>
                    Mais Popular
                  </div>
                  <h4 className={themeClasses.configLabel}>Pro</h4>
                  <p className={themeClasses.configDesc}>Para locadoras em crescimento acelerado</p>
                  <p className={`text-3xl font-bold font-mono mb-6 ${appTheme === 'north-dark' ? 'text-[#CBA14D]' : 'text-blue-600'}`}>R$ 149<span className="text-sm font-sans opacity-50">/mês</span></p>
                  <ul className="space-y-3 text-sm flex-1 mb-6">
                     <li className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${appTheme === 'north-dark' ? 'bg-[#CBA14D]' : 'bg-blue-600'}`}></div> Leads Ilimitados</li>
                     <li className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${appTheme === 'north-dark' ? 'bg-[#CBA14D]' : 'bg-blue-600'}`}></div> Dashboards Avançados</li>
                     <li className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${appTheme === 'north-dark' ? 'bg-[#CBA14D]' : 'bg-blue-600'}`}></div> Automação de E-mails</li>
                     <li className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${appTheme === 'north-dark' ? 'bg-[#CBA14D]' : 'bg-blue-600'}`}></div> Agenda Integrada</li>
                  </ul>
                  <button className={`w-full py-2 rounded-lg font-bold transition-all shadow-lg text-white ${appTheme === 'north-dark' ? 'bg-[#CBA14D] text-[#111] hover:brightness-110' : 'bg-blue-600 hover:bg-blue-700'}`}>Fazer Upgrade</button>
                </div>

                 {/* Plano Enterprise */}
                 <div className={themeClasses.configPlanEnterprise}>
                  <h4 className={themeClasses.configLabel}>Enterprise</h4>
                  <p className={themeClasses.configDesc}>Personalização total para sua marca</p>
                  <p className={`text-3xl font-bold font-mono mb-6 ${appTheme === 'north-dark' ? 'text-[#CBA14D]' : 'text-slate-800'}`}>R$ 499<span className="text-sm font-sans opacity-50">/mês</span></p>
                  <ul className="space-y-3 text-sm flex-1 mb-6">
                     <li className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${appTheme === 'north-dark' ? 'bg-[#CBA14D]' : 'bg-slate-800'}`}></div> White-label (Seu Logo e Cores)</li>
                     <li className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${appTheme === 'north-dark' ? 'bg-[#CBA14D]' : 'bg-slate-800'}`}></div> Multi-usuários e Permissões</li>
                     <li className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${appTheme === 'north-dark' ? 'bg-[#CBA14D]' : 'bg-slate-800'}`}></div> API Aberta</li>
                     <li className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${appTheme === 'north-dark' ? 'bg-[#CBA14D]' : 'bg-slate-800'}`}></div> Controle de Estoque de Locação</li>
                  </ul>
                  <button className={`w-full py-2 rounded-lg font-bold transition-colors ${appTheme === 'north-dark' ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}>Falar com Consultor</button>
                </div>
              </div>
            </div>
          )}

          {activePage === 'funil' && (
          <div className={themeClasses.kanbanContainer}>
            {COLUMNS.map((column) => {
              const columnLeads = displayLeads.filter(l => l.status === column.id);
              return (
                <div 
                  key={column.id} 
                  className={themeClasses.column}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, column.id)}
                >
                  <div className="flex items-center justify-between flex-shrink-0">
                    <h2 className={themeClasses.columnHeaderTitle}>
                      {column.title} 
                      <span className="opacity-60 ml-2">{columnLeads.length.toString().padStart(2, '0')}</span>
                    </h2>
                    <div className="w-5 h-5 rounded hover:bg-black/10 flex items-center justify-center cursor-pointer opacity-50">
                      <Plus className="w-3 h-3" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 overflow-y-auto overflow-x-hidden flex-1 pb-4 pr-1 snap-y scrollbar-thin">
                    {columnLeads.map(lead => (
                      <div 
                        key={lead.id}
                        id={`lead-${lead.id}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead.id)}
                        onDragEnd={(e) => handleDragEnd(e, lead.id)}
                        className={themeClasses.card}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className={themeClasses.cardBadge}>
                            {lead.eventType}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className={themeClasses.cardTimeAgo}>HÁ {getTimeAgo(lead.updatedAt).toUpperCase()}</span>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleDeleteLead(lead.id); }}
                              className="text-gray-400 hover:text-red-500 transition-colors p-1"
                              title="Excluir lead"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <h3 className={themeClasses.cardTitle}>{lead.name}</h3>
                        <p className={themeClasses.cardSubtitle} title={lead.product}>{lead.product}</p>
                        
                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-inherit/10">
                          <span className={themeClasses.cardValue}>{formatCurrency(lead.estimatedValue)}</span>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleMoveLead(lead.id, 'prev')}
                              className="md:hidden flex items-center justify-center w-6 h-6 rounded bg-black/10 active:bg-black/30"
                            >
                              <span className="text-[10px]">{"<"}</span>
                            </button>
                            <a 
                              href={getWhatsAppLink(lead)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className={themeClasses.whatsappBtn}
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span className="hidden sm:inline">WHATSAPP</span>
                            </a>
                            <button 
                              onClick={() => handleMoveLead(lead.id, 'next')}
                              className="md:hidden flex items-center justify-center w-6 h-6 rounded bg-black/10 active:bg-black/30"
                            >
                              <span className="text-[10px]">{">"}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {columnLeads.length === 0 && (
                      <div className="h-24 border-2 border-dashed border-current opacity-20 rounded-xl flex items-center justify-center text-xs text-center px-4 font-medium">
                        Solte o lead aqui
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </div>

        {/* Footer */}
        <footer className={themeClasses.footer}>
          <div className="flex gap-4 font-medium uppercase">
            <span>Orus CRM v2.4.1</span>
            <span className="hidden sm:inline">Sistema Otimizado para Alta Conversão</span>
          </div>
          <div className="flex gap-4">
             <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> DB Sync Active</span>
          </div>
        </footer>

      </div>

      {/* --- ADD LEAD MODAL --- */}
      {isModalOpen && (
        <div className={themeClasses.modalOverlay}>
          <div className={themeClasses.modalContent}>
            <div className={themeClasses.modalHeader}>
              <h2 className={themeClasses.modalTitle}>Novo Lead</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="opacity-50 hover:opacity-100 transition-opacity p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddLead} className="p-6 space-y-4">
              <div>
                <label className={themeClasses.modalLabel}>Nome do Lead *</label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  autoFocus
                  placeholder="Ex: João e Maria"
                  className={themeClasses.modalInput}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={themeClasses.modalLabel}>Celular (WhatsApp) *</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    required 
                    placeholder="85999999999"
                    className={themeClasses.modalInput}
                  />
                </div>
                <div>
                  <label className={themeClasses.modalLabel}>Tipo de Evento *</label>
                  <select 
                    name="eventType" 
                    required
                    className={themeClasses.modalInput}
                  >
                    <option value="Casamento">Casamento</option>
                    <option value="Aniversário">Aniversário</option>
                    <option value="Formatura">Formatura</option>
                    <option value="Corporativo">Corporativo</option>
                    <option value="Confraternização">Confraternização</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={themeClasses.modalLabel}>Data do Evento</label>
                  <input 
                    type="date" 
                    name="eventDate" 
                    className={themeClasses.modalInput}
                  />
                </div>
                <div>
                  <label className={themeClasses.modalLabel}>Horário do Evento</label>
                  <input 
                    type="time" 
                    name="eventTime" 
                    className={themeClasses.modalInput}
                  />
                </div>
              </div>

              <div>
                <label className={themeClasses.modalLabel}>Produto de Interesse *</label>
                <input 
                  type="text" 
                  name="product" 
                  required 
                  placeholder="Ex: Kit Mesa Retangular, Cadeiras Tiffany"
                  className={themeClasses.modalInput}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={themeClasses.modalLabel}>Valor Estimado (R$)</label>
                  <input 
                    type="number" 
                    name="estimatedValue" 
                    placeholder="0.00"
                    step="0.01"
                    className={themeClasses.modalInput}
                  />
                </div>
                <div>
                  <label className={themeClasses.modalLabel}>Origem do Lead</label>
                  <select 
                    name="source" 
                    className={themeClasses.modalInput}
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="WhatsApp">WhatsApp Direto</option>
                    <option value="Site">Site Oficial</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Anúncio">Anúncio</option>
                    <option value="Indicação">Indicação</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 mt-2 border-t border-inherit opacity-90">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className={themeClasses.modalCancelBtn}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className={themeClasses.modalSubmitBtn}
                >
                  Salvar Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

