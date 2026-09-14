import { httpClient } from '@/lib/api/http-client'
import type { Paginated, Quote } from '@/types/entities'

export interface ListQuotesParams {
  page?: number
  pageSize?: number
  q?: string
  stage?: string
  clientId?: string
  [key: string]: string | number | boolean | undefined
}

export const quotesAdapter = {
  list(params: ListQuotesParams = {}) {
    return httpClient.get<Paginated<Quote>>('/quotes', params)
  },
  create(data: Partial<Quote>) {
    return httpClient.post<Quote>('/quotes', data)
  },
  update(id: string, data: Partial<Quote>) {
    return httpClient.patch<Quote>(`/quotes/${id}`, data)
  },
  remove(id: string) {
    return httpClient.delete<void>(`/quotes/${id}`)
  },
}
