import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronLeft, ChevronRight, UserPlus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  PF_DEFAULTS,
  PF_STEPS,
  PF_STEP_FIELDS,
  PJ_DEFAULTS,
  PJ_STEPS,
  PJ_STEP_FIELDS,
  clientPFSchema,
  clientPJSchema,
  type ClientPFFormValues,
  type ClientPJFormValues,
} from '../validators/client.schema'
import { useCreateClient } from '../hooks/useClients'
import { WizardStepIndicator } from '@/components/shared/client-form/WizardStepIndicator'
import { PersonTypeToggle } from '@/components/shared/client-form/PersonTypeToggle'
import { ClientWizardFormBody } from '@/components/shared/client-form/ClientWizardFormBody'
import { useUiStore } from '@/lib/stores/ui-store'

/**
 * Wizard "Novo Cliente" — modal centralizado com 4 passos, PF/PJ (ver referência
 * real). Montado uma única vez em AppLayout e controlado pelo ui-store, porque
 * o atalho "Novo Cliente" da QuickActionsBar precisa abri-lo de qualquer tela,
 * não só da página de Clientes (nunca navega — ver ARCHITECTURE.md).
 */
export function NovoClienteDialog() {
  const open = useUiStore((s) => s.novoClienteDialogOpen)
  const onOpenChange = useUiStore((s) => s.setNovoClienteDialogOpen)
  const [personType, setPersonType] = useState<'PF' | 'PJ'>('PF')
  const [step, setStep] = useState(0)
  const createClient = useCreateClient()

  const pfForm = useForm<ClientPFFormValues>({
    resolver: zodResolver(clientPFSchema),
    defaultValues: PF_DEFAULTS,
  })
  const pjForm = useForm<ClientPJFormValues>({
    resolver: zodResolver(clientPJSchema),
    defaultValues: PJ_DEFAULTS,
  })

  const steps = personType === 'PF' ? PF_STEPS : PJ_STEPS
  const stepFields = personType === 'PF' ? PF_STEP_FIELDS : PJ_STEP_FIELDS
  const isLastStep = step === steps.length - 1

  function resetAndClose() {
    setStep(0)
    setPersonType('PF')
    pfForm.reset(PF_DEFAULTS)
    pjForm.reset(PJ_DEFAULTS)
    onOpenChange(false)
  }

  async function handleNext() {
    const form = personType === 'PF' ? pfForm : pjForm
    const fields = stepFields[step]
    const valid = fields.length === 0 || (await form.trigger(fields as never))
    if (!valid) return

    if (isLastStep) {
      const values = form.getValues()
      // O mapeamento form -> payload de API vive no service (buildClientPayload),
      // a view só entrega o que o usuário preencheu.
      await createClient.mutateAsync({ personType, values })
      resetAndClose()
      return
    }

    setStep((s) => s + 1)
  }

  function handleBack() {
    if (step === 0) return
    setStep((s) => s - 1)
  }

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(next) : resetAndClose())}>
      <DialogContent className="flex max-h-[85vh] flex-col gap-0 p-0 sm:max-w-2xl">
        <DialogHeader className="flex-row items-center gap-3 space-y-0 border-b p-6">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
            <UserPlus className="size-5" />
          </div>
          <div className="text-left">
            <DialogTitle>Novo Cliente</DialogTitle>
            <DialogDescription>Cadastre um novo passageiro ou empresa para emissão.</DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-4 border-b px-6 py-4">
          <PersonTypeToggle value={personType} onChange={setPersonType} />
          <WizardStepIndicator steps={steps} currentStep={step} />
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <ClientWizardFormBody personType={personType} step={step} pfForm={pfForm} pjForm={pjForm} />
        </div>

        <div className="flex items-center justify-between border-t p-4">
          <Button type="button" variant="outline" onClick={handleBack} disabled={step === 0}>
            <ChevronLeft className="size-4" /> Voltar
          </Button>
          <Button type="button" onClick={handleNext} disabled={createClient.isPending}>
            {isLastStep ? (
              <>
                <Check className="size-4" /> Criar Cliente
              </>
            ) : (
              <>
                Próximo <ChevronRight className="size-4" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
