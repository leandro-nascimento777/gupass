import type { ReactNode } from 'react'
import { TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AlertBannerProps {
  title: string
  description: ReactNode
  actionLabel?: string
  onAction?: () => void
  onDismiss?: () => void
}

/**
 * Banner de aviso dispensável (âmbar) — usado no topo do Dashboard para
 * "e-mail não verificado" e "complete as informações da agência" (ver
 * referência real). Reutilizável para outros avisos do mesmo tipo.
 */
export function AlertBanner({ title, description, actionLabel, onAction, onDismiss }: AlertBannerProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
      <div className="flex items-start gap-3">
        <TriangleAlert className="mt-0.5 size-5 shrink-0 text-amber-500" />
        <div>
          <p className="text-sm font-bold text-amber-900">{title}</p>
          <p className="text-sm text-amber-800/80">{description}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {actionLabel && (
          <Button
            size="sm"
            variant="outline"
            className="border-amber-300 bg-white text-amber-900 hover:bg-amber-100"
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        )}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="text-sm font-medium text-amber-700/70 hover:text-amber-900"
          >
            Dispensar
          </button>
        )}
      </div>
    </div>
  )
}
