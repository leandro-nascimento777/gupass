import { Building2, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PersonTypeToggleProps {
  value: 'PF' | 'PJ'
  onChange: (value: 'PF' | 'PJ') => void
}

/** Toggle Pessoa Física/Jurídica do wizard de cliente — usado pelo modal
 * interno (NovoClienteDialog) e pela página pública (ClientePublicoPage). */
export function PersonTypeToggle({ value, onChange }: PersonTypeToggleProps) {
  return (
    <div className="inline-flex w-fit items-center gap-1 rounded-full border bg-muted p-1">
      <button
        type="button"
        onClick={() => onChange('PF')}
        className={cn(
          'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium',
          value === 'PF' ? 'bg-card shadow-sm' : 'text-muted-foreground',
        )}
      >
        <User className="size-3.5" /> Pessoa Física
      </button>
      <button
        type="button"
        onClick={() => onChange('PJ')}
        className={cn(
          'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium',
          value === 'PJ' ? 'bg-card shadow-sm' : 'text-muted-foreground',
        )}
      >
        <Building2 className="size-3.5" /> Pessoa Jurídica
      </button>
    </div>
  )
}
