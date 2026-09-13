import type { LucideIcon } from 'lucide-react'
import {
  Banknote,
  Building2,
  Calendar,
  CalendarClock,
  ClipboardList,
  CreditCard,
  FileSignature,
  FileText,
  Handshake,
  HelpCircle,
  Landmark,
  LayoutDashboard,
  LineChart,
  ListChecks,
  Percent,
  PieChart,
  Plane,
  Receipt,
  ScrollText,
  Settings,
  ShieldCheck,
  Target,
  Ticket,
  Truck,
  Upload,
  UserPlus,
  Users,
  Wallet,
} from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  badge?: 'BETA' | 'PAGO'
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

/** Espelha o sitemap da documentação funcional, seção 3.2. */
export const navGroups: NavGroup[] = [
  {
    label: 'Principal',
    items: [
      { label: 'Dashboard', href: '/app', icon: LayoutDashboard },
      { label: 'Clientes', href: '/app/clientes', icon: Users },
      { label: 'Fornecedores', href: '/app/configuracoes/fornecedores', icon: Truck },
      { label: 'Importações', href: '/app/importacoes', icon: Upload, badge: 'PAGO' },
      { label: 'Cotações', href: '/app/cotacoes', icon: FileText },
      { label: 'Calendário', href: '/app/calendario', icon: Calendar },
      { label: 'Tarefas', href: '/app/tarefas', icon: ListChecks },
      { label: 'Bilhetes', href: '/app/bilhetes', icon: Ticket },
      { label: 'Check-in', href: '/app/checkin', icon: Plane },
      { label: 'Excursões', href: '/app/excursoes', icon: Users, badge: 'PAGO' },
      { label: 'Vouchers', href: '/app/vouchers', icon: ScrollText, badge: 'BETA' },
    ],
  },
  {
    label: 'Financeiro',
    items: [
      { label: 'Painel Financeiro', href: '/app/painel-financeiro', icon: PieChart },
      { label: 'Vendas', href: '/app/vendas', icon: Handshake },
      { label: 'Transações', href: '/app/transacoes', icon: Wallet },
      { label: 'Metas', href: '/app/metas', icon: Target },
      { label: 'Contas a Pagar', href: '/app/contas', icon: CreditCard },
      { label: 'Contas Financeiras', href: '/app/bancos', icon: Landmark },
      { label: 'Contratos', href: '/app/contratos', icon: FileSignature },
      { label: 'Recibos', href: '/app/recibos', icon: Receipt },
      { label: 'Faturas', href: '/app/faturas', icon: Receipt },
      { label: 'Comissões', href: '/app/comissoes', icon: Percent },
      { label: 'Afiliados', href: '/app/afiliados', icon: Banknote, badge: 'PAGO' },
      { label: 'Fiscal', href: '/app/fiscal', icon: Building2 },
      { label: 'Relatórios', href: '/app/relatorios', icon: LineChart },
    ],
  },
  {
    label: 'Conta',
    items: [
      { label: 'Meu Perfil', href: '/app/configuracoes/profile', icon: Users },
      { label: 'Central de Atividades', href: '/app/registros', icon: ClipboardList },
      { label: 'Equipe', href: '/app/configuracoes/users', icon: UserPlus },
      { label: 'Ajuda', href: '/ajuda', icon: HelpCircle },
      { label: 'Configurações', href: '/app/configuracoes', icon: Settings },
      { label: 'Assinatura', href: '/app/assinatura', icon: ShieldCheck },
    ],
  },
]

export interface TopNavLeaf {
  label: string
  href: string
  icon: LucideIcon
  locked?: boolean
}

export interface TopNavMenu {
  label: string
  items: Array<TopNavLeaf | { label: string; icon: LucideIcon; children: TopNavLeaf[] }>
}

/** Estrutura real dos dropdowns do topo (ver referência HTML — Emissões/Cadastro/Gestão). */
export const topNavMenus: TopNavMenu[] = [
  {
    label: 'Emissões',
    items: [
      { label: 'Bilhetes', href: '/app/bilhetes', icon: Ticket },
      { label: 'Check-in', href: '/app/checkin', icon: Plane },
      { label: 'Excursões', href: '/app/excursoes', icon: Users },
      { label: 'Vouchers', href: '/app/vouchers', icon: ScrollText },
    ],
  },
  {
    label: 'Cadastro',
    items: [
      { label: 'Clientes', href: '/app/clientes', icon: Users },
      { label: 'Fornecedores', href: '/app/configuracoes/fornecedores', icon: Truck },
      { label: 'Importação', href: '/app/importacoes', icon: Upload, locked: true },
    ],
  },
  {
    label: 'Gestão',
    items: [
      { label: 'Cotações', href: '/app/cotacoes', icon: FileText },
      {
        label: 'Agenda',
        icon: Calendar,
        children: [
          { label: 'Calendário', href: '/app/calendario', icon: Calendar },
          { label: 'Tarefas', href: '/app/tarefas', icon: ListChecks },
        ],
      },
    ],
  },
  {
    label: 'Financeiro',
    items: [
      { label: 'Painel', href: '/app/painel-financeiro', icon: PieChart },
      { label: 'Vendas', href: '/app/vendas', icon: Handshake },
      { label: 'Transações', href: '/app/transacoes', icon: Wallet },
      { label: 'Metas', href: '/app/metas', icon: Target },
      {
        label: 'Contas',
        icon: CreditCard,
        children: [
          { label: 'Contas a Pagar', href: '/app/contas', icon: CreditCard },
          { label: 'Contas Financeiras', href: '/app/bancos', icon: Landmark },
        ],
      },
      {
        label: 'Documentos',
        icon: FileSignature,
        children: [
          { label: 'Contratos', href: '/app/contratos', icon: FileSignature },
          { label: 'Recibos', href: '/app/recibos', icon: Receipt },
          { label: 'Faturas', href: '/app/faturas', icon: Receipt },
        ],
      },
      { label: 'Comissões', href: '/app/comissoes', icon: Percent },
      { label: 'Afiliados', href: '/app/afiliados', icon: Banknote, locked: true },
      { label: 'Fiscal', href: '/app/fiscal', icon: Building2 },
      { label: 'Relatórios', href: '/app/relatorios', icon: LineChart },
    ],
  },
]

export const quickActions = [
  { label: 'Novo Bilhete', href: '/app/bilhetes?new=1', icon: Ticket },
  { label: 'Novo Cliente', href: '/app/clientes?new=1', icon: Users },
  { label: 'Nova Cotação', href: '/app/cotacoes?new=1', icon: FileText },
  { label: 'Nova Venda', href: '/app/vendas?new=1', icon: CalendarClock },
]
