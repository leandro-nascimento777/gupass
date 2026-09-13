import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type StatusTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info'

const TONE_CLASSES: Record<StatusTone, string> = {
  neutral: 'border-border bg-muted text-muted-foreground',
  success: 'border-success/30 bg-success/10 text-success',
  warning: 'border-warning/30 bg-warning/10 text-warning',
  danger: 'border-destructive/30 bg-destructive/10 text-destructive',
  info: 'border-blue-300 bg-blue-50 text-blue-700',
}

interface StatusBadgeProps {
  label: string
  tone?: StatusTone
  className?: string
}

/**
 * Badge de status compartilhado — usado em Bilhetes, Cotações, Vendas,
 * Transações, Contas a Pagar, Contratos, Vouchers, Fiscal, etc. Cada módulo
 * mapeia seu próprio vocabulário de status para um `tone` (ver lib/status-maps.ts).
 */
export function StatusBadge({ label, tone = 'neutral', className }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn(TONE_CLASSES[tone], className)}>
      {label}
    </Badge>
  )
}
