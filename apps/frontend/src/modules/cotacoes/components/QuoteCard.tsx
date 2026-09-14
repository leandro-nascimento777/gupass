import { useDraggable } from '@dnd-kit/core'
import { GripVertical, Minus, MessageCircle, TrendingDown, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Quote } from '@/types/entities'

const PRIORITY: Record<Quote['priority'], { label: string; icon: typeof Minus; className: string }> = {
  baixa: { label: 'Baixa', icon: TrendingDown, className: 'border-border bg-muted text-muted-foreground' },
  normal: { label: 'Normal', icon: Minus, className: 'border-blue-300 bg-blue-50 text-blue-700' },
  alta: { label: 'Alta', icon: TrendingUp, className: 'border-warning/30 bg-warning/10 text-warning' },
}

/**
 * Card arrastável do Kanban — layout confirmado ao vivo contra
 * fixpass.com.br/app/cotacoes (card COT-4688DF real): código e prioridade
 * como badges, grip decorativo, telefone como badge do WhatsApp na mesma
 * linha do valor.
 */
export function QuoteCard({ quote }: { quote: Quote }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: quote.id,
    data: { quote },
  })

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined

  const priority = PRIORITY[quote.priority]

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
        <Badge variant="outline" className="font-mono text-xs font-semibold text-muted-foreground">
          {quote.code}
        </Badge>
        <div className="flex items-center gap-1.5">
          <Badge variant="outline" className={cn('gap-1', priority.className)}>
            <priority.icon className="size-3" /> {priority.label}
          </Badge>
          <GripVertical className="size-4 shrink-0 text-muted-foreground/50" />
        </div>
      </div>

      <p className="truncate text-base font-bold uppercase">{quote.clientName}</p>

      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">Valor</p>
          <p className="text-sm font-black tabular-nums">{formatCurrency(quote.totalValue)}</p>
        </div>
        {quote.clientPhone && (
          <Badge variant="outline" className="gap-1 border-success/30 bg-success/10 text-success">
            <MessageCircle className="size-3" /> {quote.clientPhone}
          </Badge>
        )}
      </div>
    </div>
  )
}
