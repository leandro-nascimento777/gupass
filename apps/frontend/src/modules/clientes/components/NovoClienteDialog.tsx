import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Building2, Check, ChevronLeft, ChevronRight, User, UserPlus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import {
  PF_STEPS,
  PF_STEP_FIELDS,
  PJ_STEPS,
  PJ_STEP_FIELDS,
  clientPFSchema,
  clientPJSchema,
  type ClientPFFormValues,
  type ClientPJFormValues,
} from '../validators/client.schema'
import { useCreateClient } from '../hooks/useClients'
import { WizardStepIndicator } from './WizardStepIndicator'
import { ClientPFStep1, ClientPFStep3, ClientPFStep4, ClientEnderecoStep } from './ClientPFStepFields'
import { ClientPJStep1, ClientPJStep3, ClientPJStep4 } from './ClientPJStepFields'

interface NovoClienteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const PF_DEFAULTS: ClientPFFormValues = {
  personType: 'PF',
  cpf: '',
  nomeCompleto: '',
  email: '',
  telefone: '',
  dataNascimento: '',
  nacionalidade: '',
  sexo: undefined,
  rg: '',
  origemFonte: undefined,
  cep: '',
  bairro: '',
  logradouro: '',
  numero: '',
  complemento: '',
  cidade: '',
  estado: '',
  numeroPassaporte: '',
  validadePassaporte: '',
  paisEmissor: '',
  observacoesPassaporte: '',
  responsavel: 'atual',
  dependentes: [],
}

const PJ_DEFAULTS: ClientPJFormValues = {
  personType: 'PJ',
  cnpj: '',
  razaoSocial: '',
  nomeFantasia: '',
  telefone: '',
  email: '',
  inscricaoEstadual: '',
  inscricaoMunicipal: '',
  origemFonte: undefined,
  cep: '',
  bairro: '',
  logradouro: '',
  numero: '',
  complemento: '',
  cidade: '',
  estado: '',
  representanteLegal: '',
  cargo: '',
  observacoesContato: '',
  funcionarios: [],
}

/** Wizard "Novo Cliente" — modal centralizado com 4 passos, PF/PJ (ver referência real). */
export function NovoClienteDialog({ open, onOpenChange }: NovoClienteDialogProps) {
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
          <div className="inline-flex w-fit items-center gap-1 rounded-full border bg-muted p-1">
            <button
              type="button"
              onClick={() => setPersonType('PF')}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium',
                personType === 'PF' ? 'bg-card shadow-sm' : 'text-muted-foreground',
              )}
            >
              <User className="size-3.5" /> Pessoa Física
            </button>
            <button
              type="button"
              onClick={() => setPersonType('PJ')}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium',
                personType === 'PJ' ? 'bg-card shadow-sm' : 'text-muted-foreground',
              )}
            >
              <Building2 className="size-3.5" /> Pessoa Jurídica
            </button>
          </div>

          <WizardStepIndicator steps={steps} currentStep={step} />
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {personType === 'PF' ? (
            <Form {...pfForm}>
              <form>
                {step === 0 && <ClientPFStep1 form={pfForm} />}
                {step === 1 && <ClientEnderecoStep form={pfForm} />}
                {step === 2 && <ClientPFStep3 form={pfForm} />}
                {step === 3 && <ClientPFStep4 form={pfForm} />}
              </form>
            </Form>
          ) : (
            <Form {...pjForm}>
              <form>
                {step === 0 && <ClientPJStep1 form={pjForm} />}
                {step === 1 && <ClientEnderecoStep form={pjForm} />}
                {step === 2 && <ClientPJStep3 form={pjForm} />}
                {step === 3 && <ClientPJStep4 form={pjForm} />}
              </form>
            </Form>
          )}
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
