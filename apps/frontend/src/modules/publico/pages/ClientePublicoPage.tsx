import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useSearchParams } from 'react-router-dom'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { WhatsappFab } from '@/components/layout/WhatsappFab'
import { WizardStepIndicator } from '@/components/shared/client-form/WizardStepIndicator'
import { PersonTypeToggle } from '@/components/shared/client-form/PersonTypeToggle'
import { ClientWizardFormBody } from '@/components/shared/client-form/ClientWizardFormBody'
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
} from '@/modules/clientes/validators/client.schema'
import { createClientFromWizard } from '@/modules/clientes/services/clients.service'
import type { PublicLinkTheme } from '@/types/entities'
import { usePublicClientLink } from '../hooks/usePublicClientLink'

const THEME_BACKGROUND: Record<PublicLinkTheme, string> = {
  classico: 'bg-slate-50',
  aviacao: 'bg-gradient-to-b from-sky-100 via-sky-50 to-white',
  nuvens: 'bg-gradient-to-b from-blue-50 via-white to-white',
}

const THEME_WATERMARK: Record<PublicLinkTheme, string> = {
  classico: '🏢',
  aviacao: '✈️',
  nuvens: '☁️',
}

export function ClientePublicoPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: linkInfo, isLoading, isError } = usePublicClientLink(slug ?? '')

  // Preview ao vivo da tela de config (ver ClientesPublicLinkPage): sobrepõe
  // tema/cor ainda não salvos, já que o iframe do preview roda num contexto
  // de mock separado e não veria um PATCH feito pela aba admin.
  const [searchParams] = useSearchParams()
  const previewTheme = searchParams.get('previewTheme') as PublicLinkTheme | null
  const previewBg = searchParams.get('previewBg')

  const [personType, setPersonType] = useState<'PF' | 'PJ'>('PF')
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const pfForm = useForm<ClientPFFormValues>({ resolver: zodResolver(clientPFSchema), defaultValues: PF_DEFAULTS })
  const pjForm = useForm<ClientPJFormValues>({ resolver: zodResolver(clientPJSchema), defaultValues: PJ_DEFAULTS })

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-slate-50 p-4">
        <Skeleton className="h-96 w-full max-w-lg rounded-2xl" />
      </div>
    )
  }

  if (isError || !linkInfo) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-2 bg-slate-50 p-4 text-center">
        <p className="text-lg font-bold">Link inválido ou expirado</p>
        <p className="text-sm text-muted-foreground">Peça um novo link para a agência.</p>
      </div>
    )
  }

  const steps = personType === 'PF' ? PF_STEPS : PJ_STEPS
  const stepFields = personType === 'PF' ? PF_STEP_FIELDS : PJ_STEP_FIELDS
  const isLastStep = step === steps.length - 1
  const theme = previewTheme ?? linkInfo.theme
  const backgroundColor = previewBg ?? linkInfo.backgroundColor
  const backgroundStyle = backgroundColor ? { backgroundColor } : undefined

  async function handleNext() {
    const form = personType === 'PF' ? pfForm : pjForm
    const fields = stepFields[step]
    const valid = fields.length === 0 || (await form.trigger(fields as never))
    if (!valid) return

    if (isLastStep) {
      setSubmitting(true)
      await createClientFromWizard(personType, form.getValues())
      setSubmitting(false)
      setSubmitted(true)
      return
    }
    setStep((s) => s + 1)
  }

  if (submitted) {
    return (
      <div
        className={cn('flex min-h-svh flex-col items-center justify-center gap-3 p-4 text-center', !backgroundStyle && THEME_BACKGROUND[theme])}
        style={backgroundStyle}
      >
        <div className="flex size-16 items-center justify-center rounded-full bg-success/15 text-success">
          <Check className="size-8" />
        </div>
        <h1 className="text-xl font-black">Cadastro recebido!</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Obrigado. A equipe da {linkInfo.agencyName} já tem seus dados e vai entrar em contato em breve.
        </p>
      </div>
    )
  }

  return (
    <div
      className={cn('relative flex min-h-svh flex-col items-center gap-6 overflow-hidden p-4 py-10', !backgroundStyle && THEME_BACKGROUND[theme])}
      style={backgroundStyle}
    >
      <span className="pointer-events-none absolute -top-6 -right-6 text-[160px] opacity-10">
        {THEME_WATERMARK[theme]}
      </span>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">Cadastro</p>
        <h1 className="text-2xl font-black tracking-tight">{linkInfo.agencyName}</h1>
        <p className="text-sm text-muted-foreground">Preencha seus dados para completar o cadastro.</p>
      </div>

      <Card className="w-full max-w-xl rounded-2xl shadow-sm">
        <CardContent className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-4">
            <PersonTypeToggle value={personType} onChange={setPersonType} />
            <WizardStepIndicator steps={steps} currentStep={step} />
          </div>

          <ClientWizardFormBody
            personType={personType}
            step={step}
            pfForm={pfForm}
            pjForm={pjForm}
            hiddenFields={linkInfo.hiddenFields}
          />

          <div className="flex items-center justify-between border-t pt-4">
            <Button type="button" variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              <ChevronLeft className="size-4" /> Voltar
            </Button>
            <Button type="button" onClick={handleNext} disabled={submitting}>
              {isLastStep ? (
                <>
                  <Check className="size-4" /> Concluir Cadastro
                </>
              ) : (
                <>
                  Próximo <ChevronRight className="size-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <p className="max-w-sm text-center text-xs text-muted-foreground">
        Seus dados serão usados apenas pela empresa {linkInfo.agencyName}.
      </p>

      <WhatsappFab />
    </div>
  )
}
