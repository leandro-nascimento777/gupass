import type { StatusTone } from '@/components/shared/StatusBadge'

/** Mapas status → {label, tone} por domínio. Vai crescendo conforme os módulos são construídos. */

export const ticketStatusMap: Record<string, { label: string; tone: StatusTone }> = {
  confirmado: { label: 'Confirmado', tone: 'success' },
  pendente: { label: 'Pendente', tone: 'warning' },
  erro: { label: 'Erro', tone: 'danger' },
  cancelado: { label: 'Cancelado', tone: 'neutral' },
}

export const quoteStageMap: Record<string, { label: string; tone: StatusTone }> = {
  nova: { label: 'Nova', tone: 'info' },
  em_atendimento: { label: 'Em Atendimento', tone: 'info' },
  proposta_enviada: { label: 'Proposta Enviada', tone: 'warning' },
  aguardando_cliente: { label: 'Aguardando Cliente', tone: 'warning' },
  aprovada: { label: 'Aprovada', tone: 'success' },
  perdida: { label: 'Perdida', tone: 'danger' },
}

export const saleStatusMap: Record<string, { label: string; tone: StatusTone }> = {
  pendente: { label: 'Pendente', tone: 'warning' },
  confirmada: { label: 'Confirmada', tone: 'success' },
  cancelada: { label: 'Cancelada', tone: 'danger' },
}

export const paymentStatusMap: Record<string, { label: string; tone: StatusTone }> = {
  pendente: { label: 'Pendente', tone: 'warning' },
  parcial: { label: 'Parcial', tone: 'info' },
  pago: { label: 'Pago', tone: 'success' },
}
