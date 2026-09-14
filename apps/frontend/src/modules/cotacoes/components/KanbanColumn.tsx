import { useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'
import { QuoteCard } from './QuoteCard'
import type { Quote, QuoteStage } from '@/types/entities'

interface KanbanColumnProps {
  stage: QuoteStage
  label: string
  borderClass: string
  dotClass: string
  quotes: Quote[]
}

export function KanbanColumn({ stage, label, borderClass, dotClass, quotes }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage })

  return (
    <div className={cn('flex w-72 shrink-0 flex-col rounded-xl border border-t-4 bg-muted/30', borderClass)}>
      <div className="flex items-center justify-between gap-2 p-3">
        <div className="flex items-center gap-1.5">
          <span className={cn('size-1.5 rounded-full', dotClass)} />
          <span className="text-xs font-bold tracking-wide uppercase">{label}</span>
        </div>
        <span className="rounded-full bg-background px-2 py-0.5 text-xs font-semibold">{quotes.length}</span>
      </div>

      <div
        ref={setNodeRef}
        data-testid={`kanban-column-${stage}`}
        className={cn(
          'flex min-h-40 flex-1 flex-col gap-2 p-2 transition-colors',
          isOver && 'bg-brand-primary/10',
        )}
      >
        {quotes.length === 0 ? (
          <p className="flex flex-1 items-center justify-center py-8 text-center text-xs text-muted-foreground">
            Arraste cotações aqui
          </p>
        ) : (
          quotes.map((quote) => <QuoteCard key={quote.id} quote={quote} />)
        )}
      </div>
    </div>
  )
}
