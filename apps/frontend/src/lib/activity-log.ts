/**
 * Log de atividades (Central de Atividades, seção 3.1 da doc) — vários
 * módulos escrevem aqui (ex.: "cotação movida de X para Y" ao arrastar um
 * card no Kanban), então fica em `lib/` como helper compartilhado, não
 * dentro de um módulo só. Só grava; a tela de leitura (`/app/registros`)
 * é outro módulo, ainda não construído.
 */
import { httpClient } from './api/http-client'
import { useAuthStore } from './stores/auth-store'
import type { ActivityLogEntry } from '@/types/entities'

type LogActivityInput = Pick<ActivityLogEntry, 'category' | 'description'> &
  Partial<Pick<ActivityLogEntry, 'entityType' | 'entityRef'>>

export function logActivity(entry: LogActivityInput) {
  const user = useAuthStore.getState().user
  if (!user) return Promise.resolve(undefined)

  return httpClient.post<ActivityLogEntry>('/activity-log', {
    userId: user.id,
    userName: user.name,
    userInitials: user.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase(),
    ...entry,
  })
}
