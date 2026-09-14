import { quotesAdapter, type ListQuotesParams } from '../adapters/quotes.adapter'
import { logActivity } from '@/lib/activity-log'
import { quoteStageMap } from '@/lib/status-maps'
import type { Quote, QuoteStage } from '@/types/entities'

export type { ListQuotesParams }

const KANBAN_PAGE_SIZE = 200

/** O Kanban precisa do board inteiro de uma vez, não paginado. */
export function listQuotesForBoard() {
  return quotesAdapter.list({ pageSize: KANBAN_PAGE_SIZE })
}

export interface NewQuoteLead {
  clientId?: string
  clientName: string
  clientPhone?: string
  clientEmail?: string
  notes?: string
  ownerId?: string
  ownerName?: string
}

function generateQuoteCode() {
  return `COT-${crypto.randomUUID().slice(0, 6).toUpperCase()}`
}

/** Cria a cotação já na coluna "Nova" — montar a proposta (itens/valor) é uma etapa futura. */
export function createQuoteFromLead(lead: NewQuoteLead) {
  const payload: Partial<Quote> = {
    code: generateQuoteCode(),
    clientId: lead.clientId,
    clientName: lead.clientName,
    clientPhone: lead.clientPhone || undefined,
    clientEmail: lead.clientEmail || undefined,
    notes: lead.notes || undefined,
    ownerId: lead.ownerId,
    ownerName: lead.ownerName,
    stage: 'nova',
    totalValue: 0,
    priority: 'normal',
  }
  return quotesAdapter.create(payload)
}

/**
 * Move um card entre colunas do Kanban. Regra da doc (seção 6, "Regras de
 * negócio"): mover uma cotação entre estágios deve gerar um evento no log de
 * atividades — é a única razão de isso ser uma função de service e não só um
 * PATCH direto no hook.
 */
export async function moveQuoteToStage(quote: Quote, toStage: QuoteStage) {
  const updated = await quotesAdapter.update(quote.id, { stage: toStage })
  const fromLabel = quoteStageMap[quote.stage]?.label ?? quote.stage
  const toLabel = quoteStageMap[toStage]?.label ?? toStage
  await logActivity({
    category: 'cotacoes',
    description: `moveu a cotação de ${fromLabel} para ${toLabel}`,
    entityType: 'cotacoes',
    entityRef: quote.code,
  })
  return updated
}

export function deleteQuote(id: string) {
  return quotesAdapter.remove(id)
}
