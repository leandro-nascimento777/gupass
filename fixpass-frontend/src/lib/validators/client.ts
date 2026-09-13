import { z } from 'zod'

/**
 * Schemas do wizard "Novo Cliente" (ver referência real — modal com 4 passos,
 * rótulos diferentes para PF/PJ). Cada objeto de step corresponde aos campos
 * validados antes de avançar (RHF `trigger(fieldNames)`), mas o form inteiro
 * (PF ou PJ) é uma única fonte de verdade — sem estado duplicado entre passos.
 */

const enderecoSchema = z.object({
  cep: z.string().optional(),
  bairro: z.string().optional(),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
})

export const clientPFSchema = z.object({
  personType: z.literal('PF'),
  // 1. Dados Pessoais
  cpf: z.string().optional(),
  nomeCompleto: z.string().min(1, 'Informe o nome completo'),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  telefone: z.string().optional(),
  dataNascimento: z.string().optional(),
  nacionalidade: z.string().optional(),
  sexo: z.string().optional(),
  rg: z.string().optional(),
  origemFonte: z.string().optional(),
  // 2. Endereço
  ...enderecoSchema.shape,
  // 3. Passaporte
  numeroPassaporte: z.string().optional(),
  validadePassaporte: z.string().optional(),
  paisEmissor: z.string().optional(),
  observacoesPassaporte: z.string().max(2000).optional(),
  // 4. Dependentes
  responsavel: z.string(),
  dependentes: z.array(z.object({ nome: z.string().min(1) })),
})

export const clientPJSchema = z.object({
  personType: z.literal('PJ'),
  // 1. Dados Empresa
  cnpj: z.string().optional(),
  razaoSocial: z.string().min(1, 'Informe a razão social'),
  nomeFantasia: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  inscricaoEstadual: z.string().optional(),
  inscricaoMunicipal: z.string().optional(),
  origemFonte: z.string().optional(),
  // 2. Endereço
  ...enderecoSchema.shape,
  // 3. Contato
  representanteLegal: z.string().optional(),
  cargo: z.string().optional(),
  observacoesContato: z.string().max(2000).optional(),
  // 4. Funcionários
  funcionarios: z.array(z.object({ nome: z.string().min(1) })),
})

export type ClientPFFormValues = z.infer<typeof clientPFSchema>
export type ClientPJFormValues = z.infer<typeof clientPJSchema>
export type ClientFormValues = ClientPFFormValues | ClientPJFormValues

export const PF_STEPS = ['Dados Pessoais', 'Endereço', 'Passaporte', 'Dependentes'] as const
export const PJ_STEPS = ['Dados Empresa', 'Endereço', 'Contato', 'Funcionários'] as const

/** Campos validados em cada passo (ver `trigger()` no wizard). */
export const PF_STEP_FIELDS: (keyof ClientPFFormValues)[][] = [
  ['nomeCompleto', 'email'],
  [],
  [],
  [],
]
export const PJ_STEP_FIELDS: (keyof ClientPJFormValues)[][] = [
  ['razaoSocial', 'email'],
  [],
  [],
  [],
]
