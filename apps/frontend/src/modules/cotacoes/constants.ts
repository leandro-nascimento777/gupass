import type { QuoteStage } from '@/types/entities'

/** As 6 colunas fixas do Kanban (doc seção 6.1) — ordem e cor da borda vêm da referência real. */
export const QUOTE_STAGES: { key: QuoteStage; label: string; borderClass: string; dotClass: string }[] = [
  { key: 'nova', label: 'Nova', borderClass: 'border-t-blue-500', dotClass: 'bg-blue-500' },
  { key: 'em_atendimento', label: 'Em Atendimento', borderClass: 'border-t-amber-500', dotClass: 'bg-amber-500' },
  { key: 'proposta_enviada', label: 'Proposta Enviada', borderClass: 'border-t-sky-500', dotClass: 'bg-sky-500' },
  { key: 'aguardando_cliente', label: 'Aguardando Cliente', borderClass: 'border-t-purple-500', dotClass: 'bg-purple-500' },
  { key: 'aprovada', label: 'Aprovada', borderClass: 'border-t-success', dotClass: 'bg-success' },
  { key: 'perdida', label: 'Perdida', borderClass: 'border-t-destructive', dotClass: 'bg-destructive' },
]

export const QUOTE_PRIORITY_TONE = {
  baixa: 'neutral',
  normal: 'info',
  alta: 'warning',
} as const
