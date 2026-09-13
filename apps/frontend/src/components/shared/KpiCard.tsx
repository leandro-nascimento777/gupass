import type { LucideIcon } from 'lucide-react'
import { HelpCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { useUiStore } from '@/lib/stores/ui-store'
import { formatCurrency } from '@/lib/format'

interface KpiCardProps {
  label: string
  /** Valor já formatado (texto) ou número — se for número e `isCurrency`, formata em BRL. */
  value: string | number
  isCurrency?: boolean
  icon?: LucideIcon
  hint?: string
  help?: string
  periodTag?: string
  tone?: 'default' | 'success' | 'warning' | 'danger'
}

const TONE_TEXT: Record<NonNullable<KpiCardProps['tone']>, string> = {
  default: 'text-foreground',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-destructive',
}

const TONE_BADGE: Record<NonNullable<KpiCardProps['tone']>, string> = {
  default: 'bg-brand-primary/15 text-brand-dark',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  danger: 'bg-destructive/15 text-destructive',
}

/**
 * Card de KPI compartilhado (ver referência real: ícone em badge arredondado,
 * título + "?" de ajuda opcional, tag de período no topo direito, valor em
 * destaque e legenda pequena). Usado no Dashboard, Painel Financeiro, Vendas,
 * Contas a Pagar, etc.
 */
export function KpiCard({ label, value, isCurrency, icon: Icon, hint, help, periodTag, tone = 'default' }: KpiCardProps) {
  const hideFinancialValues = useUiStore((s) => s.hideFinancialValues)

  const displayValue =
    isCurrency && hideFinancialValues
      ? '••••••'
      : isCurrency && typeof value === 'number'
        ? formatCurrency(value)
        : value

  return (
    <Card className="rounded-2xl shadow-none">
      <CardContent className="flex flex-col gap-3 py-1">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className={cn('flex size-8 shrink-0 items-center justify-center rounded-lg', TONE_BADGE[tone])}>
              <Icon className="size-4" />
            </div>
          )}
          <span className="text-sm font-medium text-foreground/90">{label}</span>
          {help && (
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="size-3.5 shrink-0 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>{help}</TooltipContent>
            </Tooltip>
          )}
          {periodTag && <span className="ml-auto shrink-0 text-xs text-muted-foreground">{periodTag}</span>}
        </div>
        <div>
          <span className={cn('text-2xl font-black tabular-nums', TONE_TEXT[tone])}>{displayValue}</span>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
