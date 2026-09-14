import { HttpResponse, http } from 'msw'
import type { DashboardKpis, ManagedPublicLink, PublicClientLinkInfo, TemporaryPublicLink } from '@/types/entities'
import { createCrudHandlers } from './handler-factory'
import { db } from './store'

const MAX_MANAGED_LINKS = 5
const TEMPORARY_LINK_TTL_MS = 24 * 60 * 60 * 1000

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/** Resolve um slug de link público (permanente, gerenciável ou temporário) para as
 * informações que a página pública precisa (tema, cores, campos ocultos). */
function resolvePublicClientLink(slug: string): PublicClientLinkInfo | null {
  const settings = db.clientPublicLinkSettings
  const isPermanent = slug === settings.permanentSlug
  const managed = settings.managedLinks.find((l) => l.slug === slug)
  const temporary = settings.temporaryLinks.find((l) => l.slug === slug)

  if (temporary && new Date(temporary.expiresAt).getTime() < Date.now()) {
    return null // expirado
  }
  if (!isPermanent && !managed && !temporary) return null

  return {
    agencyId: db.agency.id,
    agencyName: db.agency.name,
    theme: settings.theme,
    backgroundColor: settings.backgroundColor,
    hiddenFields: settings.hiddenFields,
  }
}

function computeDashboardKpis(period: string): DashboardKpis {
  const salesInPeriod = db.sales.filter((s) => s.status !== 'cancelada')
  const salesTotal = salesInPeriod.reduce((sum, s) => sum + s.totalValue, 0)
  const grossProfit = salesInPeriod.reduce((sum, s) => sum + s.profit, 0)
  const revenueReceived = db.transactions
    .filter((t) => t.type === 'entrada' && t.status === 'realizada')
    .reduce((sum, t) => sum + t.value, 0)
  const overdue = db.transactions.filter((t) => t.status === 'atrasada')
  const payablesTotal = db.payables.filter((p) => p.status === 'pendente' || p.status === 'vencido').reduce((s, p) => s + p.value, 0)
  const expensesPaid = db.transactions.filter((t) => t.type === 'saida' && t.status === 'realizada').reduce((s, t) => s + t.value, 0)
  const newQuotes = db.quotes.filter((q) => q.stage === 'nova')
  const approvedQuotes = db.quotes.filter((q) => q.stage === 'aprovada')
  const conversionFraction: [number, number] = [approvedQuotes.length, db.quotes.length || 1]

  const cashFlow = Array.from({ length: 6 }).map((_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (5 - i))
    return {
      date: date.toISOString().slice(0, 7),
      income: Math.round(salesTotal * (0.6 + Math.random() * 0.5)),
      expense: Math.round(expensesPaid * (0.5 + Math.random() * 0.6)),
    }
  })

  return {
    period,
    latestTickets: db.tickets.slice(0, 5).map((t) => ({
      id: t.id,
      airline: t.airline,
      label: `${t.pnr.toUpperCase()} · ${t.passengerLastName}`,
      date: t.createdAt,
      status: t.status,
    })),
    quotesTotal: db.quotes.length,
    quotesNew: newQuotes.length,
    checkinsPending: db.tickets.filter((t) => t.status === 'confirmado').length,
    conversionRate: Math.round((conversionFraction[0] / conversionFraction[1]) * 100),
    conversionFraction,
    salesCount: salesInPeriod.length,
    salesTotal: Number(salesTotal.toFixed(2)),
    averageTicket: Number((salesTotal / (salesInPeriod.length || 1)).toFixed(2)),
    revenueBilled: Number(salesTotal.toFixed(2)),
    revenueReceived: Number(revenueReceived.toFixed(2)),
    payablesTotal: Number(payablesTotal.toFixed(2)),
    expensesPaid: Number(expensesPaid.toFixed(2)),
    cashFlow,
    overdueTransactionsCount: overdue.length,
    overdueTransactionsTotal: Number(overdue.reduce((s, t) => s + t.value, 0).toFixed(2)),
    grossProfit: Number(grossProfit.toFixed(2)),
  }
}

export const handlers = [
  http.get('/api/dashboard', async ({ request }) => {
    const url = new URL(request.url)
    const period = url.searchParams.get('period') ?? 'mes'
    await new Promise((r) => setTimeout(r, 300))
    return HttpResponse.json(computeDashboardKpis(period))
  }),

  http.get('/api/agency', () => HttpResponse.json(db.agency)),
  http.patch('/api/agency', async ({ request }) => {
    const body = (await request.json()) as Partial<typeof db.agency>
    Object.assign(db.agency, body)
    return HttpResponse.json(db.agency)
  }),

  http.get('/api/subscription', () => HttpResponse.json(db.subscription)),

  ...createCrudHandlers('/api/plans', db.plans),
  ...createCrudHandlers('/api/members', db.members, { searchFields: ['name', 'email'] }),
  ...createCrudHandlers('/api/client-categories', db.clientCategories, { searchFields: ['name'] }),

  // Link Público de Clientes (seção 5.5) — precisa vir ANTES do CRUD genérico
  // de /api/clients logo abaixo, senão o `:id` dele casa com
  // "public-link-settings" e responde 404 antes de chegar aqui.
  http.get('/api/clients/public-link-settings', () => HttpResponse.json(db.clientPublicLinkSettings)),
  http.patch('/api/clients/public-link-settings', async ({ request }) => {
    const body = (await request.json()) as Partial<typeof db.clientPublicLinkSettings>
    Object.assign(db.clientPublicLinkSettings, body)
    return HttpResponse.json(db.clientPublicLinkSettings)
  }),
  http.post('/api/clients/public-link-settings/managed-links', async ({ request }) => {
    const settings = db.clientPublicLinkSettings
    if (settings.managedLinks.length >= MAX_MANAGED_LINKS) {
      return HttpResponse.json({ message: `Limite de ${MAX_MANAGED_LINKS} links gerenciáveis atingido.` }, { status: 400 })
    }
    const body = (await request.json()) as { name: string; utmSource?: string }
    const link: ManagedPublicLink = {
      id: `mlink-${crypto.randomUUID().slice(0, 8)}`,
      name: body.name,
      utmSource: body.utmSource,
      slug: `${settings.permanentSlug}-${slugify(body.name)}`,
      createdAt: new Date().toISOString(),
    }
    settings.managedLinks.unshift(link)
    return HttpResponse.json(link, { status: 201 })
  }),
  http.delete('/api/clients/public-link-settings/managed-links/:id', ({ params }) => {
    const settings = db.clientPublicLinkSettings
    settings.managedLinks = settings.managedLinks.filter((l) => l.id !== params.id)
    return new HttpResponse(null, { status: 204 })
  }),
  http.post('/api/clients/public-link-settings/temporary-links', () => {
    const settings = db.clientPublicLinkSettings
    const link: TemporaryPublicLink = {
      id: `tlink-${crypto.randomUUID().slice(0, 8)}`,
      slug: `tmp-${crypto.randomUUID().slice(0, 10)}`,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + TEMPORARY_LINK_TTL_MS).toISOString(),
    }
    settings.temporaryLinks.unshift(link)
    return HttpResponse.json(link, { status: 201 })
  }),
  http.delete('/api/clients/public-link-settings/temporary-links/:id', ({ params }) => {
    const settings = db.clientPublicLinkSettings
    settings.temporaryLinks = settings.temporaryLinks.filter((l) => l.id !== params.id)
    return new HttpResponse(null, { status: 204 })
  }),

  ...createCrudHandlers('/api/clients', db.clients, {
    searchFields: ['name', 'email', 'document'],
    filterFields: ['personType'],
  }),
  ...createCrudHandlers('/api/quotes', db.quotes, {
    searchFields: ['clientName', 'code'],
    filterFields: ['stage', 'clientId'],
  }),
  ...createCrudHandlers('/api/sales', db.sales, {
    searchFields: ['clientName', 'code'],
    filterFields: ['status', 'paymentStatus', 'clientId'],
  }),
  ...createCrudHandlers('/api/tickets', db.tickets, {
    searchFields: ['pnr', 'passengerLastName', 'code'],
    filterFields: ['status', 'airline', 'clientId'],
  }),
  ...createCrudHandlers('/api/vouchers', db.vouchers, {
    searchFields: ['clientName', 'code', 'title'],
    filterFields: ['status', 'clientId'],
  }),
  ...createCrudHandlers('/api/transactions', db.transactions, {
    searchFields: ['description', 'clientName'],
    filterFields: ['type', 'status'],
  }),
  ...createCrudHandlers('/api/payables', db.payables, {
    searchFields: ['description'],
    filterFields: ['status'],
  }),
  ...createCrudHandlers('/api/bank-accounts', db.bankAccounts, { searchFields: ['name', 'institution'] }),
  ...createCrudHandlers('/api/commissions', db.commissions, { filterFields: ['status', 'sellerId'] }),
  ...createCrudHandlers('/api/goals', db.goals, { filterFields: ['month', 'year', 'ownerId'] }),
  ...createCrudHandlers('/api/contracts', db.contracts, { searchFields: ['clientName', 'code'], filterFields: ['status', 'clientId'] }),
  ...createCrudHandlers('/api/receipts', db.receipts, { searchFields: ['clientName', 'code'], filterFields: ['clientId'] }),
  ...createCrudHandlers('/api/fiscal-invoices', db.fiscalInvoices, { filterFields: ['status'] }),
  ...createCrudHandlers('/api/whatsapp-templates', db.whatsappTemplates, { searchFields: ['name'] }),
  ...createCrudHandlers('/api/activity-log', db.activityLog, {
    searchFields: ['description', 'userName', 'entityRef'],
    filterFields: ['category'],
  }),
  ...createCrudHandlers('/api/suppliers', db.suppliers, {
    searchFields: ['name'],
    filterFields: ['type', 'status'],
  }),
  ...createCrudHandlers('/api/tasks', db.tasks, { filterFields: ['status'] }),
  ...createCrudHandlers('/api/calendar-events', db.calendarEvents, { filterFields: ['type'] }),

  // Página pública (sem login) — resolve o slug acessado, seja permanente, gerenciável ou temporário.
  http.get('/api/public/client-link/:slug', ({ params }) => {
    const info = resolvePublicClientLink(String(params.slug))
    if (!info) return HttpResponse.json({ message: 'Link não encontrado ou expirado.' }, { status: 404 })
    return HttpResponse.json(info)
  }),
]
