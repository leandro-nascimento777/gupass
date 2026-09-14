import { useMemo, useState } from 'react'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core'
import { Clock, FileText, Plus, SlidersHorizontal, TrendingUp } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/format'
import { useUiStore } from '@/lib/stores/ui-store'
import { QUOTE_STAGES } from '../constants'
import { KanbanColumn } from '../components/KanbanColumn'
import { QuoteCard } from '../components/QuoteCard'
import { useMoveQuote, useQuotesBoard } from '../hooks/useQuotes'
import type { Quote, QuoteStage } from '@/types/entities'

export function CotacoesPage() {
  const [search, setSearch] = useState('')
  const [activeQuote, setActiveQuote] = useState<Quote | null>(null)
  const { data, isLoading } = useQuotesBoard()
  const moveQuote = useMoveQuote()
  const setNovaCotacaoDialogOpen = useUiStore((s) => s.setNovaCotacaoDialogOpen)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  const quotes = useMemo(() => {
    const all = data?.data ?? []
    if (!search.trim()) return all
    const q = search.toLowerCase()
    return all.filter((quote) => quote.clientName.toLowerCase().includes(q) || quote.code.toLowerCase().includes(q))
  }, [data, search])

  const quotesByStage = useMemo(() => {
    const map = new Map<QuoteStage, Quote[]>(QUOTE_STAGES.map((s) => [s.key, []]))
    for (const quote of quotes) {
      map.get(quote.stage)?.push(quote)
    }
    return map
  }, [quotes])

  const totalCount = data?.data.length ?? 0
  const awaitingCount = data?.data.filter((q) => q.stage === 'aguardando_cliente').length ?? 0
  const openValue = (data?.data ?? [])
    .filter((q) => q.stage !== 'perdida')
    .reduce((sum, q) => sum + q.totalValue, 0)

  function handleDragStart(event: DragStartEvent) {
    setActiveQuote((event.active.data.current?.quote as Quote) ?? null)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveQuote(null)
    const quote = event.active.data.current?.quote as Quote | undefined
    const toStage = event.over?.id as QuoteStage | undefined
    if (!quote || !toStage || toStage === quote.stage) return
    moveQuote.mutate({ quote, toStage })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl border bg-card px-4 py-2">
          <FileText className="size-4 text-muted-foreground" />
          <div>
            <p className="text-lg leading-none font-black">{totalCount}</p>
            <p className="text-xs text-muted-foreground uppercase">Total de Cotações</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl border bg-card px-4 py-2">
          <Clock className="size-4 text-warning" />
          <div>
            <p className="text-lg leading-none font-black">{awaitingCount}</p>
            <p className="text-xs text-muted-foreground uppercase">Aguardando Resposta</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl border bg-card px-4 py-2">
          <TrendingUp className="size-4 text-success" />
          <div>
            <p className="text-lg leading-none font-black">{formatCurrency(openValue)}</p>
            <p className="text-xs text-muted-foreground uppercase">Valor Total</p>
          </div>
        </div>
        <Button className="ml-auto" onClick={() => setNovaCotacaoDialogOpen(true)}>
          <Plus className="size-4" /> Nova Cotação
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[240px] flex-1">
          <Input
            placeholder="Buscar por cliente, destino..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <SlidersHorizontal className="size-4" />
          Filtros
        </Button>
      </div>

      {isLoading ? (
        <div className="flex gap-3 overflow-x-auto">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-96 w-72 shrink-0 rounded-xl" />
          ))}
        </div>
      ) : (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {QUOTE_STAGES.map((stage) => (
              <KanbanColumn
                key={stage.key}
                stage={stage.key}
                label={stage.label}
                borderClass={stage.borderClass}
                dotClass={stage.dotClass}
                quotes={quotesByStage.get(stage.key) ?? []}
              />
            ))}
          </div>
          <DragOverlay>{activeQuote && <QuoteCard quote={activeQuote} />}</DragOverlay>
        </DndContext>
      )}
    </div>
  )
}
