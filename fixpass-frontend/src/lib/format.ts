/**
 * Moeda padrão fixa em BRL por enquanto — a doc (seção 11.1/15.12) modela
 * "moeda padrão" configurável por agência; quando o backend expuser isso,
 * trocar aqui para usar agency.defaultCurrency.
 */
const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(
    new Date(value),
  )
}

export function formatRelativeTime(value: string | Date) {
  const diffMs = Date.now() - new Date(value).getTime()
  const diffMin = Math.round(diffMs / 60_000)
  if (diffMin < 1) return 'agora'
  if (diffMin < 60) return `${diffMin}min atrás`
  const diffHours = Math.round(diffMin / 60)
  if (diffHours < 24) return `${diffHours}h atrás`
  const diffDays = Math.round(diffHours / 24)
  return `${diffDays}d atrás`
}
