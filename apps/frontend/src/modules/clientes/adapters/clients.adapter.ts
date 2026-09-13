/**
 * Adapter — única camada que conhece o formato HTTP do recurso "clients".
 * Não decide nada, só traduz chamada de rede em Promise tipada. Regra de
 * negócio (o que fazer com o resultado) vive no service, nunca aqui.
 */
import { httpClient } from '@/lib/api/http-client'
import type { Client, Paginated } from '@/types/entities'

export interface ListClientsParams {
  page?: number
  pageSize?: number
  q?: string
  personType?: 'PF' | 'PJ'
  [key: string]: string | number | boolean | undefined
}

export const clientsAdapter = {
  list(params: ListClientsParams = {}) {
    return httpClient.get<Paginated<Client>>('/clients', params)
  },
  create(data: Partial<Client>) {
    return httpClient.post<Client>('/clients', data)
  },
  update(id: string, data: Partial<Client>) {
    return httpClient.patch<Client>(`/clients/${id}`, data)
  },
  remove(id: string) {
    return httpClient.delete<void>(`/clients/${id}`)
  },
}
