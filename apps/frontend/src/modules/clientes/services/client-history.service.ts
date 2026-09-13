import { clientHistoryAdapter } from '../adapters/client-history.adapter'

export async function getClientHistory(clientId: string) {
  const [sales, quotes, contracts, vouchers, tickets] = await Promise.all([
    clientHistoryAdapter.listSales(clientId),
    clientHistoryAdapter.listQuotes(clientId),
    clientHistoryAdapter.listContracts(clientId),
    clientHistoryAdapter.listVouchers(clientId),
    clientHistoryAdapter.listTickets(clientId),
  ])

  return {
    sales: sales.data,
    quotes: quotes.data,
    contracts: contracts.data,
    vouchers: vouchers.data,
    tickets: tickets.data,
  }
}

export type ClientHistory = Awaited<ReturnType<typeof getClientHistory>>
