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

/**
 * Datas "puras" (sem horário, ex. "1987-12-11" — nascimento, validade de
 * passaporte) precisam ser lidas em UTC, senão `new Date(...)` as ancora em
 * meia-noite UTC e o fuso local pode exibir o dia anterior (ex. virou
 * 10/12 em vez de 11/12 num fuso UTC-3). Datas com horário (createdAt etc.)
 * continuam no fuso do navegador normalmente.
 */
export function formatDate(value: string | Date) {
  const isDateOnly = typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: isDateOnly ? 'UTC' : undefined,
  }).format(new Date(value))
}

/** "set. de 2026" — usado na Ficha do Cliente ("Cliente desde..."). */
export function formatMonthYear(value: string | Date) {
  return new Intl.DateTimeFormat('pt-BR', { month: 'short', year: 'numeric' }).format(new Date(value))
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
