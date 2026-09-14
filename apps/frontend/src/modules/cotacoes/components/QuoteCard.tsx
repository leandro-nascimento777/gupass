import { useDraggable } from '@dnd-kit/core'
import { Phone } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import { QUOTE_PRIORITY_TONE } from '../constants'
import type { Quote } from '@/types/entities'

const PRIORITY_LABEL: Record<Quote['priority'], string> = {
  baixa: 'Baixa',
  normal: 'Normal',
  alta: 'Alta',
}

const TONE_CLASSES: Record<(typeof QUOTE_PRIORITY_TONE)[keyof typeof QUOTE_PRIORITY_TONE], string> = {
  neutral: 'border-border bg-muted text-muted-foreground',
  info: 'border-blue-300 bg-blue-50 text-blue-700',
  warning: 'border-warning/30 bg-warning/10 text-warning',
}

/**
 * Card arrastável do Kanban — layout confirmado contra a referência real
 * (Cotações - FixPass 22:04:00, card COT-4688DF): código, prioridade, nome
 * do cliente, rótulo "VALOR" + valor, telefone.
 */
export function QuoteCard({ quote }: { quote: Quote }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: quote.id,
    data: { quote },
  })

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-testid={`quote-card-${quote.id}`}
      {...listeners}
      {...attributes}
      className={cn(
        'flex cursor-grab flex-col gap-2 rounded-xl border bg-card p-3 text-sm shadow-sm active:cursor-grabbing',
        isDragging && 'opacity-40',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs font-semibold text-muted-foreground">{quote.code}</span>
        <Badge variant="outline" className={TONE_CLASSES[QUOTE_PRIORITY_TONE[quote.priority]]}>
          {PRIORITY_LABEL[quote.priority]}
        </Badge>
      </div>
      <p className="font-medium">{quote.clientName}</p>
      <div>
        <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">Valor</p>
        <p className="text-sm font-black tabular-nums">{formatCurrency(quote.totalValue)}</p>
      </div>
      {quote.clientPhone && (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Phone className="size-3" /> {quote.clientPhone}
        </p>
      )}
    </div>
  )
}
