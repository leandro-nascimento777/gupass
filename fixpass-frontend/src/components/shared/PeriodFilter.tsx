import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PeriodOption {
  value: string
  label: string
}

const DEFAULT_OPTIONS: PeriodOption[] = [
  { value: 'hoje', label: 'Hoje' },
  { value: 'ontem', label: 'Ontem' },
  { value: 'semana', label: 'Semana' },
  { value: 'mes', label: 'Mês' },
  { value: 'ano', label: 'Ano' },
]

interface PeriodFilterProps {
  value: string
  onChange: (value: string) => void
  options?: PeriodOption[]
  /** Exibe o botão extra "Período" (intervalo customizado) — ver referência real. */
  showCustomRange?: boolean
  onCustomRangeClick?: () => void
}

/**
 * Filtro de período compartilhado (Hoje/Ontem/Semana/Mês/Ano/Período) — aparece
 * no Dashboard, Painel Financeiro, Vendas, Transações, Contas a Pagar, etc.
 * Estado ativo em navy escuro (cor da marca), conforme referência real.
 */
export function PeriodFilter({ value, onChange, options = DEFAULT_OPTIONS, showCustomRange, onCustomRangeClick }: PeriodFilterProps) {
  return (
    <div className="inline-flex flex-wrap items-center gap-1 rounded-full bg-muted p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
            value === option.value
              ? 'bg-brand-dark text-white shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {option.label}
        </button>
      ))}
      {showCustomRange && (
        <button
          type="button"
          onClick={onCustomRangeClick}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <Calendar className="size-3.5" />
          Período
        </button>
      )}
    </div>
  )
}
