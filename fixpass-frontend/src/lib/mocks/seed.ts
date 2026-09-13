import { faker } from '@faker-js/faker/locale/pt_BR'
import type {
  Agency,
  AgencyMember,
  ActivityLogEntry,
  BankAccount,
  CalendarEvent,
  Client,
  ClientCategory,
  Commission,
  Contract,
  FiscalInvoice,
  Goal,
  Payable,
  Plan,
  Quote,
  QuoteStage,
  Receipt,
  Sale,
  Subscription,
  Supplier,
  Task,
  Ticket,
  Transaction,
  Voucher,
  WhatsappTemplate,
} from '@/types/entities'

faker.seed(42) // dados estáveis entre reloads, mais fácil de validar telas

export const AGENCY_ID = 'agency-vai-de-tur'

const AIRLINES = [
  'LATAM',
  'GOL',
  'AZUL',
  'TAP Air Portugal',
  'Air Europa',
  'American Airlines',
  'Copa Airlines',
  'Air France',
  'Iberia',
  'Avianca',
  'United Airlines',
]

const SUPPLIER_TYPES = [
  'Agência Parceira',
  'CIA Aérea Direta',
  'Consolidadora',
  'Cruzeiro',
  'GDS',
  'Hotel',
  'Locadora de Veículos',
  'Operadora de Turismo',
  'OTA/Plataforma',
  'Seguradora',
  'Transfer/Receptivo',
]

export const agency: Agency = {
  id: AGENCY_ID,
  name: 'Vai de Tur',
  slug: 'vai-de-tur-b9e60354',
  document: '12.345.678/0001-90',
  legalName: 'Vai de Tur Viagens e Turismo Ltda',
  personType: 'PJ',
  defaultCurrency: 'BRL',
  brandPrimaryColor: '#8ce600',
  brandSecondaryColor: '#1b004a',
  status: 'active',
  createdAt: faker.date.past({ years: 2 }).toISOString(),
}

export const members: AgencyMember[] = [
  {
    id: 'user-1',
    agencyId: AGENCY_ID,
    userId: 'user-1',
    name: 'Leandro Nascimento',
    email: 'leandro@gufly.com',
    role: 'owner',
    status: 'active',
    joinedAt: faker.date.past({ years: 2 }).toISOString(),
  },
  ...Array.from({ length: 3 }, (_, i) => ({
    id: `user-${i + 2}`,
    agencyId: AGENCY_ID,
    userId: `user-${i + 2}`,
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    role: 'global',
    commissionRate: faker.number.int({ min: 5, max: 15 }),
    status: faker.helpers.arrayElement(['active', 'active', 'active', 'inactive']) as 'active' | 'inactive',
    joinedAt: faker.date.past({ years: 1 }).toISOString(),
  })),
]

export const clientCategories: ClientCategory[] = [
  { id: 'cat-1', agencyId: AGENCY_ID, name: 'Corporativo', color: '#3b82f6' },
  { id: 'cat-2', agencyId: AGENCY_ID, name: 'Individual', color: '#8ce600' },
  { id: 'cat-3', agencyId: AGENCY_ID, name: 'VIP', color: '#8b5cf6' },
  { id: 'cat-4', agencyId: AGENCY_ID, name: 'Grupo/Família', color: '#f59e0b' },
]

export const clients: Client[] = Array.from({ length: 32 }, (_, i) => {
  const personType = faker.helpers.arrayElement(['PF', 'PF', 'PF', 'PJ']) as 'PF' | 'PJ'
  const createdAt = faker.date.past({ years: 1 }).toISOString()
  return {
    id: `client-${i + 1}`,
    agencyId: AGENCY_ID,
    personType,
    name: personType === 'PF' ? faker.person.fullName() : faker.company.name(),
    email: faker.internet.email().toLowerCase(),
    phone: faker.phone.number({ style: 'international' }),
    document: personType === 'PF' ? faker.string.numeric(11) : faker.string.numeric(14),
    birthDate: personType === 'PF' ? faker.date.birthdate().toISOString() : undefined,
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    categoryIds: faker.helpers.arrayElements(
      clientCategories.map((c) => c.id),
      { min: 0, max: 2 },
    ),
    createdAt,
    updatedAt: createdAt,
  }
})

const QUOTE_STAGES: QuoteStage[] = [
  'nova',
  'em_atendimento',
  'proposta_enviada',
  'aguardando_cliente',
  'aprovada',
  'perdida',
]

export const quotes: Quote[] = Array.from({ length: 28 }, (_, i) => {
  const client = faker.helpers.arrayElement(clients)
  const createdAt = faker.date.recent({ days: 45 }).toISOString()
  return {
    id: `quote-${i + 1}`,
    code: `COT-${faker.string.hexadecimal({ length: 6, prefix: '', casing: 'upper' })}`,
    agencyId: AGENCY_ID,
    clientId: client.id,
    clientName: client.name,
    clientPhone: client.phone,
    stage: faker.helpers.arrayElement(QUOTE_STAGES),
    totalValue: faker.number.float({ min: 800, max: 25000, fractionDigits: 2 }),
    priority: faker.helpers.arrayElement(['baixa', 'normal', 'normal', 'alta']),
    ownerId: faker.helpers.arrayElement(members).id,
    notes: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.4 }),
    createdAt,
    updatedAt: createdAt,
  }
})

export const sales: Sale[] = Array.from({ length: 24 }, (_, i) => {
  const client = faker.helpers.arrayElement(clients)
  const seller = faker.helpers.arrayElement(members)
  const totalValue = faker.number.float({ min: 1000, max: 30000, fractionDigits: 2 })
  const profit = totalValue * faker.number.float({ min: 0.08, max: 0.28, fractionDigits: 2 })
  const saleDate = faker.date.recent({ days: 60 }).toISOString()
  return {
    id: `sale-${i + 1}`,
    code: `VND-${faker.string.hexadecimal({ length: 6, prefix: '', casing: 'upper' })}`,
    agencyId: AGENCY_ID,
    clientId: client.id,
    clientName: client.name,
    quoteId: faker.helpers.maybe(() => faker.helpers.arrayElement(quotes).id, { probability: 0.6 }),
    totalValue,
    profit: Number(profit.toFixed(2)),
    status: faker.helpers.arrayElement(['confirmada', 'confirmada', 'confirmada', 'pendente', 'cancelada']),
    paymentStatus: faker.helpers.arrayElement(['pago', 'pago', 'parcial', 'pendente']),
    sellerId: seller.id,
    sellerName: seller.name,
    saleDate,
    createdAt: saleDate,
  }
})

export const tickets: Ticket[] = Array.from({ length: 18 }, (_, i) => {
  const createdAt = faker.date.recent({ days: 30 }).toISOString()
  return {
    id: `ticket-${i + 1}`,
    code: faker.string.hexadecimal({ length: 6, prefix: '', casing: 'upper' }),
    agencyId: AGENCY_ID,
    airline: faker.helpers.arrayElement(AIRLINES),
    pnr: faker.string.alphanumeric({ length: 6, casing: 'lower' }),
    passengerLastName: faker.person.lastName(),
    originAirport: faker.airline.airport().iataCode,
    destinationAirport: faker.airline.airport().iataCode,
    flightDate: faker.date.soon({ days: 60 }).toISOString(),
    flightTime: `${faker.number.int({ min: 0, max: 23 })}:00`,
    status: faker.helpers.arrayElement(['confirmado', 'confirmado', 'pendente', 'erro']),
    createdAt,
  }
})

export const vouchers: Voucher[] = Array.from({ length: 10 }, (_, i) => {
  const client = faker.helpers.arrayElement(clients)
  const sale = faker.helpers.maybe(() => faker.helpers.arrayElement(sales), { probability: 0.5 })
  return {
    id: `voucher-${i + 1}`,
    code: `VCH-${faker.string.hexadecimal({ length: 6, prefix: '', casing: 'upper' })}`,
    agencyId: AGENCY_ID,
    clientId: client.id,
    clientName: client.name,
    title: 'Proposta de Viagem',
    status: faker.helpers.arrayElement(['rascunho', 'finalizado', 'finalizado']),
    origin: sale ? 'venda' : 'manual',
    saleId: sale?.id,
    createdAt: faker.date.recent({ days: 40 }).toISOString(),
  }
})

export const transactions: Transaction[] = Array.from({ length: 45 }, (_, i) => {
  const type = faker.helpers.arrayElement(['entrada', 'entrada', 'saida'])
  const client = type === 'entrada' ? faker.helpers.arrayElement(clients) : undefined
  return {
    id: `txn-${i + 1}`,
    agencyId: AGENCY_ID,
    type,
    description: type === 'entrada' ? 'Recebimento de venda' : faker.commerce.department(),
    clientId: client?.id,
    clientName: client?.name,
    saleId: faker.helpers.maybe(() => faker.helpers.arrayElement(sales).id, { probability: 0.5 }),
    value: faker.number.float({ min: 100, max: 15000, fractionDigits: 2 }),
    status: faker.helpers.arrayElement(['realizada', 'realizada', 'pendente', 'atrasada']),
    date: faker.date.recent({ days: 45 }).toISOString(),
    operatorName: faker.helpers.arrayElement(members).name,
  }
})

export const payables: Payable[] = Array.from({ length: 16 }, (_, i) => ({
  id: `payable-${i + 1}`,
  agencyId: AGENCY_ID,
  description: faker.helpers.arrayElement(['Aluguel', 'Assinatura de software', 'Repasse fornecedor', 'Marketing', 'Internet/Telefonia']),
  category: faker.helpers.arrayElement(['Fixa', 'Variável', 'Repasse']),
  value: faker.number.float({ min: 80, max: 6000, fractionDigits: 2 }),
  dueDate: faker.date.soon({ days: 40 }).toISOString(),
  status: faker.helpers.arrayElement(['pendente', 'pago', 'pago', 'vencido']),
  recurring: faker.datatype.boolean(),
}))

export const bankAccounts: BankAccount[] = [
  { id: 'bank-1', agencyId: AGENCY_ID, name: 'Conta Principal', institution: 'Banco do Brasil', balance: 48210.55, updatedAt: new Date().toISOString() },
  { id: 'bank-2', agencyId: AGENCY_ID, name: 'Caixa PIX', institution: 'Nubank', balance: 12890.1, updatedAt: new Date().toISOString() },
  { id: 'bank-3', agencyId: AGENCY_ID, name: 'Reserva', institution: 'Itaú', balance: 30500, updatedAt: new Date().toISOString() },
]

export const commissions: Commission[] = sales
  .filter((s) => s.status === 'confirmada')
  .map((s, i) => {
    const rate = faker.number.int({ min: 5, max: 15 })
    return {
      id: `commission-${i + 1}`,
      agencyId: AGENCY_ID,
      saleId: s.id,
      sellerId: s.sellerId ?? members[0].id,
      sellerName: s.sellerName ?? members[0].name,
      profit: s.profit,
      rate,
      value: Number(((s.profit * rate) / 100).toFixed(2)),
      status: faker.helpers.arrayElement(['pendente', 'repassado']),
      date: s.saleDate,
    }
  })

const now = new Date()
export const goals: Goal[] = members.map((m, i) => ({
  id: `goal-${i + 1}`,
  agencyId: AGENCY_ID,
  ownerId: m.id,
  ownerName: m.name,
  month: now.getMonth() + 1,
  year: now.getFullYear(),
  targetValue: faker.number.int({ min: 15000, max: 60000 }),
  achievedValue: faker.number.int({ min: 5000, max: 55000 }),
}))

export const contracts: Contract[] = Array.from({ length: 9 }, (_, i) => {
  const client = faker.helpers.arrayElement(clients)
  return {
    id: `contract-${i + 1}`,
    code: `CTR-${faker.string.hexadecimal({ length: 6, prefix: '', casing: 'upper' })}`,
    agencyId: AGENCY_ID,
    clientId: client.id,
    clientName: client.name,
    templateId: 'template-prestacao-servicos',
    status: faker.helpers.arrayElement(['pendente', 'assinado', 'assinado']),
    createdAt: faker.date.recent({ days: 50 }).toISOString(),
  }
})

export const receipts: Receipt[] = Array.from({ length: 11 }, (_, i) => {
  const client = faker.helpers.arrayElement(clients)
  return {
    id: `receipt-${i + 1}`,
    code: `RCB-${now.getFullYear()}/${String(i + 1).padStart(3, '0')}`,
    agencyId: AGENCY_ID,
    clientId: client.id,
    clientName: client.name,
    value: faker.number.float({ min: 500, max: 12000, fractionDigits: 2 }),
    paymentMethod: faker.helpers.arrayElement(['PIX', 'Cartão de Crédito', 'Transferência Bancária', 'Boleto']),
    templateId: faker.helpers.arrayElement(['classico', 'moderno', 'minimalista', 'executivo', 'compacto', 'premium']),
    issuedAt: faker.date.recent({ days: 40 }).toISOString(),
  }
})

export const fiscalInvoices: FiscalInvoice[] = Array.from({ length: 7 }, (_, i) => {
  const sale = faker.helpers.arrayElement(sales)
  return {
    id: `invoice-${i + 1}`,
    agencyId: AGENCY_ID,
    saleId: sale.id,
    clientName: sale.clientName,
    serviceDescription: 'Intermediação de serviços de viagem',
    status: faker.helpers.arrayElement(['autorizada', 'autorizada', 'processando', 'rejeitada']),
    date: sale.saleDate,
  }
})

export const whatsappTemplates: WhatsappTemplate[] = [
  { id: 'wa-1', agencyId: AGENCY_ID, name: 'Confirmação de Venda', slug: 'confirmacao_venda', status: 'ativo', body: 'Olá {{cliente_primeiro_nome}}, sua venda {{numero_venda}} no valor de {{valor_total}} foi confirmada!' },
  { id: 'wa-2', agencyId: AGENCY_ID, name: 'Envio de Bilhete', slug: 'envio_bilhete', status: 'ativo', body: 'Olá {{cliente_primeiro_nome}}, seu bilhete {{cia_aerea}} (PNR {{pnr}}) para {{data_voo}} às {{horario_voo}} está confirmado. {{origem}} → {{destino}}' },
  { id: 'wa-3', agencyId: AGENCY_ID, name: 'Envio de Link de Assinatura', slug: 'envio_contrato', status: 'ativo', body: 'Olá {{cliente_primeiro_nome}}, assine seu contrato aqui: {{link_contrato}}' },
  { id: 'wa-4', agencyId: AGENCY_ID, name: 'Envio de Proposta', slug: 'envio_proposta', status: 'ativo', body: 'Olá {{cliente_primeiro_nome}}, sua proposta de viagem está pronta: {{link_proposta}}' },
  { id: 'wa-5', agencyId: AGENCY_ID, name: 'Lembrete de Voo', slug: 'lembrete_voo', status: 'ativo', body: 'Olá {{cliente_primeiro_nome}}, seu voo {{origem}} → {{destino}} é em breve ({{data_voo}} {{horario_voo}}). Faça o check-in!' },
]

export const activityLog: ActivityLogEntry[] = Array.from({ length: 60 }, (_, i) => {
  const member = faker.helpers.arrayElement(members)
  const category = faker.helpers.arrayElement([
    'cotacoes', 'bilhetes', 'vendas', 'clientes', 'financeiro', 'contratos', 'comercial', 'seguranca', 'configuracoes',
  ] as const)
  return {
    id: `log-${i + 1}`,
    agencyId: AGENCY_ID,
    userId: member.id,
    userName: member.name,
    userInitials: member.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase(),
    category,
    description: faker.helpers.arrayElement([
      'criou um novo cliente',
      'moveu a cotação de Nova para Em Atendimento',
      'registrou uma nova venda',
      'emitiu um bilhete',
      'criou um voucher a partir da venda',
      'realizou login',
    ]),
    entityType: category,
    entityRef: faker.helpers.maybe(() => faker.helpers.arrayElement(sales).code, { probability: 0.4 }),
    createdAt: faker.date.recent({ days: 20 }).toISOString(),
  }
})

export const suppliers: Supplier[] = Array.from({ length: 14 }, (_, i) => ({
  id: `supplier-${i + 1}`,
  agencyId: AGENCY_ID,
  name: faker.company.name(),
  type: faker.helpers.arrayElement(SUPPLIER_TYPES),
  contact: faker.person.fullName(),
  phone: faker.phone.number({ style: 'international' }),
  status: faker.helpers.arrayElement(['active', 'active', 'active', 'inactive']),
}))

export const plans: Plan[] = [
  { id: 'plan-basic', name: 'Basic', priceMonthly: 47, maxUsers: 1, aiCredits: 50, features: ['Emissão de bilhetes', 'Check-in', 'Excursões', 'Calendário/Tarefas', 'Dashboard simplificado'] },
  { id: 'plan-autonomo', name: 'Autônomo', priceMonthly: 89, maxUsers: 1, aiCredits: 100, features: ['CRM', 'Voucher', 'Cotações Inteligentes', 'Vendas', 'Despesas/Receitas', 'Contratos', 'Recibos', 'Fornecedores', 'Painel de Conciliação', 'Relatórios Avançados', 'Metas'] },
  { id: 'plan-profissional', name: 'Profissional', priceMonthly: 135, maxUsers: 3, aiCredits: 200, features: ['Tudo do Autônomo', 'Multiusuário'] },
  { id: 'plan-agencia', name: 'Agência', priceMonthly: 297, maxUsers: 6, aiCredits: 500, features: ['Tudo do Profissional', 'Emissão de Nota Fiscal', 'Suporte prioritário'] },
]

export const subscription: Subscription = {
  id: 'sub-1',
  agencyId: AGENCY_ID,
  planId: 'plan-profissional',
  planName: 'Profissional',
  status: 'trial',
  trialEndsAt: faker.date.soon({ days: 9 }).toISOString(),
  usage: {
    aiCreditsUsed: 34,
    aiCreditsIncluded: 200,
    ticketsIssued: tickets.length,
    activeClients: clients.length,
    storageUsedMb: 340,
    storageLimitMb: 5120,
  },
}

export const tasks: Task[] = Array.from({ length: 14 }, (_, i) => ({
  id: `task-${i + 1}`,
  agencyId: AGENCY_ID,
  title: faker.helpers.arrayElement(['Enviar proposta', 'Confirmar pagamento', 'Solicitar documentos', 'Ligar para cliente', 'Revisar contrato']),
  description: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }),
  status: faker.helpers.arrayElement(['a_fazer', 'em_progresso', 'concluido']),
  dueDate: faker.date.soon({ days: 20 }).toISOString(),
  assigneeId: faker.helpers.arrayElement(members).id,
  assigneeName: faker.helpers.arrayElement(members).name,
  priority: faker.helpers.arrayElement(['baixa', 'normal', 'alta']),
}))

export const calendarEvents: CalendarEvent[] = Array.from({ length: 12 }, (_, i) => {
  const type = faker.helpers.arrayElement(['evento', 'tarefa', 'voo', 'servico'] as const)
  const client = faker.helpers.maybe(() => faker.helpers.arrayElement(clients), { probability: 0.5 })
  return {
    id: `event-${i + 1}`,
    agencyId: AGENCY_ID,
    type,
    title: type === 'voo' ? `Voo ${faker.helpers.arrayElement(AIRLINES)}` : faker.lorem.words(3),
    date: faker.date.soon({ days: 30 }).toISOString(),
    clientId: client?.id,
    clientName: client?.name,
  }
})
