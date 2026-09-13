import { httpClient } from './http-client'
import type { Client, ClientCategory, Paginated } from '@/types/entities'

export interface ListClientsParams {
  page?: number
  pageSize?: number
  q?: string
  personType?: 'PF' | 'PJ'
  [key: string]: string | number | boolean | undefined
}

export function fetchClients(params: ListClientsParams = {}) {
  return httpClient.get<Paginated<Client>>('/clients', params)
}

export function createClient(data: Partial<Client>) {
  return httpClient.post<Client>('/clients', data)
}

export function updateClient(id: string, data: Partial<Client>) {
  return httpClient.patch<Client>(`/clients/${id}`, data)
}

export function deleteClient(id: string) {
  return httpClient.delete<void>(`/clients/${id}`)
}

export function fetchClientCategories(params: { q?: string } = {}) {
  return httpClient.get<Paginated<ClientCategory>>('/client-categories', params)
}

export function createClientCategory(data: Partial<ClientCategory>) {
  return httpClient.post<ClientCategory>('/client-categories', data)
}

export function updateClientCategory(id: string, data: Partial<ClientCategory>) {
  return httpClient.patch<ClientCategory>(`/client-categories/${id}`, data)
}

export function deleteClientCategory(id: string) {
  return httpClient.delete<void>(`/client-categories/${id}`)
}
