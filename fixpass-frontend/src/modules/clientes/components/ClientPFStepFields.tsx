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
import type { ClientPFFormValues } from '@/lib/validators/client'

/**
 * Simula a consulta de CPF (Receita Federal/serviço terceiro) e o autofill de
 * CEP (tipo ViaCEP) mencionados na documentação — mock puro, sem integração
 * real (o frontend não implementa essa regra de negócio, só simula o resultado).
 */
async function mockFetchDelay() {
  await new Promise((resolve) => setTimeout(resolve, 600))
}

export function ClientPFStep1({ form }: { form: UseFormReturn<ClientPFFormValues> }) {
  const [loadingCpf, setLoadingCpf] = useState(false)

  async function handlePreencherDados() {
    setLoadingCpf(true)
    await mockFetchDelay()
    form.setValue('nomeCompleto', form.getValues('nomeCompleto') || 'Leandro Theodoro Nascimento')
    form.setValue('dataNascimento', form.getValues('dataNascimento') || '1987-12-11')
    form.setValue('sexo', form.getValues('sexo') || 'masculino')
    setLoadingCpf(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 rounded-xl border border-brand-primary/30 bg-brand-primary/10 p-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-primary text-white">
          <FileCheck2 className="size-4" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold">Preencha o cadastro com o CPF</p>
          <p className="text-xs text-muted-foreground">
            Digite o CPF para preencher automaticamente nome, data de nascimento e sexo.
          </p>
        </div>
      </div>
      <div className="flex items-end gap-2">
        <FormField
          control={form.control}
          name="cpf"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <Input placeholder="000.000.000-00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="button" onClick={handlePreencherDados} disabled={loadingCpf} className="shrink-0">
          {loadingCpf ? <Loader2 className="size-4 animate-spin" /> : <FileCheck2 className="size-4" />}
          Preencher dados
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="nomeCompleto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo *</FormLabel>
              <FormControl>
                <Input placeholder="Nome do passageiro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder="email@exemplo.com" {...field} />
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="dataNascimento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Nascimento</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nacionalidade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nacionalidade</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Brasileira" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="sexo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sexo</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="feminino">Feminino</SelectItem>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rg"
          render={({ field }) => (
            <FormItem>
              <FormLabel>RG</FormLabel>
              <FormControl>
                <Input placeholder="00.000.000-0" {...field} />
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

export function ClientEnderecoStep<T extends { cep?: string; bairro?: string; logradouro?: string; numero?: string; complemento?: string; cidade?: string; estado?: string }>({
  form,
}: {
  form: UseFormReturn<T>
}) {
  const [loadingCep, setLoadingCep] = useState(false)

  async function handleCepBlur() {
    const cep = form.getValues('cep' as never) as string | undefined
    if (!cep || cep.replace(/\D/g, '').length < 8) return
    setLoadingCep(true)
    await mockFetchDelay()
    form.setValue('bairro' as never, 'Loteamento Residencial Viva Vista' as never)
    form.setValue('logradouro' as never, 'Avenida José Carlos Amaral' as never)
    form.setValue('cidade' as never, 'Sumaré' as never)
    form.setValue('estado' as never, 'São Paulo (SP)' as never)
    setLoadingCep(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name={'cep' as never}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                CEP {loadingCep && <Loader2 className="size-3 animate-spin" />}
              </FormLabel>
              <FormControl>
                <Input placeholder="00000-000" {...field} onBlur={handleCepBlur} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={'bairro' as never}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bairro</FormLabel>
              <FormControl>
                <Input placeholder="Bairro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name={'logradouro' as never}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rua / Logradouro</FormLabel>
            <FormControl>
              <Input placeholder="Rua / Logradouro" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name={'numero' as never}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número</FormLabel>
              <FormControl>
                <Input placeholder="Nº" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={'complemento' as never}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Complemento</FormLabel>
              <FormControl>
                <Input placeholder="Apto, Bloco, Sala..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name={'cidade' as never}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade</FormLabel>
              <FormControl>
                <Input placeholder="Cidade" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={'estado' as never}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado (UF)</FormLabel>
              <FormControl>
                <Input placeholder="Estado (UF)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

export function ClientPFStep3({ form }: { form: UseFormReturn<ClientPFFormValues> }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="numeroPassaporte"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número do Passaporte</FormLabel>
              <FormControl>
                <Input placeholder="A123312B" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="validadePassaporte"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Validade</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="paisEmissor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>País Emissor</FormLabel>
              <FormControl>
                <Input placeholder="Brasil" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="observacoesPassaporte"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea placeholder="Informações adicionais..." className="min-h-9" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

export function ClientPFStep4({ form }: { form: UseFormReturn<ClientPFFormValues> }) {
  const dependentes = useWatch({ control: form.control, name: 'dependentes' })

  return (
    <div className="flex flex-col gap-4">
      <FormField
        control={form.control}
        name="responsavel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Responsável</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="atual">Manter como responsável atual</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="rounded-xl border">
        {dependentes.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Nenhum dependente adicionado. Clique abaixo para adicionar.
          </p>
        ) : (
          <ul className="divide-y">
            {dependentes.map((dep, i) => (
              <li key={i} className="px-4 py-2 text-sm">
                {dep.nome}
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
            onClick={() => form.setValue('dependentes', [...dependentes, { nome: `Dependente ${dependentes.length + 1}` }])}
          >
            + Adicionar Dependente
          </Button>
        </div>
      </div>
    </div>
  )
}
