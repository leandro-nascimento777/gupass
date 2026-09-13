import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WizardStepIndicatorProps {
  steps: readonly string[]
  currentStep: number
}

/** Indicador de passos numerados com linha conectora — ver referência real do wizard "Novo Cliente". */
export function WizardStepIndicator({ steps, currentStep }: WizardStepIndicatorProps) {
  return (
    <div className="flex items-center">
      {steps.map((label, index) => {
        const isCompleted = index < currentStep
        const isActive = index === currentStep
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold',
                  isCompleted && 'border-success bg-success text-white',
                  isActive && 'border-brand-dark bg-brand-dark text-white',
                  !isCompleted && !isActive && 'border-border text-muted-foreground',
                )}
              >
                {isCompleted ? <Check className="size-3.5" /> : index + 1}
              </div>
              <span
                className={cn(
                  'hidden text-sm font-medium whitespace-nowrap md:inline',
                  isCompleted && 'text-success',
                  isActive && 'text-foreground',
                  !isCompleted && !isActive && 'text-muted-foreground',
                )}
              >
                {label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={cn('mx-2 h-px flex-1', isCompleted ? 'bg-success' : 'bg-border')} />
            )}
          </div>
        )
      })}
    </div>
  )
}
