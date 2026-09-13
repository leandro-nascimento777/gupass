import { httpClient } from '@/lib/api/http-client'
import type { DashboardKpis } from '@/types/entities'

export type DashboardPeriod = 'hoje' | 'ontem' | 'semana' | 'mes' | 'ano'

export const dashboardAdapter = {
  fetchKpis(period: DashboardPeriod) {
    return httpClient.get<DashboardKpis>('/dashboard', { period })
  },
}
