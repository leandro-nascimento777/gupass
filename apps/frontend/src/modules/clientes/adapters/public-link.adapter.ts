import { httpClient } from '@/lib/api/http-client'
import type { ClientPublicLinkSettings, ManagedPublicLink, TemporaryPublicLink } from '@/types/entities'

export const publicLinkAdapter = {
  get() {
    return httpClient.get<ClientPublicLinkSettings>('/clients/public-link-settings')
  },
  update(data: Partial<Pick<ClientPublicLinkSettings, 'theme' | 'backgroundColor' | 'hiddenFields'>>) {
    return httpClient.patch<ClientPublicLinkSettings>('/clients/public-link-settings', data)
  },
  createManagedLink(data: { name: string; utmSource?: string }) {
    return httpClient.post<ManagedPublicLink>('/clients/public-link-settings/managed-links', data)
  },
  deleteManagedLink(id: string) {
    return httpClient.delete<void>(`/clients/public-link-settings/managed-links/${id}`)
  },
  createTemporaryLink() {
    return httpClient.post<TemporaryPublicLink>('/clients/public-link-settings/temporary-links', {})
  },
  deleteTemporaryLink(id: string) {
    return httpClient.delete<void>(`/clients/public-link-settings/temporary-links/${id}`)
  },
}
