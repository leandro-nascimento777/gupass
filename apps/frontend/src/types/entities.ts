/**
 * Tipos das entidades de negócio do FixPass (ver docs/DOCUMENTACAO_TCC_FIXPASS.md, seção 16).
 * Estes tipos espelham o contrato que o backend real (Nest, feito à parte) deverá
 * implementar — ver docs/API_CONTRACT.md. Nenhuma regra de negócio vive aqui, só formato de dado.
 */

export type ID = string

export interface Paginated<T> {
  data: T[]
  page: number
  pageSize: number
  total: number
}

export type PersonType = 'PF' | 'PJ'

export interface Agency {
  id: ID
  name: string
  slug: string
  document: string // CNPJ ou CPF
  legalName?: string
  personType: 'PJ' | 'PF_AUTONOMO' | 'MEI'
  defaultCurrency: string
  logoUrl?: string
  brandPrimaryColor: string
  brandSecondaryColor: string
  status: 'active' | 'inactive'
  createdAt: string
}

export type UserRole = 'owner' | 'global' | string

export interface AgencyMember {
  id: ID
  agencyId: ID
  userId: ID
  name: string
  email: string
  role: UserRole
  commissionRate?: number
  status: 'active' | 'inactive'
  joinedAt: string
}

export interface ClientCategory {
  id: ID
  agencyId: ID
  name: string
  description?: string
  color?: string
}

export interface Client {
  id: ID
  agencyId: ID
  personType: PersonType
  name: string
  email?: string
  phone?: string
  document?: string
  birthDate?: string
  city?: string
  state?: string
  categoryIds: ID[]
  createdAt: string
  updatedAt: string
}

export type QuoteStage =
  | 'nova'
  | 'em_atendimento'
  | 'proposta_enviada'
  | 'aguardando_cliente'
  | 'aprovada'
  | 'perdida'

export interface Quote {
  id: ID
  code: string // COT-XXXXXX
  agencyId: ID
  clientId?: ID
  clientName: string
  clientPhone?: string
  stage: QuoteStage
  totalValue: number
  priority: 'baixa' | 'normal' | 'alta'
  ownerId?: ID
  notes?: string
  createdAt: string
  updatedAt: string
}

export type SaleStatus = 'pendente' | 'confirmada' | 'cancelada'
export type PaymentStatus = 'pendente' | 'parcial' | 'pago'

export interface Sale {
  id: ID
  code: string // VND-XXXXXX
  agencyId: ID
  clientId: ID
  clientName: string
  quoteId?: ID
  totalValue: number
  profit: number
  status: SaleStatus
  paymentStatus: PaymentStatus
  sellerId?: ID
  sellerName?: string
  saleDate: string
  createdAt: string
}

export type TicketStatus = 'confirmado' | 'pendente' | 'erro' | 'cancelado'

export interface Ticket {
  id: ID
  code: string // hex, ex CE2AAA
  agencyId: ID
  clientId?: ID
  clientName?: string
  airline: string
  pnr: string
  passengerLastName: string
  originAirport?: string
  destinationAirport?: string
  flightDate?: string
  flightTime?: string
  status: TicketStatus
  createdAt: string
}

export type CheckinStatus = 'pendente' | 'agendado' | 'concluido' | 'perdido'

export interface CheckinRecord {
  id: ID
  ticketId: ID
  status: CheckinStatus
  windowOpensAt?: string
  updatedAt: string
}

export interface Voucher {
  id: ID
  code: string // VCH-XXXXXX
  agencyId: ID
  clientId: ID
  clientName: string
  title: string
  status: 'rascunho' | 'finalizado'
  origin: 'manual' | 'venda'
  saleId?: ID
  createdAt: string
}

export type TransactionType = 'entrada' | 'saida'
export type TransactionStatus = 'pendente' | 'realizada' | 'atrasada'

export interface Transaction {
  id: ID
  agencyId: ID
  type: TransactionType
  description: string
  clientId?: ID
  clientName?: string
  saleId?: ID
  bankAccountId?: ID
  value: number
  status: TransactionStatus
  date: string
  operatorName?: string
}

export interface Payable {
  id: ID
  agencyId: ID
  description: string
  category: string
  value: number
  dueDate: string
  status: 'pendente' | 'pago' | 'vencido' | 'cancelado'
  recurring: boolean
}

export interface BankAccount {
  id: ID
  agencyId: ID
  name: string
  institution: string
  balance: number
  updatedAt: string
}

export interface Commission {
  id: ID
  agencyId: ID
  saleId: ID
  sellerId: ID
  sellerName: string
  profit: number
  rate: number
  value: number
  status: 'pendente' | 'repassado'
  date: string
}

export interface Goal {
  id: ID
  agencyId: ID
  ownerId: ID
  ownerName: string
  month: number
  year: number
  targetValue: number
  achievedValue: number
}

export interface Contract {
  id: ID
  code: string
  agencyId: ID
  clientId: ID
  clientName: string
  templateId: ID
  status: 'pendente' | 'assinado' | 'cancelado'
  createdAt: string
}

export interface Receipt {
  id: ID
  code: string // RCB-AAAA/NNN
  agencyId: ID
  clientId: ID
  clientName: string
  value: number
  paymentMethod: string
  templateId: string
  issuedAt: string
}

export interface FiscalInvoice {
  id: ID
  agencyId: ID
  saleId: ID
  clientName: string
  serviceDescription: string
  status: 'autorizada' | 'rejeitada' | 'cancelada' | 'processando'
  date: string
}

export interface WhatsappTemplate {
  id: ID
  agencyId: ID
  name: string
  slug: string
  status: 'ativo' | 'inativo'
  body: string
}

export interface ActivityLogEntry {
  id: ID
  agencyId: ID
  userId: ID
  userName: string
  userInitials: string
  category: 'cotacoes' | 'bilhetes' | 'vendas' | 'clientes' | 'financeiro' | 'contratos' | 'comercial' | 'seguranca' | 'configuracoes'
  description: string
  entityType?: string
  entityRef?: string
  createdAt: string
}

export interface Supplier {
  id: ID
  agencyId: ID
  name: string
  type: string
  contact?: string
  phone?: string
  status: 'active' | 'inactive'
}

export interface Plan {
  id: ID
  name: string
  priceMonthly: number
  maxUsers: number | null
  aiCredits: number
  features: string[]
}

export interface Subscription {
  id: ID
  agencyId: ID
  planId: ID
  planName: string
  status: 'trial' | 'active' | 'past_due' | 'canceled'
  trialEndsAt?: string
  usage: {
    aiCreditsUsed: number
    aiCreditsIncluded: number
    ticketsIssued: number
    activeClients: number
    storageUsedMb: number
    storageLimitMb: number
  }
}

export interface Task {
  id: ID
  agencyId: ID
  title: string
  description?: string
  status: 'a_fazer' | 'em_progresso' | 'concluido'
  dueDate?: string
  assigneeId?: string
  assigneeName?: string
  priority: 'baixa' | 'normal' | 'alta'
}

export type CalendarEventType = 'evento' | 'tarefa' | 'voo' | 'servico'

export interface CalendarEvent {
  id: ID
  agencyId: ID
  type: CalendarEventType
  title: string
  date: string
  clientId?: string
  clientName?: string
}

export interface DashboardKpis {
  period: string
  latestTickets: Array<{ id: ID; airline: string; label: string; date: string; status: TicketStatus }>
  quotesTotal: number
  quotesNew: number
  checkinsPending: number
  conversionRate: number
  conversionFraction: [number, number]
  salesCount: number
  salesTotal: number
  averageTicket: number
  revenueBilled: number
  revenueReceived: number
  payablesTotal: number
  expensesPaid: number
  cashFlow: Array<{ date: string; income: number; expense: number }>
  overdueTransactionsCount: number
  overdueTransactionsTotal: number
  grossProfit: number
}
