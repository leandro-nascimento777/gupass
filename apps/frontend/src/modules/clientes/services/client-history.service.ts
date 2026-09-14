import { clientHistoryAdapter } from '../adapters/client-history.adapter'

export interface ClientKpis {
  /** Faturamento (LTV) — soma do valor total das vendas não canceladas. */
  ltv: number
  /** Lucro Estimado — soma do lucro das vendas não canceladas. */
  estimatedProfit: number
  /** Ticket Médio — LTV dividido pela quantidade de vendas. */
  averageTicket: number
  /** Última Movimentação — data mais recente entre vendas/cotações/contratos/recibos/bilhetes. */
  lastMovementAt: string | null
}

export async function getClientHistory(clientId: string) {
  const [sales, quotes, contracts, receipts, tickets] = await Promise.all([
    clientHistoryAdapter.listSales(clientId),
    clientHistoryAdapter.listQuotes(clientId),
    clientHistoryAdapter.listContracts(clientId),
    clientHistoryAdapter.listReceipts(clientId),
    clientHistoryAdapter.listTickets(clientId),
  ])

  const validSales = sales.data.filter((s) => s.status !== 'cancelada')
  const ltv = validSales.reduce((sum, s) => sum + s.totalValue, 0)
  const estimatedProfit = validSales.reduce((sum, s) => sum + s.profit, 0)
  const averageTicket = validSales.length > 0 ? ltv / validSales.length : 0

  const allDates = [
    ...sales.data.map((s) => s.saleDate),
    ...quotes.data.map((q) => q.updatedAt),
    ...contracts.data.map((c) => c.createdAt),
    ...receipts.data.map((r) => r.issuedAt),
    ...tickets.data.map((t) => t.createdAt),
  ]
  const lastMovementAt = allDates.length > 0 ? allDates.reduce((a, b) => (a > b ? a : b)) : null

  const kpis: ClientKpis = { ltv, estimatedProfit, averageTicket, lastMovementAt }

  return {
    sales: sales.data,
    quotes: quotes.data,
    contracts: contracts.data,
    receipts: receipts.data,
    tickets: tickets.data,
    kpis,
  }
}

export type ClientHistory = Awaited<ReturnType<typeof getClientHistory>>
