import { publicLinkAdapter } from '../adapters/public-link.adapter'

export function getPublicLinkSettings() {
  return publicLinkAdapter.get()
}

export function updatePublicLinkSettings(
  data: Parameters<typeof publicLinkAdapter.update>[0],
) {
  return publicLinkAdapter.update(data)
}

export function createManagedLink(data: { name: string; utmSource?: string }) {
  return publicLinkAdapter.createManagedLink(data)
}

export function deleteManagedLink(id: string) {
  return publicLinkAdapter.deleteManagedLink(id)
}

export function createTemporaryLink() {
  return publicLinkAdapter.createTemporaryLink()
}

export function deleteTemporaryLink(id: string) {
  return publicLinkAdapter.deleteTemporaryLink(id)
}
