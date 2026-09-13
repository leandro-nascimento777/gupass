/**
 * Adapter do recurso "client-categories" — mesmo papel do clients.adapter:
 * só fala HTTP, sem regra de negócio.
 */
import { httpClient } from '@/lib/api/http-client'
import type { ClientCategory, Paginated } from '@/types/entities'

export const clientCategoriesAdapter = {
  list(params: { q?: string } = {}) {
    return httpClient.get<Paginated<ClientCategory>>('/client-categories', params)
  },
  create(data: Partial<ClientCategory>) {
    return httpClient.post<ClientCategory>('/client-categories', data)
  },
  update(id: string, data: Partial<ClientCategory>) {
    return httpClient.patch<ClientCategory>(`/client-categories/${id}`, data)
  },
  remove(id: string) {
    return httpClient.delete<void>(`/client-categories/${id}`)
  },
}
