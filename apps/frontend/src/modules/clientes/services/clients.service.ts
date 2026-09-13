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

export function deleteClient(id: string) {
  return clientsAdapter.remove(id)
}

/**
 * Traduz os valores do wizard "Novo Cliente" (PF ou PJ) para o payload que a
 * API de clientes espera. Essa é a única regra "de negócio" deste módulo que
 * cabe no frontend — mapeamento de forma, não cálculo (ver SPEC seção 6).
 */
export function buildClientPayload(personType: PersonType, values: ClientFormValues): Partial<Client> {
  const isPF = personType === 'PF'
  return {
    personType,
    name: isPF ? (values as { nomeCompleto: string }).nomeCompleto : (values as { razaoSocial: string }).razaoSocial,
    email: values.email || undefined,
    phone: values.telefone || undefined,
    city: values.cidade || undefined,
    state: values.estado || undefined,
    document: isPF ? (values as { cpf?: string }).cpf : (values as { cnpj?: string }).cnpj,
    categoryIds: [],
  }
}

export function createClientFromWizard(personType: PersonType, values: ClientFormValues) {
  return clientsAdapter.create(buildClientPayload(personType, values))
}
