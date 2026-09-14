import type { UseFormReturn } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import type { ClientPFFormValues, ClientPJFormValues } from '@/modules/clientes/validators/client.schema'
import { ClientPFStep1, ClientPFStep3, ClientPFStep4, ClientEnderecoStep } from './ClientPFStepFields'
import { ClientPJStep1, ClientPJStep3, ClientPJStep4 } from './ClientPJStepFields'

interface ClientWizardFormBodyProps {
  personType: 'PF' | 'PJ'
  step: number
  pfForm: UseFormReturn<ClientPFFormValues>
  pjForm: UseFormReturn<ClientPJFormValues>
  /** Campos ocultos no passo 1 — só usado pela página pública (ver Link Público). */
  hiddenFields?: string[]
}

/**
 * Passos 1-4 do wizard de cliente (Dados Pessoais/Empresa → Endereço →
 * Passaporte → Dependentes/Funcionários), com o `<Form>` do RHF já
 * conectado — usado tanto pelo modal interno (NovoClienteDialog) quanto pela
 * página pública (ClientePublicoPage), evitando duplicar o switch PF/PJ.
 */
export function ClientWizardFormBody({ personType, step, pfForm, pjForm, hiddenFields }: ClientWizardFormBodyProps) {
  if (personType === 'PF') {
    return (
      <Form {...pfForm}>
        <form>
          {step === 0 && <ClientPFStep1 form={pfForm} hiddenFields={hiddenFields} />}
          {step === 1 && <ClientEnderecoStep form={pfForm} />}
          {step === 2 && <ClientPFStep3 form={pfForm} />}
          {step === 3 && <ClientPFStep4 form={pfForm} />}
        </form>
      </Form>
    )
  }

  return (
    <Form {...pjForm}>
      <form>
        {step === 0 && <ClientPJStep1 form={pjForm} />}
        {step === 1 && <ClientEnderecoStep form={pjForm} />}
        {step === 2 && <ClientPJStep3 form={pjForm} />}
        {step === 3 && <ClientPJStep4 form={pjForm} />}
      </form>
    </Form>
  )
}
