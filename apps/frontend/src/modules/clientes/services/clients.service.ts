/**
 * Service — regra de aplicação do módulo Clientes. Não conhece React nem
 * TanStack Query (poderia ser testado isoladamente); orquestra o adapter e
 * concentra transformações que antes viviam na view (ex.: montar o payload
 * de criação a partir do form PF/PJ do wizard).
 */
import { clientsAdapter, type ListClientsParams } from '../adapters/clients.adapter'
import type { ClientFormValues } from '../validators/client.schema'
import type { Client, PersonType } from '@/types/entities'

export type { ListClientsParams }

export function listClients(params: ListClientsParams = {}) {
  return clientsAdapter.list(params)
}

export function getClient(id: string) {
  return clientsAdapter.get(id)
}

export function deleteClient(id: string) {
  return clientsAdapter.remove(id)
}

/**
 * Traduz os valores do wizard "Novo Cliente" (PF ou PJ) para o payload que a
 * API de clientes espera. Essa é a única regra "de negócio" deste módulo que
 * cabe no frontend — mapeamento de forma, não cálculo (ver SPEC seção 6).
 * Mapeia os 4 passos inteiros (não só o passo 1) — a Ficha do Cliente exibe
 * endereço e passaporte, então precisam ser persistidos, não descartados.
 */
export function buildClientPayload(personType: PersonType, values: ClientFormValues): Partial<Client> {
  const isPF = personType === 'PF'
  const pf = isPF ? (values as Extract<ClientFormValues, { personType: 'PF' }>) : undefined
  return {
    personType,
    name: isPF ? pf!.nomeCompleto : (values as { razaoSocial: string }).razaoSocial,
    email: values.email || undefined,
    phone: values.telefone || undefined,
    document: isPF ? pf!.cpf : (values as { cnpj?: string }).cnpj,
    birthDate: pf?.dataNascimento || undefined,
    nationality: pf?.nacionalidade || undefined,
    gender: pf?.sexo || undefined,
    rg: pf?.rg || undefined,
    sourceChannel: values.origemFonte || undefined,
    city: values.cidade || undefined,
    state: values.estado || undefined,
    zipCode: values.cep || undefined,
    neighborhood: values.bairro || undefined,
    street: values.logradouro || undefined,
    addressNumber: values.numero || undefined,
    complement: values.complemento || undefined,
    passportNumber: pf?.numeroPassaporte || undefined,
    passportExpiry: pf?.validadePassaporte || undefined,
    passportCountry: pf?.paisEmissor || undefined,
    categoryIds: [],
  }
}

export function createClientFromWizard(personType: PersonType, values: ClientFormValues) {
  return clientsAdapter.create(buildClientPayload(personType, values))
}
