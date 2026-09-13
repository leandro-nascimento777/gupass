/**
 * Adapter só de leitura, específico da Ficha do Cliente (DOCUMENTACAO_TCC_FIXPASS.md
 * seção 5.3: "consolidando histórico do cliente: vendas, cotações, contratos,
 * vouchers, bilhetes"). Os recursos em si (Sale, Quote, Contract, Voucher,
 * Ticket) pertencem aos seus próprios módulos — ainda não construídos — mas a
 * consulta "tudo desse cliente" é uma necessidade da Ficha, não deles; por
 * isso mora aqui, não em módulos que ainda não existem de verdade.
 */
import { httpClient } from '@/lib/api/http-client'
import type { Contract, Paginated, Quote, Sale, Ticket, Voucher } from '@/types/entities'

const HISTORY_PAGE_SIZE = 50

export const clientHistoryAdapter = {
  listSales(clientId: string) {
    return httpClient.get<Paginated<Sale>>('/sales', { clientId, pageSize: HISTORY_PAGE_SIZE })
  },
  listQuotes(clientId: string) {
    return httpClient.get<Paginated<Quote>>('/quotes', { clientId, pageSize: HISTORY_PAGE_SIZE })
  },
  listContracts(clientId: string) {
    return httpClient.get<Paginated<Contract>>('/contracts', { clientId, pageSize: HISTORY_PAGE_SIZE })
  },
  listVouchers(clientId: string) {
    return httpClient.get<Paginated<Voucher>>('/vouchers', { clientId, pageSize: HISTORY_PAGE_SIZE })
  },
  listTickets(clientId: string) {
    return httpClient.get<Paginated<Ticket>>('/tickets', { clientId, pageSize: HISTORY_PAGE_SIZE })
  },
}
