import { clientCategoriesAdapter } from '../adapters/client-categories.adapter'
import type { ClientCategory } from '@/types/entities'

export function listClientCategories(params: { q?: string } = {}) {
  return clientCategoriesAdapter.list(params)
}

export function createClientCategory(data: Partial<ClientCategory>) {
  return clientCategoriesAdapter.create(data)
}

export function updateClientCategory(id: string, data: Partial<ClientCategory>) {
  return clientCategoriesAdapter.update(id, data)
}

export function deleteClientCategory(id: string) {
  return clientCategoriesAdapter.remove(id)
}
