import { useState } from 'react'
import { useWatch, type UseFormReturn } from 'react-hook-form'
import { FileCheck2, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import type { ClientPJFormValues } from '@/lib/validators/client'

async function mockFetchDelay() {
  await new Promise((resolve) => setTimeout(resolve, 600))
}

export function ClientPJStep1({ form }: { form: UseFormReturn<ClientPJFormValues> }) {
  const [loadingCnpj, setLoadingCnpj] = useState(false)

  async function handlePreencherDados() {
    setLoadingCnpj(true)
    await mockFetchDelay()
    form.setValue('razaoSocial', form.getValues('razaoSocial') || 'Vai de Tur Viagens e Turismo Ltda')
    form.setValue('nomeFantasia', form.getValues('nomeFantasia') || 'Vai de Tur')
    form.setValue('telefone', form.getValues('telefone') || '+55 11 91234-5678')
    form.setValue('email', form.getValues('email') || 'contato@vaidetur.com.br')
    setLoadingCnpj(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 rounded-xl border border-brand-primary/30 bg-brand-primary/10 p-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-primary text-white">
          <FileCheck2 className="size-4" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold">Preencha o cadastro com o CNPJ</p>
          <p className="text-xs text-muted-foreground">
            Digite o CNPJ para preencher razão social, nome fantasia, contato e endereço.
          </p>
        </div>
      </div>
      <div className="flex items-end gap-2">
        <FormField
          control={form.control}
          name="cnpj"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>CNPJ</FormLabel>
              <FormControl>
                <Input placeholder="00.000.000/0001-00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="button" onClick={handlePreencherDados} disabled={loadingCnpj} className="shrink-0">
          {loadingCnpj ? <Loader2 className="size-4 animate-spin" /> : <FileCheck2 className="size-4" />}
          Preencher dados
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="razaoSocial"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Razão Social *</FormLabel>
              <FormControl>
                <Input placeholder="Razão Social da empresa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nomeFantasia"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Fantasia</FormLabel>
              <FormControl>
                <Input placeholder="Nome Fantasia" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="telefone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telefone</FormLabel>
            <FormControl>
              <Input placeholder="+55 (11) 91234-5678" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder="contato@empresa.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="inscricaoEstadual"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Inscrição Estadual</FormLabel>
              <FormControl>
                <Input placeholder="IE" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="inscricaoMunicipal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Inscrição Municipal</FormLabel>
              <FormControl>
                <Input placeholder="IM" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="origemFonte"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Origem / Fonte</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="indicacao">Indicação</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="site">Site</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export function ClientPJStep3({ form }: { form: UseFormReturn<ClientPJFormValues> }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="representanteLegal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Representante Legal</FormLabel>
              <FormControl>
                <Input placeholder="Nome do responsável" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cargo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cargo</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Diretor, Gerente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="observacoesContato"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Observações</FormLabel>
            <FormControl>
              <Textarea placeholder="Informações adicionais sobre a empresa..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export function ClientPJStep4({ form }: { form: UseFormReturn<ClientPJFormValues> }) {
  const funcionarios = useWatch({ control: form.control, name: 'funcionarios' })

  return (
    <div className="rounded-xl border">
      {funcionarios.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Nenhum funcionário adicionado. Clique abaixo para adicionar.
        </p>
      ) : (
        <ul className="divide-y">
          {funcionarios.map((f, i) => (
            <li key={i} className="px-4 py-2 text-sm">
              {f.nome}
            </li>
          ))}
        </ul>
      )}
      <div className="border-t p-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => form.setValue('funcionarios', [...funcionarios, { nome: `Funcionário ${funcionarios.length + 1}` }])}
        >
          + Adicionar Funcionário
        </Button>
      </div>
    </div>
  )
}
